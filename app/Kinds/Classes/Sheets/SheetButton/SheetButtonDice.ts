class SheetButtondice extends SheetButton {
    protected parsed;
    protected compiled;

    protected symbols : Array<string>;
    protected scope : { [id : string] : number};

    protected diceAmount : number;
    protected diceFaces : number;
    protected modifier : string;

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        super(parent, style, element);

        this.diceAmount = this.visible.dataset['dices'] === undefined ? 0 : parseInt(this.visible.dataset['dices']);
        this.diceFaces = this.visible.dataset['faces'] === undefined ? 0 : parseInt(this.visible.dataset['faces']);
        this.modifier = this.visible.dataset['modifier'] === undefined ? "0" : this.visible.dataset['modifier'];

        this.parse();
    }

    public click (e : Event) {
        e.preventDefault();

        if (UI.Chat.getRoom() !== null) {
            var dice = new MessageDice();
            dice.setPersona(this.style.getSheetInstance().getName());

            var reason = this.diceAmount !== 0 && this.diceFaces !== 0 ? this.diceAmount.toString() + "d" + this.diceFaces.toString() : "";

            var value = this.getValue();
            if (value.toString() === this.modifier) {
                if (value === 0 && reason === "") {
                    reason = value.toString();
                } else if (value !== 0) {
                    if (value < 0) {
                        reason += " - " + Math.abs(value).toString();
                    } else {
                        reason += " + " + value;
                    }
                }
            } else {
                if (reason === "") {
                    reason = this.modifier + " = " + value;
                } else {
                    reason += " + " + this.modifier + " = " + reason + " + " + value;
                }
            }

            dice.setMsg(reason);
            dice.setMod(value);
            dice.addDice(this.diceAmount, this.diceFaces);
            if (UI.Chat.Forms.isDiceTower()) {
                dice.addDestinationStorytellers(UI.Chat.getRoom());
            }

            UI.Chat.sendMessage(dice);
        }
    }

    protected parse () {
        var expr = this.modifier;

        expr = Sheet.simplifyString(expr);

        try {
            this.parsed = math.parse(expr);
            this.compiled = math.compile(expr);
        } catch (e) {
            console.warn("[SheetButtonDice] Invalid Math expression. Error:", e);
            this.parsed = math.parse("0");
            this.compiled = math.compile("0");
        }

        this.symbols = this.getSymbols();
        this.scope = this.getScope(this.symbols);
    }

    public getSymbols () : Array<string> {
        var symbols = [];

        var nodes = this.parsed.filter(function (node) {
            return node.type == 'SymbolNode';
        });

        for (var i = 0; i < nodes.length; i++) {
            symbols.push(nodes[i].name);
        }

        return symbols;
    }

    public getScope (symbols : Array<string>) : { [id : string] : number} {
        var scope = {};

        for (var i = 0; i < symbols.length; i++) {
            scope[symbols[i]] = 0;
        }

        return scope;
    }

    public getValue () : number {
        for (var i = 0; i < this.symbols.length; i++) {
            this.scope[this.symbols[i]] = this.style.getSheet().getValueFor(this.symbols[i]);
        }
        try {
            var result = this.compiled.eval(this.scope);
            return result;
        } catch (e) {
            console.warn("[SheetButtonDice] Evaluation error", e);
            return NaN;
        }
    }
}