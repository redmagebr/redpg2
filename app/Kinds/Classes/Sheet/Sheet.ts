class Sheet {
    protected elements : Array<Node> = [];
    public style : SheetStyle;

    protected variables : { [id : string] : SheetVariable} = {};
    protected lists : { [id : string] : SheetList} = {};
    protected variableShortcuts : { [id : string] : SheetVariable | SheetList} = {};
    protected buttons : { [id : string] : SheetButton} = {};

    constructor (style : SheetStyle, eles : NodeList) {
        this.style = style;
        for (var i = 0; i < eles.length; i++) {
            this.elements.push(eles[i]);
        }

        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].nodeType === Node.ELEMENT_NODE) {
                this.processElement(<HTMLElement> this.elements[i]);
            }
        }
    }

    protected processElement (element: HTMLElement) {
        if (element.classList.contains("sheetList")) {
            this.createList(element);
        } else if (element.classList.contains("sheetVariable")) {
            this.createVariable(element);
        } else if (element.classList.contains("sheetButton")) {
            this.createButton(element);
        } else {
            var lists = element.getElementsByClassName("sheetList");
            for (var i = 0; i < lists.length; i++) {
                this.createList(<HTMLElement> lists[i]);
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

    public getValueFor (id : string) {
        id = this.style.simplifyName(id);
        return this.getValueForSimpleId(id);
    }

    public getValueForSimpleId (id : string) {
        if (this.variableShortcuts[id] !== undefined) {
            return this.variableShortcuts[id].getValue();
        }
        return null;
    }

    public getVariable (id : string) : SheetList | SheetVariable {
        if (this.variables[id] !== undefined) {
            return this.variables[id];
        }
        return null;
    }

    public getVariableBySimpleId (simpleid : string) : SheetVariable | SheetList {
        if (this.variableShortcuts[simpleid] !== undefined) {
            return this.variableShortcuts[simpleid];
        }
        return null;
    }

    public getButton (id : string) {
        if (this.buttons[id] !== undefined) {
            return this.buttons[id];
        }
        return null;
    }

    protected createVariable (element : HTMLElement) {
        var constructor : typeof SheetVariable;
        var variable : SheetVariable;
        var type : string;
        type = element.dataset['type'] === undefined ? "text" : element.dataset['type'].replace(/[^A-Za-z0-9]/g, "").toLowerCase();
        if (eval("typeof SheetVariable" + type + " !== \"function\"")) {
            type = "text";
        }
        constructor = eval("SheetVariable" + type);
        variable = new constructor(this, this.style, element);

        this.variables[variable.id] = variable;
        this.variableShortcuts[this.style.simplifyName(variable.id)] = variable;
    }

    protected createButton (element : HTMLElement) {
        var constructor : typeof SheetButton;
        var button : SheetButton;
        var type : string;
        type = element.dataset['type'] === undefined ? "" : element.dataset['type'].replace(/[^A-Za-z0-9]/g, "").toLowerCase();
        if (eval("typeof SheetButton" + type + " !== \"function\"")) {
            type = "";
        }
        constructor = eval("SheetButton" + type);
        button = new constructor(this, this.style, element);
        this.buttons[button.id] = button;
    }

    protected createList (element : HTMLElement) {
        var list = new SheetList(this, this.style, element);
        this.lists[list.id] = list;
        this.variableShortcuts[this.style.simplifyName(list.id)] = list;
    }
}