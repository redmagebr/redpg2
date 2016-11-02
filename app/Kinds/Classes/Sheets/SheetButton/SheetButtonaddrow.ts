class SheetButtonaddrow extends SheetButton {
    protected target : string;
    protected sheetInstanceChangeListener = (function () {this.updateVisible();}).bind(this);

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        super(parent, style, element);

        this.target = this.visible.dataset["target"] === undefined ? "" : this.visible.dataset['target'];

        style.addSheetInstanceChangeListener(this.sheetInstanceChangeListener);
    }

    public updateVisible () {
        if (this.style.getSheetInstance().isEditable()) {
            this.visible.style.display = "";
        } else {
            this.visible.style.display = "none";
        }
    }

    public click (e) {
        e.preventDefault();

        var list = this.parent.getField(this.target);
        if (list !== null) {
            (<SheetList> list).addRow();
        }
    }
}