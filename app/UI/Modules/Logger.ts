module UI.Logger {
    var $slider = $(document.getElementById("loggerSlider"));
    var window = document.getElementById("loggerWindow");
    var $window = $(window);

    var currentRoom : Room;

    var acceptedModules : Array<string>;
    var messages : Array<Message>;
    var currentLeft : number;
    var currentRight : number;

    var messagesToPrint = 3;
    var printTarget = document.getElementById("loggerTarget");

    var checkboxesTarget = document.getElementById("loggerCheckboxes");

    document.getElementById("loggerSubmit").addEventListener("click", function(e) {
        e.preventDefault();
        UI.Logger.submit();
    });

    export function callSelf (room : Room) {
        open();
        currentRoom = room;
        messages = currentRoom.getOrderedMessages();
        currentLeft = 0;
        currentRight = messages.length - 1;
        updateSlider();
        updateCheckboxes();
        updateMessages();
    }

    export function filter () : Array<Message> {
        var newMessages = [];

        for (var i = currentLeft; i <= currentRight; i++) {
            if (acceptedModules.indexOf(messages[i].module) !== -1) {
                newMessages.push(messages[i]);
            }
        }

        return newMessages;
    }

    export function updateSlider () {
        var min = 0;
        var max = messages.length - 1;

        $slider.slider({
            range: true,
            min: min,
            max: max,
            values: [ currentLeft, currentRight ],
            slide: function( event, ui ) {
                UI.Logger.setSlider(ui.values[0], ui.values[1]);
            }
        });
    }

    export function updateMessages () {
        while (printTarget.firstChild) printTarget.removeChild(printTarget.firstChild);

        var filtered = filter();
        if (filtered.length < messagesToPrint * 2) {
            for (var i = 0; i < filtered.length; i++) {
                var ele = filtered[i].getHTML();
                if (ele !== null) printTarget.appendChild(ele);
            }
        } else {
            for (var i = 0; i <= messagesToPrint; i++) {
                var ele = filtered[i].getHTML();
                if (ele !== null) printTarget.appendChild(ele);
            }

            var p = document.createElement("p");
            p.appendChild(document.createTextNode("........"));
            printTarget.appendChild(p);

            for (var i = (filtered.length - 1 - messagesToPrint); i < filtered.length; i++) {
                var ele = filtered[i].getHTML();
                if (ele !== null) printTarget.appendChild(ele);
            }
        }
    }

    export function updateCheckboxes () {
        while (checkboxesTarget.firstChild) checkboxesTarget.removeChild(checkboxesTarget.firstChild);

        var msgTypes = MessageFactory.getMessagetypeArray();
        for (var i = 0; i < msgTypes.length; i++) {
            // TODO: Implement module strings as static
        }

        var msgModules = [];
        for (var i = 0; i < messages.length; i++) {
            if (msgModules.indexOf(messages[i].module) === -1) {
                msgModules.push(messages[i].module);
            }
        }
        msgModules.sort();

        acceptedModules = [];
        for (var i = 0; i < msgModules.length; i++) {
            acceptedModules.push(msgModules[i]);
            var label = document.createElement("label");
            label.classList.add("loggerLabel");
            var input = document.createElement("input");
            input.type = "checkbox";
            input.checked = true;
            label.appendChild(input);
            label.appendChild(document.createTextNode(msgModules[i]));

            input.addEventListener("change", <EventListenerObject> {
                input : input,
                module : msgModules[i],
                handleEvent : function () {
                    UI.Logger.setModule(this.module, this.input.checked);
                }
            });

            checkboxesTarget.appendChild(label);
        }
    }

    export function setModule (module : string, acceptable : boolean) {
        if (acceptable) {
            if (acceptedModules.indexOf(module) === -1) {
                acceptedModules.push(module);
            }
        } else {
            var pos = acceptedModules.indexOf(module);
            if (pos !== -1) {
                acceptedModules.splice(pos, 1);
            }
        }
        updateMessages();
    }

    export function setSlider (left, right) {
        currentLeft = left < 0 ? 0 : left;
        currentRight = right >= messages.length ? messages.length - 1 : right;
        updateMessages();
    }

    export function open() {
        $window.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
    }

    export function close() {
        $window.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
    }

    var html : string;
    var js : string;
    export function submit () {
        html = null;
        js = null;

        var cbe = function () {};

        var cbsHTML = function (html) {
            UI.Logger.setHTML(html);
        };

        var cbsJS = function (js) {
            UI.Logger.setJS(js);
        };

        var ajaxHTML = new AJAXConfig(Server.CLIENT_URL + "index.html?" + (new Date).getTime());
        ajaxHTML.setResponseTypeText();
        ajaxHTML.setTargetLeftWindow();
        Server.AJAX.requestPage(ajaxHTML, cbsHTML, cbe);

        var ajaxJS = new AJAXConfig(Server.CLIENT_URL + "js/Application.js?" + (new Date).getTime());
        ajaxJS.setResponseTypeText();
        ajaxJS.setTargetLeftWindow();
        Server.AJAX.requestPage(ajaxJS, cbsJS, cbe);
    }

    export function setHTML (code) {
        html = code;
        if (js !== null) {
            saveLog();
        }
    }

    export function setJS (code) {
        js = code;
        if (html !== null) {
            saveLog();
        }
    }

    export function giveMeLog() {
        return currentRoom.getGame().exportAsLog(currentRoom.id, filter());
    }

    function hardReplace (str : string, target : string, replaceWith : string) : string {
        var idx = str.indexOf(target);
        var tarLength = target.length;
        var strLength = str.length;
        return str.substr(0, idx) + replaceWith + str.substr(idx + tarLength, strLength - idx - tarLength);
    }

    export function saveLog () {
        var log = currentRoom.getGame().exportAsLog(currentRoom.id, filter());

        js = "<script type='text/javascript'>" + js + "\nUI.Logger.openLog(" + JSON.stringify(log) + ");" + "<\/script>"

        html = html.replace(new RegExp("href='stylesheets", 'g'), "href='" + Server.CLIENT_URL + "stylesheets");
        html = html.replace(new RegExp("href='images", 'g'), "href='" + Server.CLIENT_URL + "images");
        html = html.replace(new RegExp("src='js/lib", 'g'), "src='" + Server.CLIENT_URL + "js/lib");
        html = hardReplace(html, "<script src='js/Application.js' type='text/javascript'><\/script>", js);

        var blob = new Blob([html], { type : "text/plain;charset=utf-8;"});
        var d = new Date();
        var curr_date = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
        var curr_month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
        var curr_year = d.getFullYear();

        var roomName = currentRoom.name;
        var gameName = currentRoom.getGame().getName();

        saveAs(blob, gameName + " - " + roomName + " (" + curr_year + curr_month + curr_date + ").html");
    }

    export function openLog (log) {
        Application.Config.getConfig("chatMaxMessages").storeValue(log['rooms'][0]['messages'].length + 10);
        DB.GameDB.updateFromObject([log], true);
        UI.WindowManager.callWindow(('mainWindow'));
        UI.PageManager.callPage(UI.idChat);
        UI.Chat.callSelf(0, true);
        document.getElementById("chatMessageStateIcon").style.display="none";
        document.getElementById("leftHandleBar").style.display="none";
        document.getElementById("rightHandleBar").style.display="none";
        document.getElementById("chatMessageBox").style.display="none";
        document.getElementById("chatMessageSendButton").style.display="none";
        document.getElementById("personaBox").style.display="none";
        document.getElementById("diceFormBox").style.display="none";
        document.getElementById("bottomBox").style.display="none";
        document.getElementById("avatarBox").style.display="none";
        document.getElementById("avatarUpButton").style.display="none";
        document.getElementById("avatarDownButton").style.display="none";
        document.getElementById("chatButtonsBox").style.top="5px";
        document.getElementById("chatBox").style.top="5px";
        document.getElementById("chatBox").style.bottom="5px";
        document.getElementById("chatScrollDown").style.bottom="15px";
        document.getElementById("leftSideWindow").style.left="0px";
        document.getElementById("rightSideWindow ").style.right="0px";
        UI.Chat.scrollToTop();
    }
}