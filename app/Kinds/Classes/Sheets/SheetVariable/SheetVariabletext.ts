class SheetVariabletext extends SheetVariable {
    protected textNode : Text;
    protected mouse = false;

    constructor (parent : Sheet, style : SheetStyle, ele : HTMLElement) {
        super(parent, style, ele);

        this.textNode = document.createTextNode(this.defaultValueString === null ? "" : <string> this.defaultValueString);
        this.defaultValueString = this.defaultValueString === null ? "" : this.defaultValueString;

        this.empty();
        this.attachTextNode();

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
    }

    public attachTextNode () {
        this.visible.appendChild(this.textNode);
    }

    public click (e : Event) {

    }

    public mousedown () {
        this.mouse = true;
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

    public isAllowedKey (key) {
        return true;
    }

    public keydown (e) {
        if (e.key === "Enter" || !this.isAllowedKey(e.key)) {
            e.preventDefault();
            e.stopPropagation();
        }
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
        var value = this.visible.innerText.trim();
        if (this.visible.childNodes.length !== 1 || this.textNode.parentElement !== this.visible) {
            this.empty();
            this.attachTextNode();
        }
        this.storeValue(value);
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
            if (value === null || typeof value === "undefined") {
                value = this.value;
            } else if (typeof value !== "string") {
                value = (<Object> value).toString();
            }
            if (value !== this.value) {
                this.value = value;
                this.considerTriggering();
            }
            this.updateVisible();
            this.updateContentEditable();
        }
    }

    public updateVisible () {
        if (this.value !== null) {
            this.textNode.nodeValue = this.value;
        } else {
            this.textNode.nodeValue = this.defaultValueString === null ? "" : <string> this.defaultValueString;
        }
    }
}