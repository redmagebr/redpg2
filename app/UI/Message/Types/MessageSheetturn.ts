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

        return p;
    }

    public setSheetName (name : string) {
        this.msg = name;
    }

    public getSheetName () :string {
        var old = this.getSpecial("sheetname", null);

        if (old === null) {
            old = this.msg;
        }

        return old;
    }

    public setPlayer (id : number) {
        this.setSpecial("player", id);
    }

    public getPlayer () : number {
        return this.getSpecial('player', 0);
    }
}

MessageFactory.registerMessage(MessageSheetturn, "sheettr", []);