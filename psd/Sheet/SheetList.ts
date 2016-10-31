class SheetList {
    public id : string;
    protected sheet : Sheet;
    protected style : SheetStyle;
    protected visible : HTMLElement;
    protected rows : Array<Sheet> = [];
    protected detachedRows : Array<Sheet> = [];

    protected rowElements : Array<Node> = [];

    protected keyIndex : String = null;
    protected keyValue : String = null;

    public addRow () : Sheet {
        if (this.detachedRows.length > 0) {
            var newRow = this.detachedRows.pop();
            newRow.reset();
        } else {
            var newRowEles : Array<Node> = [];
            for (var i = 0; i < this.rowElements.length; i++) {
                newRowEles.push(this.rowElements[i].cloneNode(true));
            }
            var newRow = new Sheet(this.style, newRowEles);
        }
        this.rows.push(newRow);
        for (var i = 0; i < newRow.getElements().length; i++) {
            this.visible.appendChild(newRow.getElements()[i]);
        }
        return newRow;
    }

    public removeLastRow () {
        if (this.rows.length > 0) {
            this.removeRow(this.rows[this.rows.length - 1]);
        }
    }

    public removeRow (oldRow : Sheet) {
        var idx = this.rows.indexOf(oldRow);
        if (idx !== -1) {
            this.rows.splice(idx, 1);
            for (var i = 0; i < oldRow.getElements().length; i++) {
                this.visible.removeChild(oldRow.getElements()[i]);
            }
            this.detachedRows.push(oldRow);
        }
    }

    constructor (sheet : Sheet, style : SheetStyle, element : HTMLElement) {
        this.sheet = sheet;
        this.style = style;
        while (element.firstChild !== null) {
            this.rowElements.push(element.removeChild(element.firstChild));
        }
        this.visible = element;

        this.id = element.dataset['id'] === undefined ? this.style.getUniqueID() : element.dataset['id'];
    }

    public getValueFor (id : string) {
        if (this.keyValue !== null && this.keyIndex !== null) {
            for (var i = 0; i < this.rows.length; i++) {
                var value = this.rows[i].getValueFor(<string> this.keyIndex);
                if (typeof value === "string") {
                    var simpleValue = Sheet.simplifyString(value);
                    if (simpleValue === id) {
                        return this.rows[i].getValueFor(<string> this.keyValue);
                    }
                } else {
                    return NaN; // Variable types are constant, if one is not a string, neither is any of the others
                }
            }
        }
        return null;
    }

    public getValue () {
        if (this.keyValue !== null) {
            var values = [];
            for (var i = 0; i < this.rows.length; i++) {
                values.push(this.rows[i].getValueFor(<string> this.keyValue))
            }
            return values;
        } else {
            return null;
        }
    }

    public reset () {
        while (this.rows.length > 0) {
            this.removeLastRow();
        }
    }

    public storeValue (obj) {
        while (this.rows.length > obj.length) {
            this.removeLastRow();
        }
        while (this.rows.length < obj.length) {
            this.addRow();
        }

        for (var i = 0; i < obj.length; i++) {
            this.rows[i].storeValue(obj[i]);
        }
    }

    public exportAsObject () {
        var values = [];
        for (var i = 0; i < this.rows.length; i++) {
            values.push(this.rows[i].exportAsObject());
        }
        return values;
    }
}