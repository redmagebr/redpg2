module Server.Chat {
    var ROOM_URL = "Room";
    export var CHAT_URL = "Chat";

    var emptyCallback = <Listener> {handleEvent:function(){}};

    var socketController : ChatController  = new ChatWsController();
    var pollingController : ChatController;

    export var currentController : ChatController = socketController;
    var currentRoom : Room = null;

    var openListener : Listener = undefined;
    var errorListener : Listener = undefined;

    var messageTrigger = new Trigger();
    var personaTrigger = new Trigger();
    var statusTrigger = new Trigger();
    var disconnectTrigger = new Trigger();

    var personaInfo : PersonaInfo = <PersonaInfo> {
        afk : false,
        focused : true,
        typing : false,
        persona : null,
        avatar : null
    }; // "persona":null,"avatar":null}]

    var reconnecting : boolean = false;
    var reconnectAttempts : number = 0;
    var maxReconnectAttempts : number = 5;

    Application.Login.addListener(function (isLogged : boolean) {
        if (!isLogged) {
            Server.Chat.end();
        }
    });

    export function isReconnecting () {
        return reconnecting;
    }

    export function setConnected () {
        reconnectAttempts = 0;
        reconnecting = false;

        UI.Chat.Notification.hideDisconnected();
        UI.Chat.Notification.hideReconnecting();
    }

    export function giveUpReconnect () {
        var reconnectPls = <Listener> {
            room : currentRoom,
            handleEvent : function () {
                Server.Chat.enterRoom(this.room.id)
            }
        };

        var reconnectForMe = new ChatSystemMessage(true);
        reconnectForMe.addText("_CHATYOUAREDISCONNECTED_");
        reconnectForMe.addText(" ");
        reconnectForMe.addTextLink("_CHATDISCONNECTEDRECONNECT_", true, reconnectPls);

        UI.Chat.printElement(reconnectForMe.getElement(), true);
        UI.Chat.Notification.hideReconnecting();
        UI.Chat.Notification.showDisconnected();
    }

    export function reconnect () {
        if (currentRoom === null) {
            return; // intentional disconnect
        }

        UI.Chat.Notification.showReconnecting();

        if (reconnectAttempts++ <= maxReconnectAttempts && Application.Login.isLogged()) {
            reconnecting = true;
            enterRoom(currentRoom.id);
        } else {
            giveUpReconnect();
        }
    }

    export function leaveRoom () {
        currentRoom = null;
        reconnecting = false;
        currentController.end();
    }

    export function enterRoom (roomid : number) {
        currentRoom = DB.RoomDB.getRoom(roomid);
        if (currentRoom === null) {
            console.error("[CHAT] Entering an unknown room at id " + roomid + ". Risky business.");
        }

        UI.Chat.Notification.showReconnecting();

        if (currentController.isReady()) {
            currentController.enterRoom(roomid);
        } else {
            currentController.onReady = <Listener> {
                controller : currentController,
                roomid : roomid,
                handleEvent : function () {
                    this.controller.enterRoom(this.roomid);
                }
            };
            currentController.start();
        }
    }

    export function sendStatus (info : PersonaInfo) {
        if (currentController.isReady()) {
            currentController.sendStatus(info);
        }
    }

    export function sendPersona (info : PersonaInfo) {
        if (currentController.isReady()) {
            currentController.sendPersona(info);
        } else {
            console.debug("[CHAT] Attempt to send Persona while disconnected. Ignoring.", info);
        }
    }

    export function isConnected () {
        return currentController.isReady();
    }

    export function sendMessage (message : Message) {
        if (currentController.isReady()) {
            currentController.sendMessage(message);
            message.roomid = currentRoom.id;
        } else {
            console.warn("[CHAT] Attempt to send messages while disconnected. Ignoring. Offending Message:", message);
        }
    }

    export function hasRoom () : boolean {
        return currentRoom !== null;
    }

    export function getRoom () : Room {
        return currentRoom;
    }

    export function getAllMessages (roomid : number, cbs? : Listener, cbe? : Listener) {
        if (!DB.RoomDB.hasRoom(roomid)) {
            console.warn("[CHAT] Attempted to load messages for undefined room.");
            if (cbe !== undefined) cbe.handleEvent();
            return;
        }
        var success : Listener = <Listener> {
            roomid : roomid,
            cbs : cbs,
            handleEvent : function (response, xhr) {
                DB.RoomDB.getRoom(this.roomid).updateFromObject({messages : response}, true);
                if (this.cbs !== undefined) this.cbs.handleEvent(response, xhr);
            }
        };

        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(ROOM_URL);
        ajax.setResponseTypeJSON();
        ajax.data = {action : "messages", roomid : roomid};
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function end () {
        currentRoom = null;
        currentController.end();
    }

    export function addStatusListener (f : Function | Listener) {
        statusTrigger.addListener(f);
    }

    export function triggerStatus (info : Object) {
        statusTrigger.trigger(info);
    }

    export function addPersonaListener (f : Function | Listener) {
        personaTrigger.addListener(f);
    }

    export function triggerPersona (f : Object) {
        personaTrigger.trigger(f);
    }

    export function addMessageListener (f : Function | Listener) {
        messageTrigger.addListener(f);
    }

    export function triggerMessage (f : Message) {
        messageTrigger.trigger(f);
    }

    // Set up controllers
    (function () {
        var getRoom = <Listener> {
            handleEvent : function (e) {
                var room = Server.Chat.getRoom();

                var users = [];
                for (var id in e[1]) {
                    e[1][id]['id'] = id;
                    users.push(e[1][id]);
                }

                UI.Chat.Avatar.resetForConnect();

                room.updateFromObject({users : users}, true);
                Server.Chat.Memory.updateFromObject(e[2]);
                room.updateFromObject({messages : e[3]}, false);

                if (!Server.Chat.isReconnecting()) {
                    UI.Chat.clearRoom();
                    UI.Chat.printGetAllButton();
                }
                Server.Chat.setConnected();
                UI.Chat.Avatar.updateFromObject(users, true);
                UI.Chat.printMessages(room.getOrderedMessages(), false);
            }
        };
        socketController.addMessageListener("getroom", getRoom);

        var status = <Listener> {
            handleEvent : function (array) {
                var info = {
                    id : array[1],
                    typing : array[2] === 1,
                    idle : array[3] === 1,
                    focused : array[4] === 1
                };
                UI.Chat.Avatar.updateFromObject([info], false);
                Server.Chat.triggerStatus(info);
            }
        };
        socketController.addMessageListener("status", status);

        var persona = <Listener> {
            handleEvent : function (array) {
                var info = {
                    id : array[1],
                    persona : array[2]['persona'] === undefined ? null : array[2]['persona'],
                    avatar : array[2]['avatar'] === undefined ? null : array[2]['avatar'],
                };
                UI.Chat.Avatar.updateFromObject([info], false);
                Server.Chat.triggerPersona(info);
            }
        };
        socketController.addMessageListener("persona", persona);

        var left = <Listener> {
            handleEvent : function (array) {
                var info = {
                    id : array[1],
                    online : false
                };
                UI.Chat.Avatar.updateFromObject([info], false);
            }
        };
        socketController.addMessageListener("left", left);


        var joined = <Listener> {
            handleEvent : function (array) {
                array[1].roomid = currentRoom.id;
                DB.UserDB.updateFromObject([array[1]]);
                UI.Chat.Avatar.updateFromObject([array[1]], false);
            }
        };
        socketController.addMessageListener("joined", joined);


        var message = <Listener> {
            handleEvent : function (array) {
                Server.Chat.getRoom().updateFromObject({messages : [array[1]]}, false);
                var message = DB.MessageDB.getMessage(array[1]['id']);
                if (message.localid === null) {
                    UI.Chat.printMessage(message);
                }
                Server.Chat.triggerMessage(message);
            }
        };
        socketController.addMessageListener("message", message);


        var memory = <Listener> {
            handleEvent : function (array) {
                Server.Chat.Memory.updateFromObject(array[2]);
            }
        };
        socketController.addMessageListener("memory", memory);



        var reconnectF = <Listener> {
            handleEvent : function () {
                Server.Chat.reconnect();
            }
        };
        socketController.addCloseListener(reconnectF);
    })();
}