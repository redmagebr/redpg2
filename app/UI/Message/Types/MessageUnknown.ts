class MessageUnknown extends Message {
    public module : string = "unkn";

    public createHTML () : HTMLElement {
        var p = document.createElement("p");
        p.classList.add("chatMessageNotification");
        p.appendChild(document.createTextNode("_CHATMESSAGEUNKNOWNTYPE_"));
        UI.Language.addLanguageVariable(p, "a", this.module);
        UI.Language.addLanguageVariable(p, "b", this.getUser().getUser().getFullNickname());
        UI.Language.markLanguage(p);

        return p;
    }
}

MessageFactory.registerMessage(MessageUnknown, "unkn", []);