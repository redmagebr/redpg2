class MessageSheetcommand extends Message {
    public module : string = "sheetcmd";

    private playedBefore : boolean = false;

    public onPrint () {
        if (this.playedBefore) {
            return; // don't play yourself twice!
        }
        if (this.customAutomationPossible())  {
            if (Application.Config.getConfig('chatAutoRolls').getValue() === 1 || (Application.isMe(this.getUser().getUser().id) && this.wasLocalMessage())) {
                this.applyCommand();
                this.playedBefore = true;
            }
        }
    }

    public customAutomationPossible () {
        if (Server.Chat.getRoom() === null || !Server.Chat.getRoom().getMe().isStoryteller() || !UI.Chat.doAutomation()) {
            return false;
        }

        return true;
    }

    public createHTML () {
        var msg = new ChatSystemMessage(true);

        if (Application.isMe(this.origin) && (Server.Chat.getRoom() === null || !Server.Chat.getRoom().getMe().isStoryteller())) {
            msg.addText("_CHATCOMMANDREQUESTED_");
        } else {
            var auto = Application.Config.getConfig("chatAutoRolls").getValue() === 1 || (Application.isMe(this.origin) && this.wasLocalMessage());
            if (auto) {
                msg.addText("_CHATCOMMANDAUTODID_");
            } else {
                msg.addText("_CHATCOMMANDREQUEST_");
            }

            msg.addLangVar("a", this.getUser().getUniqueNickname());
            msg.addLangVar("b", this.getSheetName());
            if (!auto) {
                msg.addText(" ");
                msg.addTextLink("_CHATCOMMANDCLICK_", true, <Listener> {
                    buff: this,
                    handleEvent: function () {
                        this.buff.applyCommand();
                    }
                });
            }
        }

        return msg.getElement();
    }

    public applyCommand () {
        var sheet = DB.SheetDB.getSheet(this.getSheetId());

        if (sheet === null || !sheet.loaded) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATCOMMANDNOTLOADED_")
            return;
        }

        var style = sheet.getStyle();

        if (style === null || !style.isLoaded()) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATCOMMANDNOTLOADED_")
            return;
        }

        var sheetstyle = StyleFactory.getSheetStyle(style);

        if (sheetstyle === null) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATCOMMANDNOTLOADED_")
            return;
        }

        if (!sheetstyle.processCommand(this)) {
            return;
        }

        var auto = Application.Config.getConfig("chatAutoRolls").getValue() === 1 || (Application.isMe(this.origin) && this.wasLocalMessage());

        if (!auto) {
            if (this.html !== null && this.html.parentElement !== null) {
                this.html.parentElement.removeChild(this.html);
            }

            this.html = null;
        }
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
        return this.msg;
    }

    public setCustomString (customString : string) {
        this.setSpecial("effectCustomString", customString);
    }

    public getCustomString () {
        return this.getSpecial("effectCustomString", null);
    }
}

MessageFactory.registerMessage(MessageSheetcommand, "sheetcmd", []);