class SheetVariable {
    protected visible : HTMLElement;
    protected parent : Sheet;
    protected style : SheetStyle;
    protected id : string;

    protected editable : boolean;

    protected value : any = null;
    protected defaultValueString : String = null;
    protected aliases : Array<string> = [];

    public getAliases () {
        return this.aliases;
    }

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        this.parent = parent;
        this.visible = element;
        this.style = style;

        this.id = this.visible.dataset['id'] === undefined ? this.parent.getUniqueID() : this.visible.dataset['id'];
        this.defaultValueString = this.visible.dataset['default'] === undefined ? null : this.visible.dataset['default'];
        this.editable = this.visible.dataset['editable'] === undefined ? true :
            (this.visible.dataset['editable'] === "1" ||
            this.visible.dataset['editable'].toLowerCase() === "true");

        if (this.visible.dataset['alias'] !== undefined) {
            var aliases = this.visible.dataset['alias'].trim().split(";");
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i].trim();
                if (alias !== "") {
                    this.aliases.push(alias);
                }
            }
        }
    }

    /**
     * Updates this variable's element to better reflect the current state.
     */
    public updateVisible () { }

    public empty () {
        while (this.visible.firstChild !== null) this.visible.removeChild(this.visible.firstChild);
    }

    public storeValue (obj) {
        if (this.editable && obj !== this.value) {
            this.value = obj;
            this.updateVisible();
            this.considerTriggering();
        }
    }

    public reset () {
        this.storeValue(this.defaultValueString);
    }

    public getValue () {
        return this.value;
    }

    public updateFromObject (obj) {
        this.storeValue(obj);
    }

    public exportAsObject () {
        if (this.editable) {
            return this.value;
        } else {
            return null;
        }
    }

    public getId () {
        return this.id;
    }

    /**
     * Alerts interested parties of changes made to this.
     * @type {Trigger}
     */
    protected changeTrigger = new Trigger();

    public addChangeListener (f : Listener | Function) {
        this.changeTrigger.addListener(f);
    }

    public addChangeListenerIfMissing (f : Listener | Function) {
        this.changeTrigger.addListenerIfMissing(f);
    }

    public removeChangeListener (f : Listener | Function) {
        this.changeTrigger.removeListener(f);
    }

    protected considerTriggering () {
        this.style.triggerVariableChange(this);
    }

    public triggerChange (counter : number) {
        this.changeTrigger.trigger(this, this.style, counter);
    }
}