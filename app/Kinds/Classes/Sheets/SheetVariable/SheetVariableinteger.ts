class SheetVariableinteger extends SheetVariablenumber {
    public isAllowedKey (key) {
        return this.isImportantInputKey(key) || !isNaN(key);
    }

    public parseString (str : string) {
        return parseInt(str);
    }

    public parseNumber (n : number) {
        return Math.floor(n);
    }
}