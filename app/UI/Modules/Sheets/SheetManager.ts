module UI.Sheets.SheetManager {
    var buttons : Array<SheetInstance> = [];
    var buttonHolder = document.getElementById("sheetViewerSheetsTab");
        while (buttonHolder.firstChild) buttonHolder.removeChild(buttonHolder.firstChild);

    export var currentSheet : SheetInstance = null;

    export function switchToSheet (sheet : SheetInstance) {
        UI.PageManager.callPage(UI.idSheetViewer);

        var idx = buttons.indexOf(sheet);
        if (idx !== -1) {
            buttons.splice(idx, 1);
        }
        buttons.push(sheet);

        buttonHolder.appendChild(sheet.getTab().getHTML());
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

        currentSheet = sheet;

    }

    export function openSheet (sheet : SheetInstance, reloadSheet? : boolean, reloadStyle? : boolean) {
        var loadSheet = !sheet.loaded || reloadSheet === true;
        var loadStyle = reloadStyle === true || !DB.StyleDB.hasStyle(sheet.getStyleId()) || !DB.StyleDB.getStyle(sheet.getStyleId()).isLoaded();

        var cbs = <EventListenerObject> {
            sheet : sheet,
            handleEvent : function () {
                UI.Sheets.SheetManager.switchToSheet(this.sheet);
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
            switchToSheet(sheet);
        }
    }
}