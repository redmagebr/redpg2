class MessageSheetturn extends Message {
    public module : string = "sheettr";
    private playedBefore : boolean = false;

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

    public setSheetId (id : number) {
        this.setSpecial("sheetid", id);
    }

    public getSheetId () : number {
        return this.getSpecial("sheetid", 0);
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

    public onPrint () {
        if (this.playedBefore) {
            return; // don't play yourself twice!
        }

        if (UI.Chat.doAutomation()) {
            var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");
            var effects = memory.getEffectsOn(this.getSheetId());
            if (effects.length > 0) {
                var msg = new ChatSystemMessage(true);
                msg.addText("_CHATCOMBATEFFECTINPROGRESS_");
                msg.addLangVar("a", this.getSheetName());
                var names = [];
                for (var i = 0; i < effects.length; i++) {
                    names.push(effects[i].name);
                }
                msg.addLangVar("b", names.join(", "));
                UI.Chat.printElement(msg.getElement());
            }
        }

        if (Application.isMe(this.getOwnerId()) && UI.Chat.doAutomation()) {
            UI.SoundController.playAlert();
        }

        this.playedBefore = true;
    }
}

MessageFactory.registerMessage(MessageSheetturn, "sheettr", []);