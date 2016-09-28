class MessageAction extends Message {
    public module : string = "action";

    public findPersona () {
        var personaName = <string> UI.Chat.PersonaManager.getPersonaName();
        this.setPersona(personaName === null ? "???" : personaName);
    }

    public createHTML () : HTMLElement {
        var p = document.createElement("p");
        p.classList.add("chatAction");
        var b = document.createElement("b");
        b.appendChild(document.createTextNode("* " + this.getSpecial("persona", "???") + " "));
        p.appendChild(b);
        p.appendChild(document.createTextNode(this.msg));
        return p;
    }
}

MessageFactory.registerMessage(MessageAction, "action", ["/act", "/me", "/eu", "/açao", "/ação", "/agir"]);