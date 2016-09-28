module UI.Rooms.Designer {
    function clear () {

    }

    export function fromRoom (room? : Room) {
        clear();
        room = room === undefined ? null : room;
        if (room !== null) {

        }
    }

    export function toRoom () : Room {
        var room = new Room();

        return room;
    }
}