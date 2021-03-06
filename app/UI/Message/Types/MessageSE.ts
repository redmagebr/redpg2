class MessageSE extends Message {
    public module : string = "seplay";
    private playedBefore : boolean = false;

    public onPrint () {
        if (this.playedBefore) {
            return; // don't play yourself twice!
        }
        if (UI.Chat.doAutomation()) {
            var cfg = Application.Config.getConfig("autoSE").getValue();
            if (cfg === 0) return;
            if (this.getUser().isStoryteller() || cfg === 2) {
                UI.SoundController.playSE(this.getMsg());
                this.playedBefore = true;
            }
        }
    }

    public createHTML () {
        if (Application.Config.getConfig("hideMessages").getValue()) {
            return null;
        }
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDSE_"));

        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        } else {
            p.appendChild(document.createTextNode(". "));
        }

        UI.Language.markLanguage(p);

        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGEPLAYSE_"));
        a.appendChild(document.createTextNode("."));
        a.addEventListener("click", <EventListenerObject> {
            message : this,
            handleEvent : function (e : Event) {
                UI.SoundController.playSE(this.message.getMsg());
            }
        });
        UI.Language.markLanguage(a);

        p.appendChild(a);

        return p;
    }

    public getName () {
        return this.getSpecial("name", null);
    }

    public setName (name : string) {
        this.setSpecial("name", name);
    }
    public static shareLink (name : string, url : string) {
        var msg = new MessageSE();
        msg.findPersona();
        msg.setName(name);
        msg.setMsg(url);
        UI.Chat.sendMessage(msg);
    }
}

MessageFactory.registerMessage(MessageSE, "seplay", ["/se", "/seplay", "/soundeffect", "/sound"]);