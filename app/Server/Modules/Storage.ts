module Server.Storage {
    var STORAGE_URL = "Storage";
    var validStorage = ["sounds", "images", "custom1", "custom2"];
    var IMAGES_ID = "images";
    var SOUNDS_ID = "sounds";

    var ACTION_RESTORE = "restore";
    var ACTION_STORE = "store";

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
        ajax.data = {action : ACTION_RESTORE, id : IMAGES_ID}; // "store"

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function requestSounds (cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        success = <Listener> {
            success : success,
            handleEvent : function (data) {
                DB.SoundDB.updateFromObject(data);
                this.success.handleEvent(data);
            }
        };

        var ajax = new AJAXConfig(STORAGE_URL);
        ajax.setTargetRightWindow();
        ajax.setResponseTypeJSON();
        ajax.data = {action : ACTION_RESTORE, id : SOUNDS_ID}; // "store"

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function sendImages (cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(STORAGE_URL);
        ajax.setTargetRightWindow();
        ajax.setResponseTypeJSON();

        ajax.data = {action : ACTION_STORE, id : IMAGES_ID, storage : DB.ImageDB.exportAsObject()}; // "store"

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function sendSounds (cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(STORAGE_URL);
        ajax.setTargetRightWindow();
        ajax.setResponseTypeJSON();

        ajax.data = {action : ACTION_STORE, id : SOUNDS_ID, storage : DB.SoundDB.exportAsObject()}; // "store"

        console.log(ajax.data);

        Server.AJAX.requestPage(ajax, success, error);
    }
}