class SheetStyle {
    protected css : HTMLStyleElement = <HTMLStyleElement> document.createElement("style")
    protected visible : HTMLElement = document.createElement("div");
    protected $visible : JQuery = $(this.visible);
    protected styleInstance : StyleInstance = null;
    protected sheet : Sheet = null;
    protected sheetInstance : SheetInstance = null;

    protected loadingSheet : boolean = false;
    protected updatingSheet : boolean = false;
    protected multipleChanges : boolean = false;
    protected pendingChanges : Array<SheetVariable> = [];
    protected changeCounter : number = 0;
    protected idCounter = 0;

    protected sheetChangeTrigger : Trigger = new Trigger();

    public addSheetChangedListener (f : Function | EventListenerObject) {
        this.sheetChangeTrigger.addListener(f);
    }

    public triggerSheetChanged (changedSheet : SheetInstance) {
        this.sheetChangeTrigger.trigger(changedSheet);
    }

    protected sheetChangeListener : EventListenerObject = <EventListenerObject> {
        style : this,
        handleEvent : function (changedSheet) {
            this.style.triggerSheetChanged(changedSheet);
        }
    };

    protected changeTrigger : Trigger = new Trigger();

    protected after : Function = function () {};

    constructor () {
        this.visible.setAttribute("id", "sheetDiv");
        this.css.type = "text/css";
    }

    public getUniqueID () {
        return "undefined" + (this.idCounter++);
    }

    public getStyleInstance () {
        return this.styleInstance;
    }

    public getSheetInstance () {
        return this.sheetInstance;
    }

    public addSheet (sheet : SheetInstance) {
        if (this.sheetInstance !== null) {
            this.sheetInstance.removeChangeListener(this.sheetChangeListener);
        }
        this.loadingSheet = true;
        this.sheetInstance = sheet;
        this.multipleChanges = true;
        this.sheet.storeValue(this.sheetInstance.values);
        this.triggerAll();
        this.multipleChanges = false;
        this.sheetInstance.addChangeListener(this.sheetChangeListener);
        this.loadingSheet = false;
    }

    public addStyle (style : StyleInstance) {
        var start = (new Date()).getTime();
        this.styleInstance = style;

        this.visible.innerHTML = style.html;
        this.css.innerHTML = style.css;

        this.sheet = new Sheet(this, this.visible.childNodes);

        this.sheet.addOnChange(<Listener> {
            style : this,
            lastCounter : -1,
            handleEvent : function (who, counter) {
                if (this.lastCounter !== counter) {
                    this.lastCounter = counter;
                    this.style.triggerChange();
                }
            }
        })

        this.after();

        var end = (new Date()).getTime();

        console.debug("[SheetStyle] " + style.name + " took " + (end - start) + "ms to process.");
    }

    public triggerVariableChange (variable : SheetVariable) {
        if (this.multipleChanges) {
            this.pendingChanges.push(variable);
        } else {
            variable.triggerChange(this.changeCounter++);
        }
    }

    public triggerAll () {
        for (var i = 0; i < this.pendingChanges.length; i++) {
            this.pendingChanges[i].triggerChange(this.changeCounter);
        }
        this.changeCounter += 1;
        this.pendingChanges = [];
    }

    public getCSS () : HTMLStyleElement {
        return this.css;
    }

    public getHTML () {
        return this.visible;
    }

    public get$HTML () {
        return this.$visible;
    }

    public triggerChange (counter : number) {
        this.changeTrigger.trigger(this, counter);
        // If we are loading, then we didn't change any value.
        if (!this.loadingSheet) {
            this.updatingSheet = true;
            this.sheetInstance.setValues(this.sheet.exportAsObject(), true);
            this.updatingSheet = false;
        }
    }

    public addOnChange (f : Function | Listener) {
        this.changeTrigger.addListener(f);
    }

    /**
     * This function is called when the style is being deleted. Use it to unset anything that was set up outside of normal Style behavior.
     */
    public die() {

    }
}