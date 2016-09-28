class SheetStyle {
    private css : HTMLStyleElement = <HTMLStyleElement> document.createElement("style")
    private visible : HTMLElement = document.createElement("div");
    private $visible : JQuery = $(this.visible);
    protected styleInstance : StyleInstance;
    protected sheet : Sheet;
    protected sheetInstance : SheetInstance;

    protected multipleChanges : boolean = false;
    protected pendingChanges : Array<SheetVariable> = [];
    protected changeCounter : number = 0;
    protected idCounter = 0;

    protected after : Function = function () {};

    constructor () {
        this.visible.setAttribute("id", "sheetDiv");
        this.css.type = "text/css";
    }

    public getUniqueID () {
        return "undefined" + (this.idCounter++);
    }

    public simplifyName (str : String) {
        return (<Latinisable> str).latinise().toLowerCase().replace(/ /g,'');
    }

    public addStyle (style : StyleInstance) {
        this.styleInstance = style;

        this.visible.innerHTML = style.html;
        this.css.innerHTML = style.css;

        this.sheet = new Sheet(this, this.visible.childNodes);
        this.after();
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

    public getStyle () {
        return this.css;
    }

    public getElement () {
        return this.visible;
    }

    public get$Element () {
        return this.$visible;
    }
}