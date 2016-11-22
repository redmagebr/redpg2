module UI.Sheets.SheetManager {
    var myButton = document.getElementById("sheetOpenButton");
    myButton.style.display = "none";

    myButton.addEventListener("click", function () {
        UI.PageManager.callPage(UI.idSheetViewer);
    });

    var viewport = document.getElementById("sheetViewport");
        while (viewport.firstChild) viewport.removeChild(viewport.firstChild);

    var buttons : Array<SheetInstance> = [];
    var buttonHolder = document.getElementById("sheetViewerSheetsTab");
        while (buttonHolder.firstChild) buttonHolder.removeChild(buttonHolder.firstChild);

    export var currentSheet : SheetInstance = null;

    export var currentStyle : SheetStyle = null;

    var sheetChangeListener = function () {
        UI.Sheets.SheetManager.updateButtons();
    };

    function addButton (sheet : SheetInstance) {
        var idx = buttons.indexOf(sheet);
        if (idx !== -1) {
            buttons.splice(idx, 1);
        }
        buttons.push(sheet);

        // Changing positions is weird, stop that
        if (idx === -1) {
            buttonHolder.appendChild(sheet.getTab().getHTML());
        }
        sheet.getTab().toggleOn();

        // Overflowing? Remove oldest sheet
        while (buttonHolder.clientHeight > sheet.getTab().getHTML().scrollHeight) {
            var oldTab = buttons.splice(0,1)[0];
            buttonHolder.removeChild(oldTab.getTab().getHTML());
        }

        // Toggle off last sheet's tab, unless we're going for the same one, then it's all fine
        if (currentSheet !== null && currentSheet !== sheet) {
            currentSheet.getTab().toggleOff();
        }

        myButton.style.display = "";
    }

    export function close () {
        if (currentStyle !== null && currentSheet !== null) {
            buttons.splice(buttons.indexOf(currentSheet), 1);
            buttonHolder.removeChild(currentSheet.getTab().getHTML());

            detachStyle();
            currentSheet = null;
            currentStyle = null;

            if (buttons.length === 0) {
                myButton.style.display = "none";
            }
        }
    }

    export function detachStyle () {
        if (currentStyle !== null) {
            document.head.removeChild(currentStyle.getCSS());
            viewport.removeChild(currentStyle.getHTML());
        }
    }

    export function attachStyle () {
        if (currentStyle !== null) {
            document.head.appendChild(currentStyle.getCSS());
            viewport.appendChild(currentStyle.getHTML());
        }
    }

    export function switchToSheet (sheet : SheetInstance, reloadStyle? : boolean, callPage? : boolean) {
        if (callPage) {
            UI.PageManager.callPage(UI.idSheetViewer);
        }
        addButton(sheet);
        if (currentSheet !== sheet && currentSheet !== null) {
            currentSheet.removeChangeListener(sheetChangeListener);
        }

        currentSheet = sheet;

        var newStyle : SheetStyle = StyleFactory.getSheetStyle(currentSheet.getStyle(), reloadStyle === true);

        if (currentStyle !== newStyle) {
            detachStyle();
        }

        if (currentStyle !== newStyle) {
            currentStyle = newStyle;
            attachStyle();
        }

        currentSheet.addChangeListener(sheetChangeListener);
        currentStyle.addSheetInstance(currentSheet);
        updateButtons();
    }

    export function openSheetId (sheetid : number) {
        var sheet = DB.SheetDB.getSheet(sheetid);
        if (sheet !== null) {
            openSheet(sheet);
        } else {
            var cbs = <EventListenerObject> {
                sheetid : sheetid,
                handleEvent : function () {
                    UI.Sheets.SheetManager.openSheet(DB.SheetDB.getSheet(this.sheetid));
                }
            };

            var cbe = <EventListenerObject> {
                handleEvent : function () {
                    alert("Unable to open sheet. Sorri");
                }
            };

            Server.Sheets.loadSheet(sheetid, cbs, cbe);
        }
    }

    export function openSheet (sheet : SheetInstance, reloadSheet? : boolean, reloadStyle? : boolean, callPage? : boolean) {
        var loadSheet = !sheet.loaded || reloadSheet === true;
        var loadStyle = reloadStyle === true || !DB.StyleDB.hasStyle(sheet.getStyleId()) || !DB.StyleDB.getStyle(sheet.getStyleId()).isLoaded();
        callPage = callPage === undefined ? true : callPage

        if (reloadStyle === true && currentStyle !== null && currentStyle.getStyleInstance() === sheet.getStyle()) {
            detachStyle();
            currentStyle = null;
        }

        var cbs = <EventListenerObject> {
            sheet : sheet,
            reloadStyle : reloadStyle === true,
            callPage : callPage,
            handleEvent : function () {
                UI.Sheets.SheetManager.switchToSheet(this.sheet, this.reloadStyle, this.callPage);
            }
        };

        var cbe = <EventListenerObject> {
            handleEvent : function () {
                UI.Sheets.callSelf();
            }
        };

        if (loadSheet && loadStyle) {
            Server.Sheets.loadSheetAndStyle(sheet.getId(), sheet.getStyleId(), cbs, cbe);
        } else if (loadSheet) {
            Server.Sheets.loadSheet(sheet.getId(), cbs, cbe);
        } else if (loadStyle) {
            Server.Sheets.loadStyle(sheet.getStyleId(), cbs, cbe);
        } else {
            switchToSheet(sheet, false, callPage);
        }
    }

    var sheetSave = document.getElementById("sheetSave");
    var importInput = <HTMLInputElement> document.getElementById("sheetViewerJSONImporter");
    var sheetAutomatic = document.getElementById("sheetAutomatic");
    var sheetEdit = document.getElementById("sheetEdit");

    sheetSave.addEventListener("click", function (e) {
        e.preventDefault();
        UI.Sheets.SheetManager.saveSheet();
    });

    export function isEditable () {
        return sheetEdit.classList.contains("icons-sheetEditOn");
    }

    export function saveSheet () {
        DB.SheetDB.saveSheet(currentSheet);
    }

    sheetAutomatic.addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("icons-sheetAutomaticOn");
        this.classList.toggle("icons-sheetAutomatic");
    });

    sheetEdit.addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("icons-sheetEditOn");
        this.classList.toggle("icons-sheetEdit");

        if (currentSheet !== null) {
            currentSheet.considerEditable();
        }
    });

    document.getElementById("sheetClose").addEventListener("click", function(e) {
        e.preventDefault();
        UI.Sheets.SheetManager.close();
    });

    var sheetImport = document.getElementById("sheetImport");

    sheetImport.addEventListener("click", function (e) {
        e.preventDefault();
        UI.Sheets.SheetManager.importFromJSON();
    });

    document.getElementById("sheetExport").addEventListener("click", function (e) {
        e.preventDefault();
        UI.Sheets.SheetManager.exportAsJSON();
    });

    document.getElementById("sheetFullReload").addEventListener("click", function (e : MouseEvent) {
        UI.Sheets.SheetManager.reload(e.shiftKey);
    });

    // Hiding reload to reduce button bloat
    // document.getElementById("sheetReload").addEventListener("click", function () {
    //     UI.Sheets.SheetManager.reload();
    // });

    export function reload (reloadStyle? : boolean) {
        openSheet(currentSheet, true, reloadStyle === true);
    }

    export function isAutoUpdate () {
        return sheetAutomatic.classList.contains("icons-sheetAutomaticOn");
    }

    export function updateButtons () {
        if (currentSheet.isEditable()) {
            sheetSave.style.display = "";
            sheetImport.style.display = "";
        } else {
            sheetSave.style.display = "none";
            sheetImport.style.display = "none";
        }
        if (currentSheet.changed) {
            sheetSave.classList.remove("icons-sheetSave");
            sheetSave.classList.add("icons-sheetSaveChanged");
        } else {
            sheetSave.classList.add("icons-sheetSave");
            sheetSave.classList.remove("icons-sheetSaveChanged");
        }
    }

    importInput.addEventListener("change", function () {
        UI.Sheets.SheetManager.importFromJSON(true);
    });

    export function importFromJSON (ready? : boolean, json? : string) {
        if (ready !== true) {
            importInput.value = "";
            importInput.click();
            return;
        }
        if (json !== undefined) {
            try {
                json = JSON.parse(json);
                currentSheet.setValues(json, true);
            } catch (e) {
                alert(UI.Language.getLanguage().getLingo("_SHEETIMPORTFAILED_"));
            }
            return;
        }

        if (importInput.files.length === 1) {
            var file = importInput.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function (e) {
                UI.Sheets.SheetManager.importFromJSON(true, e.target['result']);
            });

            reader.readAsText(file);
        }
    }

    export function exportAsJSON () {
        var blob = new Blob([JSON.stringify(currentStyle.getSheet().exportAsObject(), null, 4)], { type : "text/plain;charset=utf-8;"});
        var d = new Date();
        var curr_date = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
        var curr_month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
        var curr_year = d.getFullYear();

        saveAs(blob, currentSheet.getGame().getName() + " - " + currentSheet.getName() + " (" + curr_year + curr_month + curr_date + ").json");
    }
}