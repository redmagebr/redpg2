class SheetVariableselect extends SheetVariabletext {
    protected select : HTMLSelectElement = <HTMLSelectElement> document.createElement("select");
    protected values : Array<string> = [""];

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        super(parent, style, element);

        if (this.visible.dataset['values'] !== undefined) {
            this.values = this.visible.dataset['values'].split(";");

            for (var i = 0; i < this.values.length; i++) {
                var opt = <HTMLOptionElement> document.createElement("option");
                opt.value = this.values[i];
                opt.appendChild(document.createTextNode(this.values[i]));

                this.select.appendChild(opt);
            }
        }

        if (this.visible.dataset['selectclass'] !== undefined) {
            this.select.classList.add(this.visible.dataset['selectclass']);
        }

        if (this.editable) {
            this.select.addEventListener("blur", (function (e) {this.selectBlur(e)}).bind(this));
            this.select.addEventListener("change", (function (e) {this.selectChange(e)}).bind(this));
        }
    }

    public blur () {}

    public focus () {
        this.showSelect();
        this.select.focus();
    }

    public selectBlur (e : Event) {
        this.storeValue(this.select.value);
    }

    public selectChange (e : Event) {

    }

    public showSelect () {
        this.empty();
        this.visible.appendChild(this.select);
        this.select.value = this.value === null? this.values[0] : this.value;
    }

    public storeValue (value : string) {
        if (this.editable) {
            if (typeof value === "string" && value !== this.value && this.values.indexOf(value) !== -1) {
                this.value = value;
                this.considerTriggering();
            }
            this.updateVisible();
            this.updateContentEditable();
        }
    }

    public updateVisible () {
        this.empty();
        this.visible.appendChild(this.textNode);
        if (this.value !== null) {
            this.textNode.nodeValue = this.value;
        } else {
            this.textNode.nodeValue = this.defaultValueString === null ? "" : <string> this.defaultValueString;
        }
    }
}