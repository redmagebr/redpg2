class SheetStyleTranslatable extends SheetStyle {
    protected translateObject (obj : Object) {
        for (var key in obj) {
            if (typeof obj[key] === "string" && obj[key].charAt(0) === "_") {
                obj[key] = UI.Language.getLanguage().getLingo(obj[key]);
            } else if (typeof obj[key] === "object") {
                obj[key] = this.translateObject(obj[key]);
            }
        }
        return obj;
    }

    protected translateSheet () {
        var variables = this.visible.getElementsByClassName("sheetVariable");
        for (var i = 0; i < variables.length; i++) {
            // Placeholder Lingo
            if ((<HTMLElement> variables[i]).dataset["placeholder"] !== undefined && (<HTMLElement> variables[i]).dataset['placeholder'].charAt(0) === "_") {
                (<HTMLElement> variables[i]).dataset['placeholder'] = UI.Language.getLanguage().getLingo((<HTMLElement> variables[i]).dataset['placeholder']);
            }

            // Default Lingo
            if ((<HTMLElement> variables[i]).dataset['default'] !== undefined && (<HTMLElement> variables[i]).dataset['default'].charAt(0) === "_") {
                (<HTMLElement> variables[i]).dataset['default'] = UI.Language.getLanguage().getLingo((<HTMLElement> variables[i]).dataset['default']);
            }
        }

        var lists = this.visible.getElementsByClassName("sheetList");
        for (var i = 0; i < lists.length; i++) {
            var list = lists[i];
            var listDefault = (<HTMLElement> list).dataset['default'];
            if (listDefault !== undefined) {
                try {
                    var defaultObj = JSON.parse(listDefault);
                    if(Array.isArray(defaultObj)) {
                        for (var k = 0; k < defaultObj.length; k++) {
                            if (defaultObj[k] instanceof Object) {
                                defaultObj[k] = this.translateObject(defaultObj[k]);
                            }
                        }
                        (<HTMLElement> list).dataset['default'] = JSON.stringify(defaultObj);
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        UI.Language.updateScreen(this.visible);
    }

    protected fillElements () {
        this.visible.innerHTML = this.styleInstance.html;
        this.css.innerHTML = this.styleInstance.css;
        this.translateSheet();
    }
}