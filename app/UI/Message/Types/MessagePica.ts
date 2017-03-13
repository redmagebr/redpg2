class MessagePica extends Message {
    public module: string = "pica";
    private msgOneArt = "0";
    private msgUpdateArts = "1";
    private msgRequestUpdate = "2";
    private runOnce = false;

    constructor () {
        super();
        this.addUpdatedListener((function () {
            this.considerAddingToArtManager();
        }).bind(this));
    }

    public considerAddingToArtManager () {
        if (this.wasLocalMessage()) {
            return;
        }
        var roomid = this.roomid;
        var url = this.getUrl();
        var userLengths = UI.Pica.ArtManager.getLengthByUser(roomid, url);
        var ownLength = userLengths[Application.getMyId()] != undefined ? userLengths[Application.getMyId()] : 0;
        if (!this.isMine() || this.getSpecificConfirmation(Application.getMyId()) != ownLength) {
            if (this.getMsg() == this.msgOneArt) {
                var art = this.getArt();
                UI.Pica.ArtManager.includeArt(roomid, url, art);

                userLengths = UI.Pica.ArtManager.getLengthByUser(roomid, url);
                var senderLengthLocal = userLengths[this.origin] == undefined ? 0 : userLengths[this.origin];
                var senderLengthExt = this.getSpecificConfirmation(this.origin);
                if (senderLengthLocal != senderLengthExt) {
                    console.log("I don't have all art for " + this.origin);
                    var msg = new MessagePica();
                    msg.addDestination(this.getUser());
                    msg.setUrl(url);
                    msg.setMsg(this.msgRequestUpdate);
                    UI.Chat.sendMessage(msg);
                }
            } else if (this.getMsg() == this.msgUpdateArts) {
                var arts = this.getArts();
                UI.Pica.ArtManager.removeArtFromUser(this.origin, roomid, url);
                UI.Pica.ArtManager.includeManyArts(roomid, url, arts);
            } else if (this.getMsg() == this.msgRequestUpdate) {
                var msg = new MessagePica();
                msg.addDestination(this.getUser());
                msg.setUrl(url);
                msg.setMsg(this.msgRequestUpdate);
                msg.setArts(UI.Pica.ArtManager.getMyArtsAsString(roomid, url));
                UI.Chat.sendMessage(msg);
            }
        }
    }

    public setArt (art : PicaCanvasArt) {
        this.setSpecial("art", art.exportAsObject());
        this.setMsg(this.msgOneArt);
    }

    public setArtString (art : string) {
        this.setSpecial("art", art);
        this.setMsg(this.msgOneArt);
    }

    public getArt () {
        var art = this.getSpecial("art", null);
        try {
            if (art != null) {
                var canvasArt = new PicaCanvasArt();
                canvasArt.importFromString(art);
                canvasArt.setUserId(this.origin);
                return canvasArt;
            }
        } catch (e) {}
        return null;
    }

    public setArts (arts : Array) {
        this.setSpecial("arts", arts);
        this.setMsg(this.msgUpdateArts);
    }

    public getArts () {
        var arts = this.getSpecial("arts", null);
        var instanced = [];
        if (Array.isArray(arts)) {
            for (var i = 0; i < arts.length; i++) {
                try {
                    var art = arts[i];
                    var canvasArt = new PicaCanvasArt();
                    canvasArt.importFromString(art);
                    canvasArt.setUserId(this.origin);
                    instanced.push(canvasArt);
                } catch (e) {};
            }
        }
        return instanced;
    }

    public setUrl (url : string) {
        this.setSpecial("url", url);
    }

    public getUrl () {
        return this.getSpecial("url", "");
    }

    public getSpecificConfirmation (userid : number) {
        var conf = this.getConfirmation();
        if (conf[userid] == undefined) return 0;
        return conf[userid];
    }

    public getConfirmation () {
        return this.getSpecial("check", {});
    }

    public setConfirmation (userList : Object) {
        this.setSpecial("check", userList);
    }

    public getHTML () {
        if (!this.runOnce) {
            this.runOnce = true;
            //this.considerAddingToArtManager();
        }
        return null;
    }
}

MessageFactory.registerMessage(MessagePica, "pica", []);