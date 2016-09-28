class MessageOff extends Message {
    public module : string = "offgame";

    public createHTML () : HTMLElement {
        var p = document.createElement("p");
        p.classList.add("chatOff");
        var b = document.createElement("b");
        b.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + ": "));
        p.appendChild(b);
        p.appendChild(document.createTextNode(this.msg));
        return p;
    }
}

MessageFactory.registerMessage(MessageOff, "offgame", ["/off", "/ooc"]);