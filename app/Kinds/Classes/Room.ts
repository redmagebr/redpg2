class Room {
    public gameid : number = null;
    public id : number = null;

    public description : string = null;
    public name : string = null;

    public playByPost : boolean = null;
    public privateRoom : boolean = null;

    private users : { [id : number] : User} = {};
    private messages : { [id: number] : Message} = {};

    public getOrderedMessages () : Array<Message> {
        var list = [];
        for (var id in this.messages) {
            list.push(this.messages[id]);
        }
        list.sort(function (a : Message, b : Message) {
            return a.id - b.id;
        });
        return list;
    }

    public getOrderedUsers () : Array<User> {
        var list = [];
        for (var id in this.users) {
            list.push(this.users[id]);
        }
        list.sort(function (a : User, b : User) {
            var na = a.getShortNickname().toLowerCase();
            var nb = b.getShortNickname().toLowerCase();
            if (na < nb) return -1;
            if (nb < na) return 1;
            na = a.getFullNickname().toLowerCase();
            nb = b.getFullNickname().toLowerCase();
            if (na < nb) return -1;
            if (nb < na) return 1;
            return 0;
        });
        return list;
    }

    public getStorytellers () : Array<UserRoomContext> {
        var storytellers = [];
        for (var id in this.users) {
            var rc = this.users[id].getRoomContext(this.id);
            if (rc !== null && rc.isStoryteller()) {
                storytellers.push(rc);
            }
        }
        return storytellers;
    }

    public getMe () : UserRoomContext {
        return this.getUser(Application.getMyId());
    }

    public getUser (id : number) : UserRoomContext {
        if (this.users[id] === undefined) {
            return null;
        }
        return this.users[id].getRoomContext(this.id);
    }

    public getUsersByName (str : string) : Array<UserRoomContext> {
        var list : Array<UserRoomContext> = [];
        str = str.toLowerCase();
        for (var id in this.users) {
            if (this.users[id].getFullNickname().toLowerCase().indexOf(str) !== -1) {
                list.push(this.users[id].getRoomContext(this.id));
            }
        }
        return list;
    }

    public getGame () {
        return DB.GameDB.getGame(this.gameid);
    }

    public updateFromObject (room : Object, cleanup : boolean) {
        for (var id in this) {
            if (room[id] === undefined || id === "users" || id === 'messages') continue;
            this[id] = room[id];
        }

        if (room["cleaner"] !== undefined) {
            this.users[Application.getMyId()] = DB.UserDB.getUser(Application.getMyId());
            var updateObj = {
                roomid : this.id,
                cleaner : room['cleaner'],
                logger : room['logger'],
                storyteller : room['storyteller']
            };

            this.users[Application.getMyId()].updateFromObject(updateObj);
        }

        if (room['users'] !== undefined) {
            var cleanedup : Array<number> = [];
            for (var i = 0; i < room['users'].length; i++) {
                room['users'][i]['roomid'] = this.id;
            }
            DB.UserDB.updateFromObject(room['users']);
            for (var i = 0; i < room['users'].length; i++) {
                this.users[room['users'][i]['id']] = DB.UserDB.getUser(room['users'][i]['id']);
                cleanedup.push(room['users'][i]['id']);
            }
            if (cleanup) {
                for (var id in this.users) {
                    if (cleanedup.indexOf(this.users[id].id) === -1) {
                        this.users[id].releaseGameContext(this.id);
                        delete (this.users[id]);
                    }
                }
            }
        }

        if (room['messages'] !== undefined) {
            var cleanedup : Array<number> = [];
            for (var i = 0; i < room['messages'].length; i++) {
                room['messages'][i]['roomid'] = this.id;
                cleanedup.push(room['messages'][i].id)
            }
            DB.MessageDB.updateFromObject(room['messages']);
            for (var i = 0; i < cleanedup.length; i++) {
                if (this.messages[cleanedup[i]] === undefined) {
                    this.messages[cleanedup[i]] = DB.MessageDB.getMessage(cleanedup[i]);
                }
            }
            if (cleanup) {
                for (id in this.messages) {
                    if (cleanedup.indexOf(this.messages[id].id) === -1) {
                        if (this.messages[id].localid !== null) {
                            DB.MessageDB.releaseLocalMessage(this.messages[id].localid);
                        }
                        DB.MessageDB.releaseMessage(this.messages[id].id);
                    }
                }
            }
        }
    }
}