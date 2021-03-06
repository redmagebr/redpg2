class Game {
    private users : { [id : number] : User} = {};
    private rooms : { [id : number] : Room} = {};
    private sheets : { [id : number] : SheetInstance} = {};
    public description : string = null;
    public name : string = null;
    public id : number = null;
    public freejoin : boolean = false;

    public creatorid : number = null;
    public creatornick : string = null;
    public creatorsufix : string = null;

    public exportAsLog (roomid : number, messages : Array<Message>) {
        var obj = {
            description : this.description,
            name : this.name,
            id : 0,
            freejoin : this.freejoin,
            creatorid : this.creatorid,
            creatornick : this.creatornick,
            creatorsufix : this.creatorsufix
        };

        obj['rooms'] = [DB.RoomDB.getRoom(roomid).exportAsLog(messages)];

        return obj;
    }

    public getId () {
        return this.id;
    }

    public getName () {
        return this.name;
    }

    public getCreatorFullNickname () {
        return this.creatornick + "#" + this.creatorsufix;
    }

    public isMyCreation () : boolean {
        return Application.isMe(<number> this.creatorid);
    }

    public getMe () : UserGameContext {
        return this.getUser(Application.getMyId());
    }

    public getUser (id : number) : UserGameContext {
        if (this.users[id] === undefined) {
            return null;
        }
        return this.users[id].getGameContext(<number> this.id);
    }

    public getRoom (id : number) : Room {
        if (this.rooms[id] === undefined) {
            return null;
        }
        return this.rooms[id];
    }

    public getSheet (id : number) : SheetInstance {
        if (this.sheets[id] === undefined) {
            return null;
        }
        return this.sheets[id];
    }

    public getOrderedRoomList () : Array<Room> {
        var list : Array<Room> = [];
        for (var id in this.rooms) {
            list.push(this.rooms[id]);
        }
        list.sort(function (a : Room, b : Room) {
            var na = a.name.toLowerCase();
            var nb = b.name.toLowerCase();
            if (na < nb) return -1;
            if (nb < na) return 1;
            return 0;
        });
        return list;
    }

    public getOrderedSheetList () : Array<SheetInstance> {
        var list : Array<SheetInstance> = [];
        for (var id in this.sheets) {
            list.push(this.sheets[id]);
        }
        list.sort(function (a : SheetInstance, b : SheetInstance) {
            var fa = a.folder.toLowerCase();
            var fb = b.folder.toLowerCase();
            if (fa < fb) return -1;
            if (fb < fa) return 1;

            var na = a.getName().toLowerCase();
            var nb = b.getName().toLowerCase();
            if (na < nb) return -1;
            if (nb < na) return 1;
            return 0;
        });
        return list;
    }

    public exportAsObject () {
        //public description : string = null;
        //public name : string = null;
        //public id : number = null;
        //public freejoin : boolean = null;
        var obj = {
            desc : this.description,
            name : this.name,
            freejoin : this.freejoin
        };
        if (this.id !== null) {
            obj['id'] = this.id;
        }
        return obj;
    }

    public updateFromObject (game : Object, cleanup : boolean) {
        for (var id in this) {
            if (game[<any>id] === undefined || id === "users" || id === "rooms" || id === "sheets") continue;
            this[<any>id] = game[<any>id];
        }


        if (game['users'] !== undefined) {
            var cleanedup : Array<number> = [];
            for (var i = game['users'].length - 1; i >= 0; i--) {
                game['users'][i]['gameid'] = this.id;
            }
            DB.UserDB.updateFromObject(game['users']);
            for (var i = 0; i < game['users'].length; i++) {
                this.users[game['users'][i]['id']] = DB.UserDB.getUser(game['users'][i]['id']);
                cleanedup.push(game['users'][i]['id']);
            }
            if (cleanup) {
                for (let id in this.users) {
                    if (cleanedup.indexOf(this.users[id].id) === -1) {
                        this.users[id].releaseGameContext(<number> this.id);
                        delete (this.users[id]);
                    }
                }
            }
        }

        // This game has the permissions for ME
        if (game["createRoom"] !== undefined) {
            this.users[Application.getMyId()] = DB.UserDB.getUser(Application.getMyId());
            var updateObj = {
                gameid : this.id,
                createRoom : game["createRoom"],
                createSheet : game["createSheet"],
                deleteSheet : game["deleteSheet"],
                editSheet : game["editSheet"],
                invite : game["invite"],
                promote : game["promote"],
                viewSheet : game["viewSheet"]
            };

            this.users[Application.getMyId()].updateFromObject(updateObj);
        }

        if (game['rooms'] !== undefined) {
            var cleanedup : Array<number> = [];
            for (var i = 0; i < game['rooms'].length; i++) {
                game['rooms'][i]['gameid'] = this.id;
            }
            DB.RoomDB.updateFromObject(game['rooms'], false);
            for (var i = 0; i < game['rooms'].length; i++) {
                this.rooms[game['rooms'][i]['id']] = DB.RoomDB.getRoom(game['rooms'][i]['id']);
                cleanedup.push((game['rooms'][i]['id']));
            }
            if (cleanup) {
                for (let id in this.rooms) {
                    if (cleanedup.indexOf(this.rooms[id].id) === -1) {
                        DB.RoomDB.releaseRoom(this.rooms[id].id);
                        delete (this.rooms[id]);
                    }
                }
            }
        }

        if (game['sheets'] !== undefined) {
            var cleanedup:Array<number> = [];
            for (var i = game['sheets'].length - 1; i >= 0; --i) {
                game['sheets'][i]['gameid'] = this.id;
                if (game['sheets'][i]['styleName'] !== undefined && game['sheets'][i]['styleName'].indexOf("RedPG1") !== -1) {
                    game['sheets'].splice(i, 1);
                }
            }
            DB.SheetDB.updateFromObject(game['sheets']);
            for (var i = game['sheets'].length - 1; i >= 0; --i) {
                this.sheets[game['sheets'][i]['id']] = DB.SheetDB.getSheet(game['sheets'][i]['id']);
                cleanedup.push(game['sheets'][i]['id']);
            }
            if (cleanup) {
                for (let id in this.sheets) {
                    if (cleanedup.indexOf(this.sheets[id].id) === -1) {
                        DB.SheetDB.releaseSheet(this.sheets[id].id);
                        delete (this.sheets[id]);
                    }
                }
            }
        }
    }
}