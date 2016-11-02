class SheetButtonremoverow extends SheetButton {
    protected sheetInstanceChangeListener = (function () {this.updateVisible();}).bind(this);

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        super(parent, style, element);

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
        (<SheetList> this.parent.getParent()).removeRow(this.parent);
    }
}