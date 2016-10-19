module UI.Sheets.SheetPermissionDesigner {
    var nameTarget = document.getElementById("sheetPermNameTarget");
    var list = document.getElementById("sheetPermList");
    var currentSheet : SheetInstance = null;
    var playerRows : Array<SheetPermRow> = null;

    document.getElementById("sheetPermForm").addEventListener("submit", function (e) {
        e.preventDefault();
        UI.Sheets.SheetPermissionDesigner.submit();
    });

    export function callSelf (sheet : SheetInstance) {
        currentSheet = sheet;
        UI.PageManager.callPage(UI.idSheetPerm);

        var cbs = function (arr) {
            UI.Sheets.SheetPermissionDesigner.printPlayers(arr);
        };

        var cbe = function () {
            UI.Sheets.SheetPermissionDesigner.empty();
        };

        Server.Sheets.getSheetPermissions(sheet, cbs, cbe);

        UI.Language.addLanguageVariable(nameTarget, "a", sheet.getName());
        UI.Language.updateElement(nameTarget);
    }

    export function empty () {
        while (list.firstChild !== null) list.removeChild(list.firstChild);
    }

    export function printPlayers (players) {
        empty();

        players.sort(function (a,b) {
            var na = a['nickname'].toLowerCase();
            var nb = b['nickname'].toLowerCase();

            if (na < nb) return -1;
            if (na > nb) return 1;

            var na = b['nicknamesufix'].toLowerCase();
            var nb = b['nicknamesufix'].toLowerCase();

            if (na < nb) return -1;
            if (na > nb) return 1;

            return 0;
        });

        playerRows = [];
        for (var i = 0; i < players.length; i++) {
            var row = new SheetPermRow(players[i]);
            playerRows.push(row);
            list.appendChild(row.getHTML());
        }
    }

    export function submit () {
        var cbs = function () {
            UI.Sheets.SheetPermissionDesigner.success();
        };

        var cbe = function () {};

        Server.Sheets.sendSheetPermissions(currentSheet, playerRows, cbs, cbe);
    }

    export function success () {
        UI.Sheets.keepOpen(currentSheet.getFolder(), currentSheet.getGameid());
        UI.Sheets.callSelf();
    }
}