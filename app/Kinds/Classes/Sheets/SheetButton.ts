class SheetButton {
    protected id : string;
    protected visible : HTMLElement;
    protected parent : Sheet;
    protected style : SheetStyle;

    protected clickFunction = (function (e) {
        this.click(e);
    }).bind(this);

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        this.parent = parent;
        this.visible = element;
        this.style = style;

        this.id = this.visible.dataset['id'] === undefined ? this.parent.getUniqueID() : this.visible.dataset['id'];

        this.visible.addEventListener("click", this.clickFunction);
    }

    public click (e : Event) {};

    public getId () {
        return this.id;
    }
}