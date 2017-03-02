class SheetVariableimageselect extends SheetVariable {
    protected defaultName : string;
    protected defaultUrl : string;

    protected select : HTMLSelectElement = <HTMLSelectElement> document.createElement("select");
    protected errorUrl : string = "images/sheetImgError.png";

    constructor (parent : Sheet, style : SheetStyle, element : HTMLElement) {
        super(parent, style, element);

        while (this.visible.firstChild !== null) this.visible.removeChild(this.visible.firstChild);
        this.visible.appendChild(this.select);

        if (this.defaultValueString === null) {
            this.defaultName = "";
            this.defaultUrl = "";
        } else {
            var obj;
            try {
                obj = JSON.parse(<string> this.defaultValueString);
                if (Array.isArray(obj) && obj.length === 2) {
                    this.defaultName = obj[0];
                    this.defaultUrl = obj[1];
                } else {
                    this.defaultName = "";
                    this.defaultUrl = "";
                }
            } catch (e) {
                console.log("[SheetVariableImageSelect] Produced invalid Default Value at " + this.id + ":", this.defaultValueString);
                this.defaultName = "";
                this.defaultUrl = "";
            }
        }

        if (this.visible.dataset['selectclass'] !== undefined) {
            this.select.classList.add(this.visible.dataset['selectclass']);
        }

        if (this.editable) {
            this.select.addEventListener("change", (function (e) {
                this.change(e)
            }).bind(this));


            this.select.addEventListener("click", (function (e) {
                this.click(e)
            }).bind(this));
        }

        this.value = [this.defaultName, this.defaultUrl];
        this.updateOptions();
        this.updateVisible();
    }

    public createOptions (name : string, arr : Array<Array<string>>) : HTMLOptGroupElement {
        var optgroup = <HTMLOptGroupElement> document.createElement("optgroup");

        optgroup.label = name;
        for (var i = 0; i < arr.length; i++) {
            optgroup.appendChild(this.createOption(arr[i][0], arr[i][1]));
        }

        return optgroup;
    }

    public createOption (name : string, url : string) : HTMLOptionElement {
        var option = document.createElement("option");
        option.value = JSON.stringify([name, url]);
        option.appendChild(document.createTextNode(name));
        return option;
    }

    public updateOptions () {
        while (this.select.firstChild !== null) this.select.removeChild(this.select.firstChild);

        if (this.value !== null && this.value[0] !== "" && this.value[1] !== "") {
            var lastValueName = UI.Language.getLanguage().getLingo("_SHEETVARIABLEIMAGELASTVALUE_");
            this.select.appendChild(this.createOptions(lastValueName, [this.value]));
        }

        if (this.defaultName !== "" && this.defaultUrl !== "") {
            this.select.appendChild(this.createOption(this.defaultName, this.defaultUrl));
        } else {
            var opt = this.createOption(UI.Language.getLanguage().getLingo("_SHEETVARIABLEIMAGENONE_"), this.errorUrl);
            this.select.appendChild(opt);
        }

        var images = DB.ImageDB.getImagesByFolder();

        if (images.length === 0) {
            var opt = this.createOption(UI.Language.getLanguage().getLingo("_SHEETVARIABLEIMAGESNOTLOADED_"), "");
            opt.disabled = true;
            this.select.appendChild(opt);
        } else {
            for (var i = 0; i < images.length; i++) {
                if (images[i].length > 0) {
                    var group = {
                        name: images[i][0].getFolder(),
                        images: []
                    };

                    if (group.name === "") {
                        group.name = UI.Language.getLanguage().getLingo("_IMAGESNOFOLDERNAME_");
                    }

                    for (var k = 0; k < images[i].length; k++) {
                        group.images.push([images[i][k].getName(), images[i][k].getLink()]);
                    }
                    this.select.appendChild(this.createOptions(group.name, group.images));
                }
            }
        }

        this.select.value = JSON.stringify(this.value);
    }

    public storeValue (arr : Array<string>) {
        if (!Array.isArray(arr) || arr.length !== 2) {
            arr = [this.defaultName, this.defaultUrl];
        }
        if (this.value[0] !== arr[0] || this.value[1] !== arr[1]) {
            this.value = arr;
            this.considerTriggering();
        }
        this.updateVisible();
    }

    public updateVisible () {
        this.updateOptions();
        this.select.disabled = (!this.editable || (this.style.getSheetInstance() !== null && !this.style.getSheetInstance().isEditable()));
    }

    public change (e) {
        var obj;
        try {
            obj = JSON.parse(this.select.value);
            if (Array.isArray(obj) && obj.length === 2) {
                this.storeValue(obj);
            }
        } catch (e) {
            console.log("[SheetVariableImageSelect] Produced invalid Array at " + this.id + ":", this.select.value, e);
            this.storeValue([this.defaultName, this.defaultUrl]);
        }
    }

    public click (e) {
        this.updateOptions();
    }
}