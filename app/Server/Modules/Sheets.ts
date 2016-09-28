module Server.Sheets {
    var SHEET_URL = "Sheet";

    var emptyCallback = <Listener> {handleEvent:function(){}};

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
}