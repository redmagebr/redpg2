class SheetButton {
    public id : string;
    protected visible : HTMLElement;
    protected click : Function = function () {};
    protected sheet : Sheet;
    protected style : SheetStyle;

    constructor (sheet : Sheet, style : SheetStyle, ele : HTMLElement) {
        this.sheet = sheet;
        this.style = style;
        this.visible = ele;

        this.visible.addEventListener("click", {
            button : this,
            handleEvent : function (e) {
                this.button.click(e);
            }
        });

        this.id = ele.dataset['id'] === undefined ? this.style.getUniqueID() : ele.dataset['id'];
    }
}