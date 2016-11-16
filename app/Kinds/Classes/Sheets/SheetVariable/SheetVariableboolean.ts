class SheetVariableboolean extends SheetVariable {
    protected visible : HTMLInputElement;
    protected defaultState : boolean;

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        super (parent, style, element);

        if (this.visible.tagName.toLowerCase() !== "input" || this.visible.type !== "checkbox") {
            console.warn("[SheetVariableBoolean] Must be a checkbox input. Offending id:", this.getId());
            return;
        }

        this.defaultState = this.defaultValueString === null ? false :
                                 (this.defaultValueString === "1" || this.defaultValueString.toLowerCase() === "true") ?
                                    true : false;

        this.value = this.defaultState;

        if (this.editable) {
            this.visible.addEventListener("change", (function () {this.change();}).bind(this));
        }

        this.updateVisible();
    }

    public change () {
        this.storeValue(this.visible.checked);
    }

    public reset () {
        this.storeValue(this.defaultState);
    }

    public storeValue (state) {
        if (this.editable) {
            state = state === true;
            if (state !== this.value) {
                this.value = state;
                this.updateVisible();
                this.considerTriggering();
            }
        }
    }

    public updateVisible () {
        this.visible.checked = this.value;
        this.visible.disabled = !(this.editable && (this.style.getSheetInstance() === null || this.style.getSheetInstance().isEditable()));
    }
}