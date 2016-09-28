module UI.Chat {
    var lastDate : string = "";

    // Main Box
    var chatBox : HTMLElement = document.getElementById("chatBox");
    var $chatBox : JQuery = $(chatBox);
    var $chatBoxScrollDown : JQuery = $("#chatScrollDown");
    $chatBoxScrollDown[0].style.display = "none";


    // Help messages
    var chatHelperss : NodeList = document.getElementsByClassName("chatInitHelp");
    // NodeList loses values if they are unattached to the DOM
    var chatHelpers : Array<HTMLElement> = [];
    for (var i = 0; i < chatHelperss.length; i++) {
        chatHelpers.push(<HTMLElement> chatHelperss[i]);
    }
    delete(i, chatHelperss);

    // Config Listeners
    Application.Config.getConfig("chatfontsize").addChangeListener(<Listener> {
        chatBox : chatBox,
        handleEvent : function () {
            this.chatBox.style.fontSize = Application.Config.getConfig("chatfontsize").getValue() + "px";
            UI.Chat.updateScrollPosition(true);
        }
    });
    chatBox.style.fontSize = Application.Config.getConfig("chatfontsize").getValue() + "px";

    Application.Config.getConfig("chatfontfamily").addChangeListener(<Listener> {
        chatBox : chatBox,
        handleEvent : function () {
            this.chatBox.style.fontFamily = Application.Config.getConfig("chatfontfamily").getValue();
        }
    });
    chatBox.style.fontFamily = Application.Config.getConfig("chatfontfamily").getValue();

    Application.Config.getConfig("chatshowhelp").addChangeListener(<Listener> {
        chatHelpers : chatHelpers,
        handleEvent : function (e : BooleanConfiguration) {
            for (var i = 0; i < this.chatHelpers.length; i++) {
                this.chatHelpers[i].style.display = e.getValue() ? "" : "none";
            }
        }
    });

    // Title and description
    var chatTitleNode : Text = document.createTextNode("Title");
    var chatDescriptionNode : Text = document.createTextNode("Description");
    document.getElementById("chatTitle").appendChild(chatTitleNode);
    document.getElementById("chatDescription").appendChild(chatDescriptionNode);


    // Floater
    var chatInfoFloater = new ChatInfo(document.getElementById("chatFloater"));

    // Message target
    var chatTarget : HTMLElement = document.getElementById("chatMessages");

    // Variables
    var printingMany : boolean = false;
    var lastPrintedId : number = 0;
    var scrolledDown : boolean = true;
    var currentRoom : Room = null;
    //var roomListeners : Array<Listener> = [];
    var roomTrigger = new Trigger();
    export var messageCounter : number = 0;

    export function doAutomation () {
        return !printingMany;
    }

    export function callSelf (roomid : number) {
        UI.PageManager.callPage(UI.idChat);
        clearRoom();
        Server.Chat.enterRoom(roomid);

        var room = DB.RoomDB.getRoom(roomid);

        chatTitleNode.nodeValue = room.name;
        chatDescriptionNode.nodeValue = room.description;
        currentRoom = room;
        triggerRoomChanged();
    }

    export function addRoomChangedListener (listener : Listener | Function) {
        roomTrigger.addListener(listener);
    }

    function triggerRoomChanged () {
        roomTrigger.trigger(currentRoom);
    }

    export function getRoom () {
        return currentRoom;
    }

    export function clearRoom () {
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        lastDate = year + "-" + month + "-" + day;

        var parent = chatTarget.parentNode;
        parent.removeChild(chatTarget);
        while (chatTarget.lastChild !== null) {
            chatTarget.removeChild(chatTarget.lastChild);
        }
        parent.appendChild(chatTarget);
        lastPrintedId = 0;
        messageCounter = 0;
    }

    export function printElement (element : HTMLElement, doScroll? : boolean) {
        chatTarget.appendChild(element);
        messageCounter++;

        if (doScroll === undefined || doScroll) {
            updateScrollPosition();
        }

        var maxMessages = $.browser.mobile ? Application.Config.getConfig("chatMaxMessages").getDefault() : Application.Config.getConfig("chatMaxMessages").getValue();
        if (messageCounter > maxMessages) {
            messageCounter = chatTarget.children.length;
            while (messageCounter > (maxMessages / 2)) {
                messageCounter--;
                chatTarget.removeChild(chatTarget.firstChild);
            }
            //printGetAllButtonAtStart();
            // this is about too many messages, not some missing
            printNotallAtStart();
        }
    }

    export function printMessage (message : Message, doScroll? : boolean) {
        var element = message.getHTML();
        if (element !== null) {
            if (message.getDate() !== null && message.getDate() !== lastDate) {
                lastDate = message.getDate();
                var msg = new ChatSystemMessage(true);
                msg.addText("_CHATMESSAGESFROM_");
                msg.addLangVar("a", lastDate);
                printElement(msg.getElement());
            }

            chatInfoFloater.bindMessage(message, element);
            printElement(element);
        }
        if (message.id > lastPrintedId) {
            lastPrintedId = message.id;
        }
        message.onPrint();
        if (doScroll === undefined || doScroll) {
            updateScrollPosition();
        }
    }

    export function printMessages (messages : Array<Message>, ignoreLowIds : boolean) {
        // Initiate printing mode
        printingMany = true;

        // Maximum amount of messages allowed Config
        var maxMessages =
                    $.browser.mobile ?
                    Application.Config.getConfig("chatMaxMessages").getDefault()
                    :
                    Application.Config.getConfig("chatMaxMessages").getValue();

        // Do we have more messages than allowed?
        var i : number;
        var counting = 0;
        for (i = messages.length -1; i >= 0; i--) {
            if (messages[i].getHTML() !== null) {
                // I don't why 4 works but it does and I'm not feeling like finding out
                if (++counting > (maxMessages - 4)) {
                    break;
                }
            }
        }

        // Are we going to print only part of the messages?
        if (i >= 0) {
            // i > 0 means that we reached the maxMessages Limit
            // i === 0 means that we have the exact amount of messages we are allowed to print.
            clearRoom();

            // If we're not printing all of them, we need to say so
            if (i > 0) {
                var msg = new ChatSystemMessage(true);
                msg.addText("_CHATNOTALLMESSAGES_");
                printElement(msg.getElement());
            }
        } else {
            // i < 0 means we can print them all.
            i = 0;
        }

        // Detach parent to speed up process
        var parent = chatTarget.parentNode;
        parent.removeChild(chatTarget);

        // Actually print the messages
        while (i < messages.length) {
            if (!messages[i].doNotPrint() && (ignoreLowIds || messages[i].id > lastPrintedId)) {
                printMessage(messages[i], false);
            }
            i++;
        }

        // Reatach parent
        parent.appendChild(chatTarget);

        // Stop printing mode
        printingMany = false;

        // Scroll down to bottom, if necessary
        updateScrollPosition();
    }

    export function updateScrollPosition (instant ? : boolean) {
        instant = instant === undefined ? true : instant;
        if (scrolledDown) {
            if (instant) chatBox.scrollTop = chatBox.scrollHeight - chatBox.offsetHeight + 10;
            else $chatBox.stop().animate({
                scrollTop : chatBox.scrollHeight - chatBox.offsetHeight + 10
            }, Application.Config.getConfig("animTime").getValue());
        }
    }

    export function setScrolledDown (state : boolean) {
        if (scrolledDown === state) return;
        scrolledDown = state;
        if (scrolledDown) {
            $chatBoxScrollDown.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
        } else {
            $chatBoxScrollDown.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
        }
    }

    export function sendMessage (message : Message) {
        if (currentRoom === null) {
            console.warn("[CHAT] Attempt to send messages while not in a room. Ignoring. Offending message:", message);
            return;
        }
        message.roomid = currentRoom.id;
        message.prepareSending();
        printMessage(message);

        Server.Chat.sendMessage(message);
    }

    export function getGetAllButton () {
        var getAllForMe = <Listener> {
            room : currentRoom,
            handleEvent : function () {
                var cbs = {
                    handleEvent : function () {
                        UI.Chat.clearRoom();
                        UI.Chat.printMessages(UI.Chat.getRoom().getOrderedMessages(), false);
                    }
                };
                Server.Chat.getAllMessages(this.room.id, cbs);
            }
        };

        var getAllForMeText = new ChatSystemMessage(true);
        getAllForMeText.addText("_CHATOLDMESSAGESNOTLOADED_");
        getAllForMeText.addText(" ");
        getAllForMeText.addTextLink("_CHATOLDMESSAGESLOAD_", true, getAllForMe);
        return getAllForMeText.getElement();
    }

    export function leave () {
        Server.Chat.end();
        currentRoom = null;
        triggerRoomChanged();

        UI.Games.callSelf();
    }

    export function printGetAllButtonAtStart () {
        if (chatTarget.firstChild !== null) {
            var html = getGetAllButton();
            chatTarget.insertBefore(html, chatTarget.firstChild);
        } else {
            printGetAllButton();
        }
    }

    export function printNotallAtStart () {
        var msg = new ChatSystemMessage(true);
        msg.addText("_CHATNOTALLMESSAGES_");
        if (chatTarget.firstChild !== null) {
            chatTarget.insertBefore(msg.getElement(), chatTarget.firstChild);
        } else {
            printElement(msg.getElement());
        }
    }

    export function printGetAllButton () {
        printElement(getGetAllButton());
    }

    chatBox.addEventListener("scroll", function (a) {
        var minScroll = this.scrollHeight - this.offsetHeight - 10;
        var currentScroll = this.scrollTop;
        UI.Chat.setScrolledDown(currentScroll >= minScroll);
    });

    $chatBoxScrollDown[0].addEventListener("click", function () {
        UI.Chat.setScrolledDown(true);
        UI.Chat.updateScrollPosition(false);
    });

    /**
     * Initialize with mock up chat messages to force preloading of fonts
     */
    clearRoom();
    for (var i = 0; i < 1; i++) {
        var messages:Array<Message> = MessageFactory.createTestingMessages();
        printMessages(messages, true);
        delete(messages);
        DB.MessageDB.releaseAllLocalMessages(); // On clear, all temporary messages will be lost anyway. This ties up loose ends.
    }
    delete(i);

    var chatButton = document.getElementById("openChatButton");
    chatButton.style.display = "none";

    chatButton.addEventListener("click", function () {
        UI.PageManager.callPage(UI.idChat);
        UI.Chat.updateScrollPosition(true);
    });

    addRoomChangedListener(<Listener> {
        button : chatButton,
        handleEvent : function (room : Room) {
            if (room === null) {
                this.button.style.display = "none";
            } else {
                this.button.style.display = "";
            }
        }
    });
}