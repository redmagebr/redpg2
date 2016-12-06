class SheetVariablenumber extends SheetVariabletext {
    protected defaultValue : number;

    public parseString (str : string) {
        return parseFloat(str);
    }

    public parseNumber (n : number) {
        return +(n.toFixed(2));
    }

    public reset () {
        this.storeValue(this.defaultValue);
    }

    constructor (parent : Sheet, style : SheetStyle, ele : HTMLElement) {
        super(parent, style, ele);

        if (this.defaultValueString !== null) {
            this.defaultValue = this.parseString(<string>this.defaultValueString);
            if (isNaN(this.defaultValue)) {
                this.defaultValue = 0;
            }
        } else {
            this.defaultValue = 0;
        }

        this.value = this.defaultValue;
        this.updateVisible();
    }

    public storeValue (value : string | number) {
        if (this.editable) {
            if (typeof value !== "number") {
                if (typeof value === "string") {
                    value = value.replace(/,/g, ".");
                }
                value = this.parseString(value);
                if (isNaN(<number> value)) {
                    value = this.value;
                }
            }
            value = this.parseNumber(<number> value);
            if (value !== this.value) {
                this.value = value;
                this.considerTriggering();
            }
            this.updateVisible();
            this.updateContentEditable();
        }
    }

    public isImportantInputKey (key) {
        return key === "Tab" || key === "Backspace" || key === "Delete" || key === "ArrowLeft" || key === "ArrowRight" || key === "-" || key === "+";
    }

    public isAllowedKey (key) {
        return this.isImportantInputKey(key) || key === "." || key === "," || !isNaN(key);
    }

    public updateVisible () {
        if (this.value !== null) {
            this.textNode.nodeValue = this.value.toString();
        } else {
            this.textNode.nodeValue = this.defaultValue.toString();
        }

        this.visible.classList.remove("negative", "positive");
        if (this.value < 0) {
            this.visible.classList.add("negative");
        } else if (this.value > 0) {
            this.visible.classList.add("positive");
        }
    }
}