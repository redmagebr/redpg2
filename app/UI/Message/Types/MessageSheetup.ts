class MessageSheetup extends Message {
    public module : string = "sheetup";
    private playedBefore : boolean = false;
    private clicker : HTMLElement = null;

    public onPrint () {
        if (this.playedBefore) {
            return; // don't play yourself twice!
        }
        if (UI.Chat.doAutomation() && UI.Sheets.SheetManager.isAutoUpdate() && !this.wasLocalMessage()) {
            this.playedBefore = true;
            this.updateSheet();
        } else if (UI.Chat.doAutomation()) {
            if (!UI.Chat.doAutomation() || UI.Sheets.SheetManager.isAutoUpdate() || this.wasLocalMessage()) {
                return;
            }

            var sheet = DB.SheetDB.getSheet(this.getSheetId());
            if (sheet === null || !sheet.loaded) {
                return null;
            }

            this.playedBefore = true;

            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATMESSAGESHEETUPDATED_");
            msg.addLangVar("a", sheet.getName());
            msg.addText(" ");

            msg.addTextLink("_CHATMESSAGESHEETUPDATEDCLICKER_", true, (function () {
                this.updateSheet();
            }).bind(this));

            this.clicker = msg.getElement();

            UI.Chat.printElement(this.clicker);
        }
    }

    public setSheetId (id : number) {
        this.setSpecial("sheetid", id);
    }

    public getSheetId () {
        return this.getSpecial("sheetid", 0);
    }

    public updateSheet () {
        var sheet = DB.SheetDB.getSheet(this.getSheetId());

        if (sheet === null || !sheet.loaded) {
            return;
        }

        Server.Sheets.loadSheet(sheet.id);

        if (this.clicker !== null) {
            if (this.clicker.parentElement !== null) {
                this.clicker.parentElement.removeChild(this.clicker);
            }
            this.clicker = null;
        }
    }

    public createHTML () : HTMLElement {
        if (!UI.Chat.doAutomation() || UI.Sheets.SheetManager.isAutoUpdate() || this.wasLocalMessage()) {
            return null;
        }

        return null;
    }
}

MessageFactory.registerMessage(MessageSheetup, "sheetup", []);