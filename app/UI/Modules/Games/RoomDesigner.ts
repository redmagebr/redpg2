module UI.Games.RoomDesigner {
    var currentGame : Game = null;
    var currentRoom : Room = null;
    var nameInput : HTMLInputElement = <HTMLInputElement> document.getElementById("roomDesignerName");
    var descInput : HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("roomDesignerMessage");

    var $error = $(document.getElementById("roomDesignerError"));

    document.getElementById("roomDesignerForm").addEventListener("submit", function (e) {
        e.preventDefault();
        UI.Games.RoomDesigner.submit();
    });

    function clear () {
        nameInput.value = "";
        descInput.value = "";
        $error.stop().hide();
    }

    export function callSelf (game : Game, room? : Room) {
        currentGame = game;
        currentRoom = room === undefined ? null : room;

        clear();
        if (currentRoom !== null) {
            nameInput.value = currentRoom.name;
            descInput.value = currentRoom.description;
        }
        UI.PageManager.callPage(UI.idRoomDesigner);
    }

    export function toRoom () : Room {
        var room : Room;
        if (currentRoom !== null) {
            room = currentRoom;
        } else {
            room = new Room();
            room.gameid = currentGame.id;
        }

        room.name = nameInput.value.trim();
        room.description = descInput.value.trim();

        return room;
    }

    export function submit() {
        var cbs = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.callSelf();
            }
        };

        var cbe = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.RoomDesigner.showError();
            }
        };

        if (currentRoom === null) {
            Server.Games.createRoom(toRoom(), cbs, cbe);
        } else {
            // TODO: Call Server.Games.editRoom(toRoom(), cbs, cbe);
        }
    }

    export function showError () {
        $error.fadeIn(Application.Config.getConfig("animTime").getValue())
    }
}