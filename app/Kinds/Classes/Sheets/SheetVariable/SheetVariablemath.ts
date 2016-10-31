class SheetVariablemath extends SheetVariabletext implements SheetCreatorListener {
    protected parsed;
    protected compiled;

    protected symbols : Array<string>;
    protected scope : { [id : string] : number};

    protected lastValue : number;

    protected changeListener = <Listener> {
        math : this,
        counter : -1,
        handleEvent : function (variable, style, counter) {
            if (this.counter !== counter) {
                this.math.checkForChange();
                this.counter = counter;
            }
        }
    };

    constructor (parent : Sheet, style : SheetStyle, ele : HTMLElement) {
        super(parent, style, ele);
        this.parse();
        this.style.addCreatorListener(this);
    }

    public checkForChange () {
        var newValue = this.getValue();
        if (this.lastValue !== newValue && !(isNaN(newValue) && isNaN(this.lastValue))) {
            this.lastValue = newValue;
            this.updateVisible();
            this.considerTriggering();
        }
    }

    protected parse () {
        var expr = this.value === null ? this.defaultValueString === null ? "0" : <string> this.defaultValueString : this.value;

        expr = Sheet.simplifyString(expr);

        try {
            this.parsed = math.parse(expr);
            this.compiled = math.compile(expr);
        } catch (e) {
            console.warn("[SheetVariableMath] Invalid Math variable at " + this.id + ". Error:", e);
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

    public complete () {
        if (this.editable) {
            this.style.getSheet().addChangeListener(this.changeListener);
        } else {
            var variables: Array<SheetList | SheetVariable> = [];
            var takeLists = false;
            for (var i = 0; i < this.symbols.length; i++) {
                var variable = this.style.getSheet().findField(this.symbols[i]);
                if (variable === null) {
                    takeLists = true;
                } else {
                    variables.push(variable);
                }
            }
            variables = variables.concat(this.style.getSheet().getLists());

            for (var i = 0; i < variables.length; i++) {
                variables[i].addChangeListener(this.changeListener);
            }
        }

        this.updateVisible();
    }

    public focus (){
        this.updateVisible();
        this.visible.focus();
        if (!this.mouse) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(this.visible);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        this.mouse = false;
    }

    public storeValue (value : string) {
        if (this.editable) {
            if (typeof value === "string" && value !== this.value) {
                this.value = value;
                this.parse();
                this.considerTriggering();
            }
            this.updateVisible();
            this.updateContentEditable();
        }
    }

    public getValue () : number {
        for (var i = 0; i < this.symbols.length; i++) {
            this.scope[this.symbols[i]] = this.style.getSheet().getValueFor(this.symbols[i]);
        }
        try {
            var result = this.compiled.eval(this.scope);
            return result;
        } catch (e) {
            console.warn("[SheetVariableMath] Evaluation error", e);
            return NaN;
        }
    }

    public updateVisible () {
        if (document.activeElement === this.visible) {
            this.textNode.nodeValue = this.value === null ? this.defaultValueString === null ? "0" : <string> this.defaultValueString : this.value;
        } else {
            var value = this.getValue();
            if (isNaN(value)) {
                this.textNode.nodeValue = UI.Language.getLanguage().getLingo("_SHEETVARIABLEMATHNAN_");
            } else {
                this.textNode.nodeValue = (+value.toFixed(1)).toString();
            }
        }
    }
}