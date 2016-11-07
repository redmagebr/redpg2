class MemoryLingo extends TrackerMemory {
    private userLingos : { [id : number] : Array<string>} = {};
    private busy = false;

    public getUser (id : number) {
        if (this.userLingos[id] !== undefined) {
            return this.userLingos[id];
        }
        return [];
    }

    public clean () {
        for (var id in this.userLingos) {
            var user = Server.Chat.getRoom().getUser(parseInt(id));
            if (user === null || user.isStoryteller() || this.userLingos[id].length < 1) {
                delete (this.userLingos[id]);
            }
        }
    }

    public getUsers () {
        return this.userLingos;
    }

    public reset () {
        this.userLingos = {};
    }

    public getValue () {
        return this;
    }

    public addUserLingo (id : number, lingo : string) {
        if (this.userLingos[id] === undefined) {
            this.userLingos[id] = [lingo];
            if (!this.busy) {
                this.triggerChange();
            }
        } else {
            if (this.userLingos[id].indexOf(lingo) === -1) {
                this.userLingos[id].push(lingo);
                this.userLingos[id].sort();
                if (!this.busy) {
                    this.triggerChange();
                }
            }
        }
    }

    public removeUserLingo (id : number, lingo : string) {
        if (this.userLingos[id] !== undefined) {
            var idx = this.userLingos[id].indexOf(lingo);
            if (idx !== -1) {
                this.userLingos[id].splice(idx, 1);
                this.clean();
                if (!this.busy) {
                    this.triggerChange();
                }
            }
        }
    }

    public isSpeaker (id : number, lingo : string) {
        var user = this.getUser(id);
        if (user === null) {
            return false;
        }
        return user.indexOf(lingo) !== -1;
    }

    public getSpeakers (lingo : string) : Array<UserRoomContext> {
        var speakers = [];
        if (Server.Chat.getRoom() === null) {
            return speakers;
        }
        for (var id in this.userLingos) {
            if (this.userLingos[id].indexOf(lingo) !== -1) {
                speakers.push(Server.Chat.getRoom().getUser(parseInt(id)));
            }
        }
        return speakers;
    }

    public getSpeakerArray (lingo : string) : Array<number> {
        var speakers = [];
        if (Server.Chat.getRoom() === null) {
            return speakers;
        }
        for (var id in this.userLingos) {
            if (this.userLingos[id].indexOf(lingo) !== -1) {
                speakers.push(parseInt(id));
            }
        }
        return speakers;
    }

    public storeValue (values : Array<any>) {
        if (!Array.isArray(values)) {
            console.warn ("[ROOMMEMMORY] [MemoryLingo] Invalid store operation requested. Ignoring.");
            return;
        }

        var oldJson = JSON.stringify(this.userLingos);

        this.busy = true;
        this.userLingos = {};

        for (var i = 0; i < values.length - 1; i += 2) {
            var userid = values[i];
            var userlingos = values[i + 1].split(";");
            for (var k = 0; k < userlingos.length; k++) {
                this.addUserLingo(userid, userlingos[k]);
            }
            this.userLingos[values[i]] = values[i + 1].split(";");
        }

        this.clean();

        this.busy = false;

        var newJson = JSON.stringify(this.userLingos);

        if (oldJson !== newJson) {
            this.triggerChange();
        }
    }

    public exportAsObject () : Array<any> {
        var values = [];

        for (var id in this.userLingos) {
            values.push(parseInt(id));
            values.push(this.userLingos[id].join(";"));
        }

        return values;
    }
}