module UI.Rooms {
    export function deleteRoom (room : Room) {
        var cbs = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.callSelf(false);
            }
        }

        Server.Games.deleteRoom(room.id, cbs, cbs);
    }
}