class MessageDice extends Message {
    public module : string = "dice";

    constructor () {
        super();

        // Replace incomplete roll with server-provided rolls.
        this.addUpdatedListener(<Listener> {
            handleEvent : function (e : MessageDice) {
                if (e.html !== null) {
                    var newHTML = e.createHTML();
                    if (e.html.parentNode !== null) {
                        e.html.parentNode.replaceChild(newHTML, e.html);
                    }
                    e.html = newHTML;
                }
            }
        })
    }

    public findPersona () {
        var personaName = <string> UI.Chat.PersonaManager.getPersonaName();
        this.setPersona(personaName === null ? "???" : personaName);
    }

    public makeMockUp () {
        var messages : Array<MessageDice> = [this];
        this.addDice(2, 10);
        this.setSpecial("rolls", [5, 5]);
        this.msg = "Example Reason";

        messages.push(new MessageDice());
        messages.push(new MessageDice());
        messages[1].addDice(2, 10);
        messages[1].setSpecial("rolls", [1, 1]);
        messages[2].addDice(2, 10);
        messages[2].setSpecial("rolls", [10, 10]);


        return messages;
    }

    public createHTML () : HTMLElement {
        var p = document.createElement("p");
        p.classList.add("chatMessageDice");

        if (this.getRolls().length === 0 && this.getDice().length !== 0) {
            p.appendChild(document.createTextNode("_CHATDICEROLLEDWAITING_"));
            UI.Language.markLanguage(p);
            return p;
        }

        var b = document.createElement("b");
        b.appendChild(document.createTextNode("* " + this.getSpecial("persona", "????") + " "));

        p.appendChild(b);
        if (this.isWhisper()) {
            if (this.getRolls().length > 0) {
                p.appendChild(document.createTextNode("_CHATDICESECRETROLLED_"));
            } else {
                p.appendChild(document.createTextNode("_CHATDICESECRETSHOWN_"));
            }
        } else {
            if (this.getRolls().length > 0) {
                p.appendChild(document.createTextNode("_CHATDICEROLLED_"));
            } else {
                p.appendChild(document.createTextNode("_CHATDICESHOWN_"));
            }
        }

        p.appendChild(document.createTextNode(" "));

        if (this.getRolls().length > 0) {
            var initialRoll = document.createElement("span");
            initialRoll.classList.add("chatMessageDiceBoxSquare");
            initialRoll.appendChild(document.createTextNode(this.getInitialRoll()));

            p.appendChild(initialRoll);
            p.appendChild(document.createTextNode(" = "));

            var rolls = this.getRolls();
            var faces = this.getDice();
            var allCrits = true;
            var allFailures = true;
            for (var i = 0; i < rolls.length; i++) {
                var span = document.createElement("span");
                span.classList.add("chatMessageDiceBoxRoll");
                if (rolls[i] === faces[i] && faces[i] > 1) {
                    span.classList.add("rainbow");
                    allFailures = false;
                } else if (rolls[i] === 1 && faces[i] > 1) {
                    span.classList.add("shame");
                    allCrits = false;
                } else {
                    allCrits = false;
                    allFailures = false;
                }
                span.appendChild(document.createTextNode(rolls[i].toString()));
                p.appendChild(span);
                if ((i + 1) < rolls.length) {
                    p.appendChild(document.createTextNode(" + "));
                }
            }

            if (allCrits) {
                initialRoll.classList.add("rainbow");
            } else if (allFailures) {
                initialRoll.classList.add("shame");
            }

            if (this.getMod() !== 0) {
                p.appendChild(document.createTextNode(" + "));
                var span = document.createElement("span");
                span.classList.add("chatMessageDiceBoxCircle");
                span.appendChild(document.createTextNode(this.getMod().toString()));
                p.appendChild(span);

                if (allCrits) {
                    span.classList.add("rainbow");
                } else if (allFailures) {
                    span.classList.add("shame");
                }
            }

            p.appendChild(document.createTextNode(" = "));
            var span = document.createElement("span");
            span.classList.add("chatMessageDiceBoxResult");
            span.appendChild(document.createTextNode(this.getResult().toString()));

            if (allCrits) {
                span.classList.add("rainbow");
                p.classList.add("rainbow");
            } else if (allFailures) {
                span.classList.add("shame");
                p.classList.add("shame");
            }

            p.appendChild(span);
        } else {
            var initialRoll = document.createElement("span");
            initialRoll.classList.add("chatMessageDiceBoxCircle");
            initialRoll.appendChild(document.createTextNode(this.getMod().toString()));
            p.appendChild(initialRoll);
        }

        //var msg = this.getInitialRoll() + " = " + this.getRolls().join(" ") + " + " + this.getMod() + " = ";
        //
        //p.appendChild(document.createTextNode(msg));

        if (this.getMsg() !== "") {
            var span = document.createElement("span");
            span.classList.add("chatMessageDiceReason");

            var b = document.createElement("b");
            b.appendChild(document.createTextNode("_CHATMESSAGEDICEREASON_"));
            b.appendChild(document.createTextNode(": "));

            UI.Language.markLanguage(b);

            span.appendChild(b);
            span.appendChild(document.createTextNode(this.getMsg()));
            p.appendChild(span);
        }

        UI.Language.markLanguage(p);
        return p;
    }

    public getInitialRoll () : string {
        var dices = this.getDice();
        var cleanedDices = {};
        var mod = this.getMod();

        for (var i = 0; i < dices.length; i++) {
            if (cleanedDices[dices[i]] === undefined) {
                cleanedDices[dices[i]] = 1;
            } else {
                cleanedDices[dices[i]]++;
            }
        }

        var finalString = [];

        for (var faces in cleanedDices) {
            finalString.push(cleanedDices[faces] + "d" + faces);
        }

        var str = finalString.join(" + ");

        if (mod < 0) {
            str += " - " + (mod * -1);
        } else {
            str += " + " + mod;
        }


        return str;
    }

    public getRolls () : Array<number> {
        return this.getSpecial("rolls", []);
    }

    public getMod () : number {
        return this.getSpecial("mod", 0);
    }

    public setMod (mod : number) {
        this.setSpecial("mod", mod);
    }

    public getDice () : Array<number> {
        return this.getSpecial("dice", []);
    }

    public setDice (dice : Array<number>) {
        this.setSpecial("dice", dice);
    }

    public addMod (mod : number) {
        this.setSpecial("mod", mod);
    }

    public addDice (amount : number, faces : number) {
        if (faces === 0) {
            return; // face = 0 is an invalid roll
        }
        var dices = this.getDice();
        for (var i = 0; i < amount; i++) {
            dices.push(faces);
        }
        this.setDice(dices);
    }

    public getResult () : number {
        var result = 0;
        result += this.getMod();
        result += this.getRolls().reduce(function(previousValue, currentValue) {
            return previousValue + currentValue;
        });
        return result;
    }
}

MessageFactory.registerMessage(MessageDice, "dice", []);