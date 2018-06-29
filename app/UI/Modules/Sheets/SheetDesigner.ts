module UI.Sheets.SheetDesigner {
    var currentGame : Game;

    var inputName = <HTMLInputElement> document.getElementById("sheetDesignerName");
    var selectStyle = <HTMLSelectElement> document.getElementById("sheetDesignerStyleSelect");
    var checkboxRemain = <HTMLInputElement> document.getElementById("sheetDesignerRemain");
    var checkboxPublic = <HTMLInputElement> document.getElementById("sheetDesignerPublicSheet");

    var $error = $(document.getElementById("sheetDesignerError")).css("opacity", "0");

    document.getElementById("sheetDesignerForm").addEventListener("submit", function (e) {
        e.preventDefault();
        UI.Sheets.SheetDesigner.submit();
    });

    export function callSelf (game : Game) {
        $error.stop().css("opacity", 0);
        currentGame = game;
        UI.PageManager.callPage(UI.idSheetDesigner);

        inputName.value = "";
        checkboxRemain.checked = false;
        checkboxPublic.checked = false;

        var cbs = function (data) {
            UI.Sheets.SheetDesigner.fillStyles(data);
        };

        var cbe = function () {
            UI.Sheets.callSelf();
        };

        Server.Sheets.getStyleOptions(currentGame, cbs, cbe);
    }

    export function success () {
        $error.stop().css("opacity", 0);
        if (!checkboxRemain.checked) {
            UI.Sheets.callSelf();
        } else {
            inputName.value = "";
            checkboxPublic.checked = false;
            inputName.focus();
        }
    }

    export function fillStyles (data) {
        while (selectStyle.firstChild !== null) selectStyle.removeChild(selectStyle.firstChild);

        for (let i = 0; i < data.length; i++) {
            let name = data[i]['name'];
            if (name.charAt(0) == "_" && name.charAt(name.length - 1) == "_") {
                data[i]['name'] = UI.Language.getLanguage().getLingo(name);
            }
        }

        data.sort(function (a, b) {
            var na = a['name'].toLowerCase();
            var nb = b['name'].toLowerCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
            return 0;
        });

        for (var i = 0; i < data.length; i++) {
            if (data[i]['name'].indexOf("RedPG1") !== -1) {
                continue
            }
            var option = document.createElement("option");
            option.value = data[i]['id'];
            option.appendChild(document.createTextNode(data[i]['name']));

            selectStyle.appendChild(option);
        }

        selectStyle.value = "49";
    }

    export function submit () {
        $error.stop().css("opacity", 0);
        var cbe = <EventListenerObject> {
            $error : $error,
            handleEvent : function () {
                this.$error.stop().animate({"opacity" : 1}, Application.Config.getConfig("animTime").getValue());
            }
        };

        var cbs = function () {
            UI.Sheets.SheetDesigner.success();
        };

        var sheetName = inputName.value.trim();
        var styleId = parseInt(selectStyle.value);

        Server.Sheets.createSheet(currentGame, sheetName, styleId, checkboxPublic.checked, cbs, cbe);
    }
}