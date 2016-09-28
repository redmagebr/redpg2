class MessageWhisper extends Message {
    public module : string = "whisper";

    constructor () {
        super();

        var list = function (message : MessageWhisper) {
            if (!message.isMine()) {
                UI.Chat.Forms.setLastWhisperFrom(message.getUser());
            }
        };

        this.addUpdatedListener(list);
    }

    public onPrint () {
        if (!this.isMine() && UI.Chat.doAutomation() && !document.hasFocus()) {
            UI.SoundController.playAlert();
        }
    }

    public createHTML () : HTMLElement {
        var p = document.createElement("p");
        p.classList.add("chatWhisper");
        var b = document.createElement("b");
        b.classList.add("chatWhisperLink");
        b.appendChild(document.createTextNode("( "));

        b.addEventListener("click", {
            destination : this.destination,
            msg : this,
            handleEvent : function () {
                if (!this.msg.isMine()) {
                    UI.Chat.Forms.setInput("/whisper " + this.msg.getUser().getUniqueNickname() + ", ");
                } else {
                    var destination = Array.isArray(this.destination) ? this.destination[0] : <number> this.destination;
                    UI.Chat.Forms.setInput("/whisper " + DB.UserDB.getAUser(destination).getRoomContext(UI.Chat.getRoom().id).getUniqueNickname() + ", ");
                }
            }
        });

        if (Application.isMe(this.origin)) {
            b.appendChild(document.createTextNode("_CHATMESSAGEWHISPERTO_"));
            var destination = Array.isArray(this.destination) ? this.destination[0] : <number> this.destination;
            b.appendChild(document.createTextNode(" " + DB.UserDB.getAUser(destination).getFullNickname() + " )"));
        } else {
            b.appendChild(document.createTextNode("_CHATMESSAGEWHISPERFROM_"));
            b.appendChild(document.createTextNode(" " + this.getUser().getUser().getFullNickname() + " )"));
        }
        p.appendChild(b);


        p.appendChild(document.createTextNode(": " + this.getMsg()));

        UI.Language.markLanguage(b);
        return p;
    }

    public receiveCommand (slashCommand : string, msg : string) : boolean {
        var room = UI.Chat.getRoom();
        var index = msg.indexOf(',');
        var target = msg.substr(0,index).trim();
        var message = msg.substr(index + 1).trim();

        var users = room.getUsersByName(target);

        if (users.length === 1) {
            this.setMsg(message);
            this.addDestination(users[0].getUser());
            return true;
        } else {
            return false;
        }
    }

    public getInvalidHTML (slashCommand : string, msg : string) : HTMLElement {
        var room = UI.Chat.getRoom();
        var index = msg.indexOf(',');
        var target = msg.substr(0,index).trim();
        var message = msg.substr(index + 1).trim();

        var users = room.getUsersByName(target);

        var error = new ChatSystemMessage(true);
        if (users.length === 0) {
            error.addText("_CHATWHISPERNOTARGETSFOUND_");
            error.addLangVar("a", target);
        } else {
            var clickF = function () {
                UI.Chat.Forms.setInput("/whisper " + this.target + ", " + this.message);
            };

            error.addText("_CHATMULTIPLETARGETSFOUND_");
            error.addText(": ");
            for (var i = 0; i < users.length; i++) {
                var listener = {
                    target : users[i].getUniqueNickname(),
                    message : message,
                    handleEvent : clickF
                };
                error.addTextLink(users[i].getUniqueNickname(), false, listener);

                if ((i + 1) < users.length) {
                    error.addText(", ");
                } else {
                    error.addText(".");
                }
            }
        }

        return error.getElement();
    }
}

MessageFactory.registerMessage(MessageWhisper, "whisper", ["/whisper", "/whisp", "/private", "/pm", "/privado", "/pessoal", "/w"]);