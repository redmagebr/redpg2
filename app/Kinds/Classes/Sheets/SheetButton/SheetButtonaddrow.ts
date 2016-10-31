class SheetButtonaddrow extends SheetButton {
    public click (e) {
        e.preventDefault();
        (<SheetList> this.parent.getParent()).addRow();
    }
}