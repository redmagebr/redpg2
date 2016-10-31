class SheetVariabletext extends SheetVariable {
    private textNode : Text = document.createTextNode("");

    private clicked : boolean = false;

    /**
     * Called by the element being blurred, might include changes
     */
    public triggerBlur () {
        this.storeValue(this.visible.innerText);
    }

    /**
     * Called by any kind of changes being made to the visible element
     * @param e
     */
    public triggerInput (e : Event) {

    }

    public click () {
        this.clicked = true;
        console.log("Clicked " + this.id);

        window.setTimeout((function () {
            this.clicked = false;
        }).apply(this), 1);
    }

    public focus () {
        console.log("Focused " + this.id);
        if (this.clicked) {
            return;
        }
        if (document.activeElement === this.visible) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(this.visible);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    constructor (parent : Sheet, style : SheetStyle, ele : HTMLElement) {
        super(parent, style, ele);

        this.empty();
        this.attach();

        if (this.editable) {
            ele.addEventListener("click", (function (e) {
                this.click();
            }).apply(this));

            ele.addEventListener("focus", (function (e) {
                this.focus();
            }).apply(this));

            ele.addEventListener("input", <EventListenerObject> {
                variable : this,
                handleEvent : function (e) {
                    this.variable.triggerInput(e);
                }
            });

            ele.addEventListener("blur", <EventListenerObject> {
                variable : this,
                handleEvent : function (e) {
                    this.variable.triggerBlur();
                }
            });
        }
    }

    public empty () {
        while (this.visible.firstChild !== null) this.visible.removeChild(this.visible.firstChild);
    }

    public attach () {
        this.visible.appendChild(this.textNode);
    }

    public updateContentEditable () {
        this.visible.contentEditable = (this.editable && this.style.getSheetInstance().isEditable()) ? "true" : "false";
    }

    public updateVisible () {
        if (this.visible.firstChild !== this.textNode || this.visible.childNodes.length !== 1) {
            this.empty();
            this.attach();
        }

        this.textNode.nodeValue = this.value === null ? this.defaultString : this.value;

        this.updateContentEditable ();
    }

    public reset () {
        this.storeValue(this.defaultString === null? "" : this.defaultString);
    }
}