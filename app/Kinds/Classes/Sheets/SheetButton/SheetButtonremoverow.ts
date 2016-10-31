class SheetButtonremoverow extends SheetButton {
    public click (e) {
        e.preventDefault();
        (<SheetList> this.parent.getParent()).removeRow(this.parent);
    }
}