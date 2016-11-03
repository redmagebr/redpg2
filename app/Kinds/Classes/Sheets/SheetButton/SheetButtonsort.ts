class SheetButtonsort extends SheetButtonaddrow {
    public click (e : Event) {
        e.preventDefault();

        var list = this.parent.getField(this.target);
        if (list !== null) {
            (<SheetList> list).sort();
        }
    }
}