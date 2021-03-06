class MessageBuff extends Message {
    public module: string = "buff";
    private playedBefore : boolean = false;

    public onPrint () {
        if (this.playedBefore) {
            return; // don't play yourself twice!
        }
        if (this.customAutomationPossible())  {
            if (Application.Config.getConfig('chatAutoRolls').getValue() === 1 || (Application.isMe(this.getUser().getUser().id) && this.wasLocalMessage())) {
                this.applyBuff();
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
            msg.addText("_CHATCOMBATBUFFREQUESTED_");
        } else {
            var auto = Application.Config.getConfig("chatAutoRolls").getValue() === 1 || (Application.isMe(this.origin) && this.wasLocalMessage());
            if (auto) {
                msg.addText("_CONFIGAUTOROLLAPPLYEFFECT_");
            } else {
                msg.addText("_CHATCOMBATBUFFREQUEST_");
            }

            msg.addLangVar("a", this.getUser().getUniqueNickname());
            msg.addLangVar("b", this.getEffectName());
            msg.addLangVar("c", this.getSheetName());
            msg.addText(" ");
            if (!auto) {
                msg.addTextLink("_CHATCOMBATBUFFREQUESTCLICK_", true, <Listener> {
                    buff: this,
                    handleEvent: function () {
                        this.buff.applyBuff();
                    }
                });
            }
        }

        return msg.getElement();
    }

    public applyBuff () {
        var ce = <CombatEffectInfo> {
            name : this.getEffectName(),
            target : this.getSheetId(),
            roundEnd : this.getEffectRoundEnd(),
            turnEnd : this.getEffectTurnEnd(),
            endOnStart : this.getEffectEndOnStart(),
            customString : this.getEffectCustomString()
        };

        var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");
        memory.addEffect(ce);

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

    public setEffectName (name : string) {
        this.setSpecial("effectName", name);
    }

    public getEffectName () {
        return this.getSpecial("effectName", "Unknown");
    }

    public setEffectRoundEnd (round : number) {
        this.setSpecial("effectRoundEnd", round);
    }

    public getEffectRoundEnd () {
        return this.getSpecial("effectRoundEnd", 0);
    }

    public setEffectTurnEnd (turn : number) {
        this.setSpecial("effectTurnEnd", 0);
    }

    public getEffectTurnEnd () {
        return this.getSpecial("effectTurnEnd", 0);
    }

    public setEffectEndOnStart (endonstart : boolean) {
        this.setSpecial("effectEndOnStart", endonstart);
    }

    public getEffectEndOnStart () {
        return this.getSpecial("effectEndOnStart", false);
    }

    public setEffectCustomString (customString : string) {
        this.setSpecial("effectCustomString", customString);
    }

    public getEffectCustomString () {
        return this.getSpecial("effectCustomString", null);
    }
}

MessageFactory.registerMessage(MessageBuff, "buff", []);