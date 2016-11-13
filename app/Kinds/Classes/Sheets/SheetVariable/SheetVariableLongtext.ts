class SheetVariablelongtext extends SheetVariable {
    private allowEmptyLines : boolean = false;
    private pClass : String = null;
    protected mouse = false;

    constructor (parent : Sheet, style : SheetStyle, ele : HTMLElement) {
        super(parent, style, ele);

        this.empty();

        this.defaultValueString = this.defaultValueString === null? "" : this.defaultValueString;

        this.allowEmptyLines = this.visible.dataset['allowempty'] === undefined ? false :
            (this.visible.dataset['allowempty'] === "1" ||
            this.visible.dataset['allowempty'].toLowerCase() === "true");

        this.pClass = this.visible.dataset['pclass'] === undefined ? null : this.visible.dataset['pclass'];

        if (this.editable) {
            ele.addEventListener("click", (function (e) {
                this.click();
            }).bind(this));

            ele.addEventListener("mousedown", (function (e) {
                this.mousedown();
            }).bind(this));

            ele.addEventListener("focus", (function (e) {
                this.focus();
            }).bind(this));

            ele.addEventListener("input", <EventListenerObject> {
                variable : this,
                handleEvent : function (e) {
                    this.variable.input(e);
                }
            });

            ele.addEventListener("keyup", <EventListenerObject> {
                variable : this,
                handleEvent : function (e) {
                    this.variable.keyup(e);
                }
            });

            ele.addEventListener("keydown", <EventListenerObject> {
                variable : this,
                handleEvent : function (e) {
                    this.variable.keydown(e);
                }
            });

            ele.addEventListener("blur", <EventListenerObject> {
                variable : this,
                handleEvent : function (e) {
                    this.variable.blur();
                }
            });

            this.updateContentEditable();
        }

        this.updateVisible();
    }

    public mousedown () {
        this.mouse = true;
    }

    public click (e : Event) {

    }

    public input (e) {

    }

    public keyup (e) {
        // if (e.key === "Tab" && document.activeElement === this.visible) {
        //     var selection = window.getSelection();
        //     var range = document.createRange();
        //     range.selectNodeContents(this.visible);
        //     selection.removeAllRanges();
        //     selection.addRange(range);
        // }
    }

    public keydown (e) {

    }

    public focus (){
        if (!this.mouse) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(this.visible);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        this.mouse = false;
    }

    public blur() {
        var lines = [];
        for (var i = 0; i < this.visible.children.length; i++ ){
            var line = (<HTMLElement> this.visible.children[i]).innerText;
            if (line !== null && line !== undefined) {
                line = line.trim();
            } else {
                line = "";
            }
            if (line !== "" || this.allowEmptyLines) {
                lines.push(line);
            }
        }
        this.storeValue(lines.join("\n"));
    }

    public updateContentEditable () {
        this.visible.contentEditable = (this.editable && (this.style.getSheetInstance() === null || this.style.getSheetInstance().isEditable())) ? "true" : "false";
        if (this.visible.contentEditable === "true") {
            this.visible.classList.add("contenteditable");
        } else {
            this.visible.classList.remove("contenteditable");
        }
    }

    public storeValue (value : string) {
        if (this.editable) {
            if (typeof value === "string" && value !== this.value) {
                this.value = value;
                this.considerTriggering();
            }
            this.updateVisible();
            this.updateContentEditable();
        }
    }

    public updateVisible () {
        this.empty();
        var curValue = this.value !== null ? this.value : this.defaultValueString !== null ? this.defaultValueString : "";
        var lines = curValue.split("\n");

        for (var i = 0; i < lines.length; i++) {
            var p = document.createElement("p");
            if (this.pClass !== null) p.classList.add(<string> this.pClass);
            p.appendChild(document.createTextNode(lines[i]));
            this.visible.appendChild(p);
        }
    }
}