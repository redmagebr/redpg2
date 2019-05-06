class MessageStory extends Message {
    public module : string = "story";

    public makeMockUp () : Array<Message> {
        var list : Array<Message> = [];
        list.push(this);
        this.msg = "Lorem [ipsum] dolor {sit amet}, *consectetur adipiscing elit*. (Maecenas pellentesque) lectus neque, ac suscipit metus facilisis vitae. Sed ut nisi non massa sagittis molestie non sed libero.";
        this.setSpecial("persona", "Undefined");

        var newMsg;

        var languages = ['Elvish', 'Binary', 'Magraki', 'Abyssal', 'Draconic', 'Aquon', 'Celestan', 'Technum', 'Arcana', 'Ancient', 'Natrum', 'Ellum', 'Animal', 'Auran', 'Davek', 'Arkadium'].sort();

        for (var i = 0; i < languages.length; i++) {
            newMsg = new MessageStory();
            newMsg.msg = "[" + languages[i] + "]: Nulla luctus quam sit [amet] ullamcorper {luctus}. *Integer* a nulla vitae (blandit tincidunt).";
            newMsg.setSpecial("language", languages[i]);
            list.push(newMsg);
        }

        return list;
    }

    public isIgnored () : boolean {
        if (!Application.Login.isLogged()) return false;
        var ignored = this.getSpecial("ignoreFor", []);
        return ignored.indexOf(Application.Login.getUser().id) !== -1;
    }

    public createHTML () : HTMLElement {
        if (this.isIgnored()) return null;
        var p = document.createElement("p");
        p.classList.add("chatMessageStory");

        var container : HTMLElement = p;

        //var b = document.createElement("b");
        //b.appendChild(document.createTextNode("- "));
        //p.appendChild(b);

        var lang = this.getSpecial("language", "none");

        var thisMsg = "";
        var messageNodes : Array<Node> = [];
        messageNodes.push(document.createTextNode("- "));

        var currentSpecial : Number = null;
        var specialStarters = ["[", "{", "(", "*"];
        var specialEnders = ["]", "}", ")", "*"];
        var specialClasses = ["chatRoleplayImportant", "chatRoleplayItalic", "chatRoleplayThought", "chatRoleplayAction"];
        var specialInclusive = [true, false, true, true];
        var special : number;

        for (var i = 0; i < this.msg.length; i++) {
            special = -1;
            if (currentSpecial === null) special = specialStarters.indexOf(this.msg.charAt(i));
            else if (specialEnders.indexOf(this.msg.charAt(i)) === currentSpecial) {
                if (specialInclusive[<number> currentSpecial]) {
                    thisMsg += this.msg.charAt(i);
                }
                var span = document.createElement("span");
                span.classList.add(specialClasses[<number> currentSpecial]);
                span.appendChild(document.createTextNode(thisMsg));
                messageNodes.push(span);
                thisMsg = "";
                currentSpecial = null;
                continue;
            }
            if (special !== -1) {
                currentSpecial = special;
                var ele = document.createElement("span");
                ele.classList.add("chatRoleplayLang" + lang);
                ele.appendChild(document.createTextNode(thisMsg));
                messageNodes.push(ele);

                thisMsg = "";
                if (specialInclusive[special]) thisMsg += this.msg.charAt(i);
                continue;
            }
            thisMsg += this.msg.charAt(i);
        }

        if (thisMsg !== "") {
            var ele = document.createElement("span");
            ele.classList.add("chatRoleplayLang" + lang);
            ele.appendChild(document.createTextNode(thisMsg));
            messageNodes.push(ele);
        }

        for (var i = 0; i < messageNodes.length; i++) {
            container.appendChild(messageNodes[i]);
        }


        var translation = this.getTranslation();
        if (translation !== null) {
            var span = document.createElement("span");
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

MessageFactory.registerMessage(MessageStory, "story", ["/story", "/history", "/historia", "/história", "/histo", "/sto"]);