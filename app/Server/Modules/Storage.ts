module Server.Storage {
    var STORAGE_URL = "Storage";
    var validStorage = ["sounds", "images", "custom1", "custom2"];

    var emptyCallback = <Listener> {handleEvent:function(){}};

    export function requestImages (cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        success = <Listener> {
            success : success,
            handleEvent : function (data) {
                DB.ImageDB.updateFromObject(data);
                this.success.handleEvent(data);
            }
        };

        var ajax = new AJAXConfig(STORAGE_URL);
        ajax.setTargetRightWindow();
        ajax.setResponseTypeJSON();
        ajax.data = {action : "restore", id : "images"}; // "store"

        Server.AJAX.requestPage(ajax, success, error);
    }
}