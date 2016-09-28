module DB.UserDB {
    var users : {[id : number] : User} = {};

    export function hasUser (id : number) {
        return users[id] !== undefined;
    }

    export function getUser (id : number) : User {
        if (hasUser(id)) {
            return users[id];
        }
        return null;
    }

    export function getAUser (id : number) : User {
        if (hasUser(id)) return users[id];
        return new User();
    }

    export function updateFromObject (obj : Array<Object>) {
        for (var i = 0; i < obj.length; i++) {
            if (users[obj[i]['id']] === undefined) {
                users[obj[i]['id']] = new User();
            }
            users[obj[i]['id']].updateFromObject(obj[i]);
        }
    }
}