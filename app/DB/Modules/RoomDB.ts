module DB.RoomDB {
    export var rooms : {[id : number] : Room} = {};

    export function hasRoom (id : number) {
        return rooms[id] !== undefined;
    }

    export function getRoom (id : number) : Room {
        if (hasRoom(id)) {
            return rooms[id];
        }
        return null;
    }

    export function releaseRoom (id : number) {
        if (hasRoom(id)) {
            delete (this.rooms[id]);
            return true;
        }
        return false;
    }

    export function updateFromObject (obj : Array<Object>, cleanup : boolean) {
        for (var i = 0; i < obj.length; i++) {
            var room = obj[i];
            if (rooms[room['id']] === undefined) {
                rooms[room['id']] = new Room();
            }
            rooms[room['id']].updateFromObject(<Object> room, cleanup);
        }
    }
}