module UI.Sheets {
    document.getElementById("sheetsButton").addEventListener("click", function () { UI.Sheets.callSelf(); });

    var sheetList = document.getElementById("sheetWindowSheetList");

    export function callSelf (ready? : boolean) {
        UI.PageManager.callPage(UI.idSheets);

        if (ready !== true) {
            Server.Sheets.updateLists(<Listener> {
                handleEvent : function () {
                    UI.Sheets.callSelf(true);
                }
            });
            return;
        }

        while (sheetList.lastChild) {
            sheetList.removeChild(sheetList.lastChild);
        }


    }
}