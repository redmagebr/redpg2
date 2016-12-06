class SheetButtoncommonsroll extends SheetButton {
    protected parsed;
    protected compiled;

    protected symbols : Array<string>;
    protected scope : { [id : string] : number};

    public click (e : MouseEvent) {
        e.preventDefault();

        var diceAmount = Number(this.parent.getValueFor("Dice Amount"));
        var diceFaces = Number(this.parent.getValueFor("Dice Faces"));
        var modifierVariable = this.parent.findField("Dice Modifier");
        var modText;
        if (modifierVariable !== null) {
            modText = modifierVariable.getValue();
        } else {
            modText = "0";
        }

        if (isNaN(diceAmount) || isNaN(diceFaces)) {
            diceAmount = 0;
            diceFaces = 0;
        } else {
            diceAmount = Math.floor(diceAmount);
            diceFaces = Math.floor(diceFaces);
            if (diceAmount <= 0 || diceFaces <= 0) {
                diceAmount = 0;
                diceFaces = 0;
            }
        }

        if (typeof modText !== "string") {
            modText = "0";
        }

        this.parse(modText);

        var modValue = this.getValue();

        var reason = "";
        if (diceAmount !== 0) {
            reason += diceAmount + "d" + diceFaces;
            if (modText !== "0") {
                reason += " + (" + modText+ ")";
            }
        } else {
            reason += modText;
        }

        if (modText !== modValue.toString()) {
            reason += " = ";

            if (diceAmount !== 0) {
                reason += diceAmount + "d" + diceFaces;
                if (modValue !== 0) {
                    if (modValue > 0) {
                        reason += " + " + modValue;
                    } else {
                        reason += " - " + Math.abs(modValue);
                    }
                }
            } else {
                if (modValue > 0) {
                    reason += " +" + modValue;
                } else {
                    reason += " -" + Math.abs(modValue);
                }
            }
        }

        if (UI.Chat.getRoom() !== null) {
            var dice = new MessageDice();
            dice.setPersona(this.style.getSheetInstance().getName());
            dice.setMsg(reason);
            dice.setMod(modValue);
            dice.addDice(diceAmount, diceFaces);
            if (UI.Chat.Forms.isDiceTower()) {
                dice.addDestinationStorytellers(UI.Chat.getRoom());
            }
            UI.Chat.sendMessage(dice);
        }
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

    protected parse (expr : string) {
        expr = Sheet.simplifyString(expr);

        try {
            this.parsed = math.parse(expr);
            this.compiled = math.compile(expr);
        } catch (e) {
            console.warn("[SheetButtonCommonsRoll] Invalid Math expression. Error:", e);
            this.parsed = math.parse("0");
            this.compiled = math.compile("0");
        }

        this.symbols = this.getSymbols();
        this.scope = this.getScope(this.symbols);
    }

    public getValue () : number {
        for (var i = 0; i < this.symbols.length; i++) {
            this.scope[this.symbols[i]] = this.style.getSheet().getValueFor(this.symbols[i]);
        }
        try {
            var result = this.compiled.eval(this.scope);
            return result;
        } catch (e) {
            console.warn("[SheetButtonCommonsRoll] Evaluation error", e);
            return NaN;
        }
    }
}