/**
 * Created by Reddo on 14/09/2015.
 */
class User {
    public nickname : string = "Undefined";
    public nicknamesufix : string = "????";
    public id : number = null;
    public level : number = null;
    public gameContexts : {[id : number] : UserGameContext} = {};
    public roomContexts : {[id : number] : UserRoomContext} = {};

    private changedTrigger = new Trigger();

    public isMe() {
        return this.id === Application.getMyId();
    }

    public getGameContext (id : number) : UserGameContext {
        if (this.gameContexts[id] === undefined) {
            return null;
        }
        return this.gameContexts[id];
    }

    public releaseGameContext (id : number) {
        delete (this.gameContexts[id]);
    }

    public getRoomContext (id : number) : UserRoomContext {
        if (this.roomContexts[id] === undefined) {
            return null;
        }
        return this.roomContexts[id];
    }

    public releaseRoomContext (id : number) {
        delete (this.roomContexts[id]);
    }

    public getFullNickname():string {
        return this.nickname + "#" + this.nicknamesufix;
    }

    public getShortNickname():string {
        return this.nickname;
    }

    public updateFromObject (user : Object) {
        if (typeof user['id'] === "string") {
            user['id'] = parseInt(user['id']);
        }
        for (var key in this) {
            if (user[key] === undefined) continue;
            this[key] = user[key];
        }

        var context;

        if (user['roomid'] !== undefined) {
            context = this.getRoomContext(user['roomid']);
            if (context === null) {
                context = new UserRoomContext(this);
                this.roomContexts[user['roomid']] = context;
            }

            context.updateFromObject(user);
        }

        if (user['gameid'] !== undefined) {
            context = this.getGameContext(user['roomid']);
            if (context === null) {
                context = new UserGameContext(this);
                this.gameContexts[user['gameid']] = context;
            }

            context.updateFromObject(user);
        }

        this.changedTrigger.trigger(this);
    }
}