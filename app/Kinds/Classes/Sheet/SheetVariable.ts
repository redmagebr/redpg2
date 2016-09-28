class SheetVariable {
    public id : string;
    public parent : Sheet;
    public style : SheetStyle;
    protected visible : HTMLElement;
    protected value : any = null;
    protected editable : boolean = true;
    protected changeTrigger : Trigger = new Trigger();

    constructor (parent : Sheet, style : SheetStyle, ele : HTMLElement) {
        this.parent = parent;
        this.style = style;
        this.visible = ele;

        this.id = ele.dataset['id'] === undefined ? this.style.getUniqueID() : ele.dataset['id'];
        this.editable = ele.dataset['editable'] === undefined ? true : (ele.dataset['editable'].toLowerCase() === "true" || ele.dataset['editable'] === "1");

        if (this.editable) {
            ele.contentEditable = "true";
            ele.addEventListener("input", {
                variable : this,
                handleEvent : function (e) {
                    this.variable.triggerInput(e);
                }
            });
            ele.addEventListener("blur", {
                variable : this,
                handleEvent : function (e) {
                    this.variable.triggerBlur();
                }
            });
        } else {
            ele.contentEditable = "false";
        }
    }

    protected cleanChildren () {
        while (this.visible.lastChild !== null) {
            this.visible.removeChild(this.visible.lastChild);
        }
    }

    public updateVisible () {
        this.cleanChildren();
        this.visible.appendChild(document.createTextNode(this.value));
    }

    /**
     * Called by any kind of changes being made to the visible element
     * @param e
     */
    public triggerInput (e : Event) {

    }

    /**
     * Called by the element being blurred, might include changes
     */
    public triggerBlur () {
        this.storeValue(this.visible.innerText);
    }

    public storeValue (val : any) {
        if (val !== this.value) {
            this.value = val;

            this.style.triggerVariableChange(this);
            this.updateVisible();
        }
    }

    public triggerChange (counter : number) {
        this.changeTrigger.trigger(this, counter);
    }

    public getValue () {
        return this.value;
    }

    public exportObject () {
        return this.value;
    }

    public addOnChange (f : Function | Listener) {
        this.changeTrigger.addListener(f);
    }
}