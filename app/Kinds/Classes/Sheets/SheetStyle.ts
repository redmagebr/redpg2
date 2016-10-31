class SheetStyle {
    protected css : HTMLStyleElement = <HTMLStyleElement> document.createElement("style")
    protected visible : HTMLElement = document.createElement("div");
    protected $visible : JQuery = $(this.visible);

    protected styleInstance : StyleInstance = null;
    protected sheetInstance : SheetInstance = null;
    protected sheet : Sheet = null;

    protected sheetChangeTrigger : Trigger = new Trigger();

    protected loading : boolean = false;
    protected counter : number = 0;
    protected triggeredVariables : Array<SheetVariable | SheetList | Sheet> = [];

    protected nameVariable : SheetVariabletext = null;

    protected creatorListeners : Array<SheetCreatorListener> = [];

    protected sheetInstanceChangeListener = <Listener> {
        style : this,
        handleEvent : function (sheetInstance : SheetInstance) {
            if (this.style.sheetInstance === sheetInstance) {
                this.style.reloadSheetInstance();
            }
        }
    };

    public getSheet () {
        return this.sheet;
    }

    public addCreatorListener (obj : SheetCreatorListener) {
        this.creatorListeners.push(obj);
    }

    public triggerCreatorListeners () {
        this.creatorListeners.forEach(function (creator) {
            creator.complete();
        });
    }

    public addSheetInstance (sheet : SheetInstance) {
        if (this.sheetInstance !== null) {
            this.unbindSheetInstance();
        }
        this.sheetInstance = sheet;
        this.bindSheetInstance();
        this.reloadSheetInstance();
    }

    public reloadSheetInstance () {
        this.loading = true;
        if (this.nameVariable !== null) {
            this.nameVariable.storeValue(this.sheetInstance.getName());
        }
        this.sheet.updateFromObject(this.sheetInstance.getValues());
        this.triggerAllVariables();
        this.checkNPC();
        this.loading = false;
    }

    public checkNPC () {
        if (this.sheetInstance !== null && this.sheetInstance.isNPC()) {
            this.visible.classList.add("npctype");
            this.visible.classList.remove("charactertype");
        } else {
            this.visible.classList.remove("npctype");
            this.visible.classList.add("charactertype");
        }
    }

    public triggerAllVariables () {
        var counter = this.getCounter();
        for (var i = 0; i < this.triggeredVariables.length; i++ ){
            this.triggeredVariables[i].triggerChange(counter);
        }
        this.triggeredVariables = [];
    }

    public triggerVariableChange (variable : SheetVariable | SheetList | Sheet) {
        if (this.loading) {
            if (this.triggeredVariables.indexOf(variable) === -1) {
                this.triggeredVariables.push(variable);
            }
        } else {
            variable.triggerChange(this.getCounter());
        }
    }

    public getCounter () {
        return this.counter++;
    }

    constructor (style : StyleInstance) {
        var _startTime = (new Date()).getTime();
        this.styleInstance = style;
        this.fillElements();
        this.createSheet();
        this.bindSheet();
        this.checkNPC();
        var _endTime = (new Date()).getTime();
        console.debug("[SheetStyle] " + this.getName() + "'s processing took " + (_endTime - _startTime) + "ms to process.");
    }

    protected bindSheetInstance () {
        this.sheetInstance.addChangeListener(this.sheetInstanceChangeListener);
    }

    protected unbindSheetInstance () {
        this.sheetInstance.removeChangeListener(this.sheetInstanceChangeListener);
    }

    protected bindSheet () {
        var changeListener = <Listener> {
            counter : -1,
            handleEvent : function (sheet : Sheet, style : SheetStyle, counter : number) {
                if (this.counter !== counter) {
                    this.counter = counter;
                    style.updateSheetInstance();
                }
            }
        };

        this.sheet.addChangeListener(changeListener);
    }

    public getSheetInstance () {
        return this.sheetInstance;
    }

    public updateSheetInstance () {
        if (!this.loading) {
            if (this.nameVariable !== null) {
                this.sheetInstance.setName(this.nameVariable.getValue());
            }
            this.sheetInstance.setValues(this.sheet.exportAsObject(), true);
            this.checkNPC();
        }
    }

    protected createSheet () {
        this.sheet = new Sheet(this, this, this.visible.childNodes);
        this.triggerCreatorListeners();
    }

    protected fillElements () {
        this.visible.innerHTML = this.styleInstance.html;
        this.css.innerHTML = this.styleInstance.css;
    }

    public getStyleInstance () {
        return this.styleInstance;
    }

    public getId () {
        return this.styleInstance.getId();
    }

    public getName () {
        return this.styleInstance.getName();
    }

    public getCSS () {
        return this.css;
    }

    public getHTML () {
        return this.visible;
    }

    public createNameVariable (sheet : Sheet, element : HTMLElement) {
        this.nameVariable = new SheetVariabletext(sheet, this, element);

        this.nameVariable.addChangeListener(<Listener> {
            counter : -1,
            handleEvent : function (variable, style, counter) {
                if (this.counter !== counter) {
                    style.updateSheetInstance();
                }
            }
        });
    }

    /**
     * This code gets called when a Style is being destroyed. Destroy anything that you created which is not connected to the style.
     */
    public die () {
        this.unbindSheetInstance();
    }
}