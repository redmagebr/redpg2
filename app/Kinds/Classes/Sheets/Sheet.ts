class Sheet {
    protected parent : SheetStyle | SheetList = null;
    protected style : SheetStyle = null;
    protected elements : Array<Node> = [];

    protected values : { [id : string] : SheetVariable | SheetList}  = {};
    protected valuesSimplified : { [id : string] : SheetVariable | SheetList}  = {};
    protected indexedLists : Array<SheetList> = [];
    protected buttons : { [id : string] : SheetButton } = {};

    protected idCounter : number = 0;

    protected editOnly : Array<HTMLElement> = [];

    protected changeListener = <Listener> {
        sheet : this,
        counter : -1,
        handleEvent : function (variable, style, counter) {
            if (counter !== this.counter) {
                this.counter = counter;
                this.sheet.considerTriggering();
            }
        }
    };

    public getField (id : string) {
        if (this.values[id] === undefined) {
            return null;
        }
        return this.values[id];
    }

    public findField (id : string) {
        var simplified = Sheet.simplifyString(id);
        if (this.valuesSimplified[simplified] === undefined) {
            return null;
        }
        return this.valuesSimplified[simplified];
    }

    public getLists () {
        return this.indexedLists;
    }

    public updateEditable () {
        if (this.style.isEditable()) {
            this.editOnly.forEach(element => {
                element.style.display = "";
            });
        } else {
            this.editOnly.forEach(element => {
                element.style.display = "none";
            });
        }
    }

    public getValueFor (id : string) {
        var simplified = Sheet.simplifyString(id);
        if (this.valuesSimplified[simplified] === undefined) {
            for (var i = 0; i < this.indexedLists.length; i++) {
                var list = this.indexedLists[i];
                var value = list.getValueFor(simplified);
                if (!isNaN(value)) {
                    return value;
                }
            }
            return NaN;
        } else {
            return this.valuesSimplified[simplified].getValue();
        }
    }

    public static simplifyString (str : String) {
        return (<Latinisable> str).latinise().toLowerCase().replace(/ /g,'');
    }

    public getElements () {
        return this.elements;
    }

    public getUniqueID () {
        return "Var" + (++this.idCounter).toString();
    }

    public isRoot () {
        return this.parent === this.style;
    }

    public getParent () {
        return this.parent;
    }

    constructor (parent : SheetStyle | SheetList, style : SheetStyle, elements : NodeList | Array<Node>) {
        this.parent = parent;
        this.style = style;

        for (var i = 0; i < elements.length; i++) {
            this.elements.push(elements[i]);
            if (elements[i].nodeType === Node.ELEMENT_NODE) {
                this.processElement(<HTMLElement> elements[i]);
                let editOnly = (<HTMLElement> elements[i]).getElementsByClassName("editOnly");
                for (let i = 0; i < editOnly.length; i++) {
                    this.editOnly.push(<HTMLElement> editOnly[i]);
                }
            }
        }
    }

    public reset () {
        this.updateFromObject({});
    }

    public updateFromObject (obj : Object) {
        for (var id in this.values) {
            if (obj[id] === undefined) {
                var aliases = this.values[id].getAliases();
                var foundAlias = false;
                for (var i = 0; i < aliases.length; i++) {
                    if (obj[aliases[i]] !== undefined) {
                        this.values[id].updateFromObject(obj[aliases[i]]);
                        foundAlias = true;
                        break;
                    }
                }
                if (foundAlias) {
                    continue;
                }
                this.values[id].reset();
            } else {
                this.values[id].updateFromObject(obj[id]);
            }
        }
    }

    public exportAsObject () {
        var obj = {};
        var value;
        for (var id in this.values) {
            value = this.values[id].exportAsObject();
            if (value !== null) {
                obj[id] = value;
            }
        }
        return obj;
    }

    /**
     *
     *
     * SheetCreation below
     *
     */

    /**
     *
     * @param element
     */
    public processElement (element : HTMLElement) {
        if (element.classList.contains("sheetList")) {
            this.createList(element);
        } else if (element.classList.contains("sheetVariable")) {
            this.createVariable(element);
        } else if (element.classList.contains("sheetButton")) {
            this.createButton(element);
        } else {
            var lists = element.getElementsByClassName("sheetList");
            var validLists = [];
            var parent : HTMLElement;
            for (var i = 0; i < lists.length; i++) {
                parent = (<HTMLElement> lists[i]).parentElement;
                while (parent !== element) {
                    if (parent.classList.contains("sheetList")) {
                        break; // This sheetList is inside another sheetList and can't be processed right now
                    }
                    parent = parent.parentElement;
                }
                // If parent to be element, that means we went all the way up and found no SheetLists.
                if (parent === element) {
                    validLists.push(lists[i]);
                }
            }

            for (var i = 0; i < validLists.length; i++) {
                this.createList(validLists[i]);
            }

            var variables = element.getElementsByClassName("sheetVariable");
            for (var i = 0; i < variables.length; i++) {
                this.createVariable(<HTMLElement> variables[i]);
            }

            var buttons = element.getElementsByClassName("sheetButton");
            for (var i = 0; i < buttons.length; i++) {
                this.createButton(<HTMLElement> buttons[i]);
            }
        }
    }

    public createList (element : HTMLElement) {
        var constructor : typeof SheetList;
        var list : SheetList;
        var type : string = element.dataset['type'] === undefined ? "" : element.dataset['type'];
        // if (eval("typeof SheetList" + type + " !== \"function\"")) {
        //     type = "";
        // }
        // constructor = eval("SheetList" + type);
        constructor = this.style.getCreator("SheetList", type, "");
        list = new constructor(this, this.style, element);
        this.values[list.getId()] = list;
        this.valuesSimplified[Sheet.simplifyString(list.getId())] = list;

        var aliases = list.getAliases();

        for (var i = 0; i < aliases.length; i++) {
            this.valuesSimplified[Sheet.simplifyString(aliases[i])] = list;
        }

        if (list.isIndexed()) {
            this.indexedLists.push(list);
        }

        list.addChangeListener(this.changeListener);
    }

    public createVariable (element : HTMLElement) {
        var constructor : typeof SheetVariable;
        var variable : SheetVariable;
        var type : string = element.dataset['type'] === undefined ? "text" : element.dataset['type'];

        if (type === "name") {
            if (this.isRoot()) {
                this.style.createNameVariable(this, element);
            }
            return;
        }

        // if (eval("typeof SheetVariable" + type + " !== \"function\"")) {
        //     type = "text";
        // }
        // constructor = eval("SheetVariable" + type);
        constructor = this.style.getCreator("SheetVariable", type, "text");
        variable = new constructor(this, this.style, element);
        this.values[variable.getId()] = variable;
        this.valuesSimplified[Sheet.simplifyString(variable.getId())] = variable;

        var aliases = variable.getAliases();

        for (var i = 0; i < aliases.length; i++) {
            this.valuesSimplified[Sheet.simplifyString(aliases[i])] = variable;
        }

        variable.addChangeListener(this.changeListener);
    }

    public createButton (element : HTMLElement) {
        var constructor : typeof SheetButton;
        var button : SheetButton;
        var type : string = element.dataset['type'] === undefined ? "" : element.dataset['type'];
        // if (eval("typeof SheetButton" + type + " !== \"function\"")) {
        //     type = "";
        // }
        // constructor = eval("SheetButton" + type);
        constructor = this.style.getCreator("SheetButton", type, "");
        button = new constructor(this, this.style, element);
        this.buttons[button.getId()] = button;
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