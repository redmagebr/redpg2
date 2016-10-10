class MessageImage extends Message {
    public module : string = "image";
    private openedBefore = false;

    public onPrint () {
        if (this.openedBefore) return;
        if (UI.Chat.doAutomation()) {
            var cfg = Application.Config.getConfig("autoImage").getValue();
            if (cfg === 0) return;
            if (this.getUser().isStoryteller() || cfg === 2) {
                this.clickLink();
                this.openedBefore = true;
            }
        }
    }

    public createHTML () {
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDIMAGE_"));

        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        } else {
            p.appendChild(document.createTextNode(". "));
        }

        UI.Language.markLanguage(p);

        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGESEEIMAGE_"));
        a.appendChild(document.createTextNode("."));

        a.href = this.getMsg();

        a.addEventListener("click", <EventListenerObject> {
            msg : this,
            handleEvent : function (e : Event) {
                e.preventDefault();
                this.msg.clickLink();
            }
        });

        UI.Language.markLanguage(a);

        p.appendChild(a);

        return p;
    }

    public clickLink () {
        UI.Pica.loadImage(this.getMsg());
    }

    public getName () {
        return this.getSpecial("name", null);
    }

    public setName (name : string) {
        this.setSpecial("name", name);
    }

    public static shareLink (name : string, url : string) {
        var newImage = new MessageImage();
        newImage.findPersona();
        newImage.setName(name);
        newImage.setMsg(url);
        UI.Chat.sendMessage(newImage);
    }
}

MessageFactory.registerMessage(MessageImage, "image", ["/image", "/imagem", "/picture", "/figura", "/pic"]);