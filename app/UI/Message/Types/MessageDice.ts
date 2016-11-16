class MessageDice extends Message {
    public module : string = "dice";
    private diceHQTime : number = 30000;

    private initiativeClicker : HTMLElement = null;
    private customClicker : HTMLElement = null;

    constructor () {
        super();

        this.setDice([]);

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
        var div = document.createElement("div");
        div.classList.add("chatMessageDice");

        var p = document.createElement("p");
        div.appendChild(p);

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
                //p.classList.add("rainbow");
            } else if (allFailures) {
                span.classList.add("shame");
                p.classList.add("shame");
            }

            p.appendChild(span);

            if (UI.Chat.doAutomation()) {
                if (Application.Config.getConfig("hqRainbow").getValue() !== 0) {
                    var rainbows = p.getElementsByClassName("rainbow");
                    for (var i = 0; i < rainbows.length; i++) {
                        rainbows[i].classList.add("hq");
                    }

                    if (Application.Config.getConfig("hqRainbow").getValue() === 1) {
                        var f = (function () {
                            for (var i = 0; i < this.length; i++) {
                                this[i].classList.remove("hq");
                            }
                        }).bind(rainbows);

                        setTimeout(f, this.diceHQTime);
                    }
                }
            }
        } else {
            var initialRoll = document.createElement("span");
            initialRoll.classList.add("chatMessageDiceBoxCircle");
            initialRoll.appendChild(document.createTextNode(this.getMod().toString()));
            p.appendChild(initialRoll);
        }

        //var msg = this.getInitialRoll() + " = " + this.getRolls().join(" ") + " + " + this.getMod() + " = ";
        //
        //p.appendChild(document.createTextNode(msg));

        if (this.getIsInitiative() && (Server.Chat.getRoom() !== null && Server.Chat.getRoom().getMe().isStoryteller()) && UI.Chat.doAutomation()) {
            if (Application.isMe(this.origin) || Application.Config.getConfig("chatAutoRolls").getValue() === 1) {
                this.applyInitiative();
            } else {
                var clickInitiative = (function () {
                    this.applyInitiative();
                }).bind(this);

                this.initiativeClicker = ChatSystemMessage.createTextLink("_CHATMESSAGEDICEAPPLYINITIATIVE_", true, clickInitiative);
            }
        }

        if (this.getMsg() !== "" || (this.initiativeClicker !== null && UI.Chat.doAutomation())) {
            var span = document.createElement("span");
            span.classList.add("chatMessageDiceReason");

            var b = document.createElement("b");
            b.appendChild(document.createTextNode("_CHATMESSAGEDICEREASON_"));
            b.appendChild(document.createTextNode(": "));
            UI.Language.markLanguage(b);
            span.appendChild(b);

            span.appendChild(document.createTextNode(this.getMsg()));

            if (this.initiativeClicker !== null && UI.Chat.doAutomation()) {
                if (this.getMsg() !== "") {
                    span.appendChild(document.createTextNode(" "));
                }
                span.appendChild(this.initiativeClicker);
            }

            p.appendChild(span);
        }

        UI.Language.markLanguage(p);

        if (this.hasCustomAutomation()) {
            var f = (function (e) {
                e.preventDefault();
                this.doCustom();
            }).bind(this);

            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATMESSAGEDICECUSTOMWARNING_");
            msg.addText(" ");
            msg.addLangVar("a", this.getSheetName());
            msg.addTextLink("_CHATMESSAGEDICECUSTOMGO_", true, f);
            this.customClicker = msg.getElement();

            div.appendChild(this.customClicker);
        }
        return div;
    }

    public doCustom () {
        var style = DB.StyleDB.getStyle(this.getCustomAutomationStyle());
        var sheet = DB.SheetDB.getSheet(this.getSheetId());

        if (style === null || !style.isLoaded()) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATMESSAGEDICECUSTOMSTYLENOTLOADED_");
            UI.Chat.printElement(msg.getElement());
            return;
        }

        if (sheet === null || !sheet.loaded) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATMESSAGEDICECUSTOMSHEETNOTLOADED_");
            UI.Chat.printElement(msg.getElement());
            return;
        }

        var sheetStyle = StyleFactory.getSheetStyle(style, false);

        if (!sheetStyle.doDiceCustom(this)) {
            return;
        }

        if (this.customClicker !== null && this.customClicker.parentElement !== null) {
            this.customClicker.parentElement.removeChild(this.customClicker);
            this.customClicker = null;
        }
    }

    public hasCustomAutomation () {
        return this.getSheetId() !== null && this.getSheetName() !== null && this.getCustomAutomation() !== null && this.getCustomAutomationStyle() !== null;
    }

    public setSheetName (name : string) {
        this.setSpecial("sheetName", name);
    }

    public getSheetName () {
        return this.getSpecial("sheetName", null);
    }

    public setCustomAutomationStyle (id : number) {
        this.setSpecial("customStyle", id);
    }

    public getCustomAutomationStyle () {
        return this.getSpecial("customStyle", null);
    }

    public setCustomAutomation (obj : any) {
        this.setSpecial("custom", obj);
    }

    public getCustomAutomation () {
        return this.getSpecial("custom", null);
    }

    public applyInitiative () {
        if (this.initiativeClicker !== null && this.initiativeClicker.parentElement !== null) {
            this.initiativeClicker.parentElement.removeChild(this.initiativeClicker);
            this.initiativeClicker = null;
        }
        var total = this.getResult();
        var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");

        memory.applyInitiative(this.getSheetId(), total);
    }

    public setSheetId (id : number) {
        this.setSpecial("sheetid", id);
    }

    public getSheetId () {
        return this.getSpecial("sheetid", null);
    }

    public setAsInitiative () {
        this.setSpecial("initiative", true);
    }

    public getIsInitiative () : boolean {
        return this.getSpecial("initiative", false) && this.getSheetId() !== null;
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
        if (faces === 0 || amount === 0) {
            return; // face = 0 is an invalid roll, as is amount = 0
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