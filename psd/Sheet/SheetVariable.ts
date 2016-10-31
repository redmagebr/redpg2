class SheetVariable {
    public id : string;
    public parent : Sheet;
    public style : SheetStyle;
    protected visible : HTMLElement;
    protected value : any = null;
    protected editable : boolean = true;
    protected changeTrigger : Trigger = new Trigger();
    protected defaultString : String = null;

    public findId () {
        this.id = this.visible.dataset['id'] === undefined ? this.style.getUniqueID() : this.visible.dataset['id'];
    }

    public findEditable () {
        this.editable = this.visible.dataset['editable'] === undefined ? true : (this.visible.dataset['editable'].toLowerCase() === "true" || this.visible.dataset['editable'] === "1");
    }
    public findDefaultString () {
        this.defaultString = this.visible.dataset['default'] === undefined ? null : this.visible.dataset['default'];
    }

    constructor (parent : Sheet, style : SheetStyle, ele : HTMLElement) {
        this.parent = parent;
        this.style = style;
        this.visible = ele;

        this.findId();
        this.findEditable();
        this.findDefaultString();
    }

    public updateVisible () {

    }

    public reset () {
        this.storeValue(null);
    }

    public storeValue (val : any) {
        if (this.editable && val !== this.value) {
            this.value = val;

            this.style.triggerVariableChange(this);
            this.updateVisible();
        }
    }

    public getValue () {
        return this.value;
    }

    public getObject () {
        return this.value;
    }

    public exportAsObject () {
        return this.value;
    }

    public addOnChange (f : Function | Listener) {
        this.changeTrigger.addListener(f);
    }
    public triggerChange (counter : number) {
        this.changeTrigger.trigger(this, counter);
    }
}