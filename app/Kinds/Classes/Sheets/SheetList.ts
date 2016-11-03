class SheetList {
    protected id : string;
    protected visible : HTMLElement;
    protected parent : Sheet;
    protected style : SheetStyle;

    protected rows : Array<Sheet> = [];
    protected detachedRows : Array<Sheet> = [];

    protected sheetElements : Array<Node> = [];

    protected defaultValue : Array<Object>;

    protected sheetType : typeof Sheet;

    protected busy : boolean = false;

    protected sheetChangeListener = <Listener> {
        list : this,
        counter : -1,
        handleEvent : function (sheet, style, counter) {
            if (counter !== this.counter) {
                this.counter = counter;
                this.list.considerTriggering();
            }
        }
    };

    protected tableIndex : string; // This becomes the PRIMARY KEY for the sheets inside
    protected tableValue : string; // This becomes the VALUE for each row inside
    // Example: tableIndex of "Name" and tableValue of "Level" in a table with multiple rows of Name, Level would mean NAME identifies a row while LEVEL gets it's value
    // Additionally, asking for a List's value will return an array of every other value

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        this.parent = parent;
        this.visible = element;
        this.style = style;

        while (element.firstChild !== null) {
            this.sheetElements.push(element.removeChild(element.firstChild));
        }

        var type : string = element.dataset['sheettype'] === undefined ? "" : element.dataset['sheettype'];
        // if (eval("typeof Sheet" + type + " !== \"function\"")) {
        //     type = "";
        // }
        // this.sheetType = eval("Sheet" + type);
        this.sheetType = this.style.getCreator("Sheet", type, "");

        this.id = this.visible.dataset['id'] === undefined ? this.parent.getUniqueID() : this.visible.dataset['id'];
        this.tableIndex = this.visible.dataset['tableindex'] === undefined ? null : this.visible.dataset['tableindex'];
        this.tableValue = this.visible.dataset['tablevalue'] === undefined ? null : this.visible.dataset['tablevalue'];
        try {
            this.defaultValue = this.visible.dataset['default'] === undefined ? [] : JSON.parse(this.visible.dataset['default']);
            if (typeof this.defaultValue !== "object" || !Array.isArray(this.defaultValue)) {
                console.warn("[SheetList] Received non-array JSON as default value for " + this.getId() + " in " + this.style.getName() + ", reverting to empty object.");
                this.defaultValue = [];
            }
        } catch (e) {
            console.warn("[SheetList] Received invalid JSON as default value for " + this.getId() + " in " + this.style.getName() + ", reverting to empty object.");
            this.defaultValue = [];
        }
    }

    public breakIn (sheet : Sheet) {}

    public addRow () {
        var newRow : Sheet;
        if (this.detachedRows.length > 0) {
            newRow = this.detachedRows.pop();
        } else {
            var newRowEles : Array<Node> = [];
            for (var i = 0; i < this.sheetElements.length; i++) {
                newRowEles.push(this.sheetElements[i].cloneNode(true));
            }
            newRow = new this.sheetType(this, this.style, newRowEles);
            newRow.reset();

            this.breakIn(newRow);

            newRow.addChangeListener(this.sheetChangeListener);
        }

        this.appendRow(newRow);

        this.rows.push(newRow);

        if (!this.busy) {
            this.considerTriggering();
        }
    }

    public empty () {
        while (this.visible.firstChild !== null) {
            this.visible.removeChild(this.visible.firstChild);
        }
    }

    public reattachRows () {
        this.empty();
        for (var i = 0; i < this.rows.length; i++) {
            this.appendRow(this.rows[i]);
        }
    }

    public appendRow (newRow : Sheet) {
        for (var i = 0; i < newRow.getElements().length; i++ ){
            this.visible.appendChild(newRow.getElements()[i]);
        }
    }

    public removeRow (row : Sheet) {
        var idx = this.rows.indexOf(row);
        if (idx !== -1) {
            var oldRow = this.rows.splice(idx, 1)[0];

            for (var i = 0; i < oldRow.getElements().length; i++ ){
                this.visible.removeChild(oldRow.getElements()[i]);
            }

            this.detachedRows.push(oldRow);
        }

        if (!this.busy) {
            this.considerTriggering();
        }
    }

    public removeLastRow () {
        if (this.rows.length > 0) {
            this.removeRow(this.rows[this.rows.length - 1]);
        }
    }

    public isIndexed () {
        return (this.tableIndex !== null && this.tableValue !== null);
    }

    public getId () {
        return this.id;
    }

    public reset () {
        this.updateFromObject(this.defaultValue);
    }

    public updateFromObject (obj) {
        this.busy = true;
        if (this.rows.length !== obj.length) {
            while (this.rows.length < obj.length) {
                this.addRow();
            }

            while (this.rows.length > obj.length) {
                this.removeLastRow();
            }
        }

        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i].updateFromObject(obj[i]);
        }
        this.busy = false;
    }

    public getTableIndex () {
        return this.tableIndex;
    }

    public sort () {
        if (this.tableIndex !== null) {
            this.rows.sort(function (a : Sheet, b : Sheet) {
                var na = a.findField((<SheetList> a.getParent()).getTableIndex()).getValue();
                var nb = b.findField((<SheetList> b.getParent()).getTableIndex()).getValue();
                if (typeof na === "string") {
                    na = na.toLowerCase();
                    nb = nb.toLowerCase();
                    if (na < nb) return -1;
                    if (na > nb) return 1;
                    return 0;
                } else if (typeof na === "number") {
                    return na - nb;
                }
                return 0;
            });
            this.reattachRows();
        }
    }

    public getValueFor (id : string) : number {
        if (this.tableIndex !== null && this.tableValue !== null) {
            for (var i = 0; i < this.rows.length; i++) {
                var name = this.rows[i].getValueFor(<string> this.tableIndex);
                if (typeof name === "string") {
                    var simpleName = Sheet.simplifyString(name);
                    if (simpleName === id) {
                        return this.rows[i].getValueFor(<string> this.tableValue);
                    }
                } else {
                    return NaN; // Variable types are constant, if one is not a string, neither is any of the others
                }
            }
        }
        return NaN;
    }

    public getValue () : Array<number> {
        if (this.tableValue !== null) {
            var values = [];
            for (var i = 0; i < this.rows.length; i++) {
                values.push(this.rows[i].getValueFor(<string> this.tableValue))
            }
            return values;
        } else {
            return [NaN];
        }
    }

    public exportAsObject () {
        var arr = [];

        for (var i = 0; i < this.rows.length; i++) {
            arr.push(this.rows[i].exportAsObject());
        }

        return arr;
    }

    /**
     * Alerts interested parties of changes made to this.
     * @type {Trigger}
     */
    protected changeTrigger = new Trigger();

    public addChangeListener (f : Listener | Function) {
        this.changeTrigger.addListener(f);
    }

    public addChangeListenerIfMissing (f : Listener | Function) {
        this.changeTrigger.addListenerIfMissing(f);
    }

    public removeChangeListener (f : Listener | Function) {
        this.changeTrigger.removeListener(f);
    }

    protected considerTriggering () {
        this.style.triggerVariableChange(this);
    }

    public triggerChange (counter : number) {
        this.changeTrigger.trigger(this, this.style, counter);
    }
}