class MessageSheetturn extends Message {
    public module : string = "sheettr";

    public createHTML () {
        var p = document.createElement("p");
        p.classList.add("chatMessageTurn");

        var a = document.createElement("a");
        a.classList.add("icons-chatMessageTurn");
        a.classList.add("chatMessageTurnIcon");
        p.appendChild(a);

        p.appendChild(document.createTextNode(this.getSheetName() + ":"));

        if (Application.isMe(this.getOwnerId()) && UI.Chat.doAutomation()) {
            UI.SoundController.playAlert();
        }

        return p;
    }

    public setSheetName (name : string) {
        this.msg = name;
    }

    public getSheetName () :string {
        var old = this.getSpecial("sheetname", null);

        if (old === null) {
            return this.msg;
        }

        return old;
    }

    public setOwnerId (id : number) {
        this.setSpecial ("owner", id);
    }

    public getOwnerId () {
        return this.getSpecial("owner", 0);
    }

    public setPlayer (id : number) {
        this.setSpecial("player", id);
    }

    public getPlayer () : number {
        return this.getSpecial('player', 0);
    }
}

MessageFactory.registerMessage(MessageSheetturn, "sheettr", []);