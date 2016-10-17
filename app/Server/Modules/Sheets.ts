module Server.Sheets {
    var SHEET_URL = "Sheet";
    var STYLE_URL = "Style";

    var emptyCallback = <Listener> {handleEvent:function(){}};

    export function updateStyles (cbs? : Listener, cbe? : Listener) {
        var success : Listener = <Listener> {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                var ids = [];
                var styles = [];
                for (var i = 0; i < response.length; i++) {
                    if (ids.indexOf(response[i]['id']) === -1) {
                        ids.push(response[i]['id']);
                        styles.push(response[i]);
                    }
                }
                if (this.cbs !== undefined) this.cbs.handleEvent(styles, xhr);
            }
        };

        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(STYLE_URL);
        ajax.setResponseTypeJSON();
        ajax.data = {action : "listMine"};
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function updateLists (cbs? : Listener, cbe? : Listener) {
        var success : Listener = <Listener> {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                DB.GameDB.updateFromObject(response, true);
                if (this.cbs !== undefined) this.cbs.handleEvent(response, xhr);
            }
        };

        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(SHEET_URL);
        ajax.setResponseTypeJSON();
        ajax.data = {action : "list"};
        ajax.setTargetRightWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function sendFolder (sheet : SheetInstance, cbs? : Listener, cbe? : Listener) {
        cbs = cbs === undefined ? emptyCallback : cbs;
        cbe = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(SHEET_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "folder");
        ajax.setData("id", sheet.getId());
        ajax.setData("folder", sheet.getFolder());
        ajax.setTargetRightWindow();

        Server.AJAX.requestPage(ajax, cbs, cbe);
    }

    export function deleteSheet (sheet : SheetInstance, cbs? : Listener, cbe? : Listener) {
        cbs = cbs === undefined ? emptyCallback : cbs;
        cbe = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(SHEET_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "delete");
        ajax.setData("id", sheet.getId());
        ajax.setTargetRightWindow();

        Server.AJAX.requestPage(ajax, cbs, cbe);
    }
}