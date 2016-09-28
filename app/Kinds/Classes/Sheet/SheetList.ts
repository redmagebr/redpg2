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
        id = this.style.simplifyName(id);
        if (this.keyValue !== null && this.keyIndex !== null) {
            for (var i = 0; i < this.rows.length; i++) {
                var value = this.rows[i].getValueFor(<string> this.keyIndex);
                if (typeof value === "string") {
                    var simpleValue = this.style.simplifyName(value);
                    if (simpleValue === id) {
                        return this.rows[i].getValueFor(<string> this.keyValue);
                    }
                } else {
                    return null; // Variable types are constant, if one is not a string, neither is any of the others
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
}