class MessageVideo extends Message {
    public module : string = "youtube";

    public createHTML () {
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDVIDEO_"));

        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        } else {
            p.appendChild(document.createTextNode(". "));
        }

        UI.Language.markLanguage(p);

        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGEPLAYVIDEO_"));
        a.appendChild(document.createTextNode("."));
        UI.Language.markLanguage(a);

        a.addEventListener("click", () => {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = this.getMsg().trim().match(regExp);
            if (match && match[2].length === 11) {
                UI.IFrame.openRightFrame("https://www.youtube.com/embed/" + match[2]);
            } else {
                var msg = new ChatSystemMessage(true);
                msg.addText("_CHATYOUTUBEINVALID_");
            }
        });

        p.appendChild(a);

        return p;
    }

    public getName () {
        return this.getSpecial("name", null);
    }

    public setName (name : string) {
        this.setSpecial("name", name);
    }
}

MessageFactory.registerMessage(MessageVideo, "youtube", ["/video", "/youtube"]);