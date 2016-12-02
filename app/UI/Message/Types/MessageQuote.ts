class MessageQuote extends Message {
    public module : string = "quote";

    public createHTML () : HTMLElement {
        var p = document.createElement("p");
        p.classList.add("chatMessageQuoteParagraph");
        p.appendChild(document.createTextNode('"' + this.getMsg() + '"'));

        var name = this.getQuoted();

        if (name !== null) {
            var b = document.createElement("b");
            b.classList.add("chatMessageQuoteQuoted");
            b.appendChild(document.createTextNode("- " + name));

            p.appendChild(b);
        }

        return p;
    }

    public setQuoted (name : String) {
        this.setSpecial("name", name);
    }

    public getQuoted () {
        return this.getSpecial("name", null);
    }

    public receiveCommand (slashCommand : string , message : string) : boolean {
        var name : string;
        var idx = message.indexOf(",");
        if (idx === -1) {
            name = null;
            message = message.trim();
        } else {
            name = message.substr(0, idx).trim();
            message = message.substr(idx + 1, message.length - (idx + 1)).trim();
        }

        this.setQuoted(name);
        this.setMsg(message);
        return true;
    }
}

MessageFactory.registerMessage(MessageQuote, "quote", ["/quote", "/citar", "/citação", "/citaçao", "/citacao"]);