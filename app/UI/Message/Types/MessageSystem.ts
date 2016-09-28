class MessageSystem extends Message {
    public module : string = "system";

    public createHTML () {
        var p = document.createElement("p");
        p.classList.add("chatMessageSystem");

        var b = document.createElement("b");
        b.appendChild(document.createTextNode("_CHATMESSAGEANNOUNCEMENT_"));
        UI.Language.markLanguage(b);
        p.appendChild(b);

        p.appendChild(document.createTextNode(": " + this.getMsg()));

        return p;
    }
}

MessageFactory.registerMessage(MessageSystem, "system", []);