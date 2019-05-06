class MessageQuote extends Message {
    public module : string = "quote";

    public createHTML () : HTMLElement {
        if (this.isIgnored()) return null;
        var lang = this.getSpecial("language", "none");

        var p = document.createElement("p");
        p.classList.add("chatMessageQuoteParagraph");

        let span = document.createElement("span");
        span.appendChild(document.createTextNode('"' + this.getMsg() + '"'));
        span.classList.add("chatRoleplayLang" + lang);
        p.appendChild(span);

        var name = this.getQuoted();

        if (name !== null) {
            var b = document.createElement("b");
            b.classList.add("chatMessageQuoteQuoted");
            b.appendChild(document.createTextNode("- " + name));

            p.appendChild(b);
        }

        var translation = this.getTranslation();
        if (translation !== null) {
            let span = document.createElement("span");
            span.classList.add("chatRoleplayTranslation");

            var b = document.createElement("b");
            b.appendChild(document.createTextNode("_CHATMESSAGEROLEPLAYTRANSLATION_"));
            b.appendChild(document.createTextNode(": "));
            UI.Language.markLanguage(b);
            span.appendChild(b);

            span.appendChild(document.createTextNode(<string> translation));

            p.appendChild(span);
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

    public isIgnored () : boolean {
        if (!Application.Login.isLogged()) return false;
        var ignored = this.getSpecial("ignoreFor", []);
        return ignored.indexOf(Application.Login.getUser().id) !== -1;
    }

    public setLanguage (lang : string) {
        this.setSpecial("language", lang);
    }

    public setTranslation (message : string) {
        this.setSpecial("translation", message);
    }

    public getTranslation () : String {
        return this.getSpecial('translation', null);
    }
}

MessageFactory.registerMessage(MessageQuote, "quote", ["/quote", "/citar", "/citação", "/citaçao", "/citacao"]);