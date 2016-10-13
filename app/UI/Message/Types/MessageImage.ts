class MessageImage extends Message {
    public module : string = "image";
    private openedBefore = false;

    private static lastImages = {};
    private static maxHistory = 10;
    private static noAutomation : boolean = false;

    private static addLastImage (msg : MessageImage) {
        if (MessageImage.lastImages[msg.roomid] === undefined) {
            MessageImage.lastImages[msg.roomid] = [msg];
        } else {
            var idx = MessageImage.lastImages[msg.roomid].indexOf(msg);
            if (idx === -1) {
                MessageImage.lastImages[msg.roomid].push(msg);
            } else {
                MessageImage.lastImages[msg.roomid].splice(idx, 1);
                MessageImage.lastImages[msg.roomid].push(msg);
            }
            if (MessageImage.lastImages[msg.roomid].length > MessageImage.maxHistory) {
                MessageImage.lastImages[msg.roomid].splice(0,1);
            }
        }
    }

    public static getLastImages (roomid : number) {
        if (typeof MessageImage.lastImages[roomid] !== "undefined") {
            return <Array<MessageImage>> MessageImage.lastImages[roomid];
        } else {
            return [];
        }
    }

    public static stopAutomation () {
        MessageImage.noAutomation = true;
    }

    public static resumeAutomation () {
        MessageImage.noAutomation = false;
    }


    public onPrint () {
        if (this.openedBefore || MessageImage.noAutomation) return;
        if (UI.Chat.doAutomation()) {
            var cfg = Application.Config.getConfig("autoImage").getValue();
            if (cfg === 0) return;
            if (this.getUser().isStoryteller() || cfg === 2) {
                this.clickLink();
                this.openedBefore = true;
            }
        }
        MessageImage.addLastImage(this);
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

    /**
     * Processes a received SlashCommand from the user.
     * If true is returned, the system will assume that the slashcommand was valid. If false, it'll assume it was invalid.
     * @param slashCommand
     * @param msg
     * @returns {boolean}
     */
    public receiveCommand (slashCommand : string, msg : string) : boolean {
        if (msg === "") {
            return false;
        }
        this.msg = msg;
        return true;
    }
}

MessageFactory.registerMessage(MessageImage, "image", ["/image", "/imagem", "/picture", "/figura", "/pic"]);