module Server.Images {
    var IMAGES_URL = "Image";

    var emptyCallback : Function = function () {};

    export function getImages (cbs? : Listener, cbe? : Listener) {
        var success : Listener = <Listener> {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                // response.images = ARRAY <objeto>    folder: "" id: NEGATIVO name: "" url: ""
                // response.imagess3 = ARRAY <objeto> folder   name   size   uploader   uuid
                // response.space = FreeSpace, TotalSpace, UsedSpace
                if (this.cbs !== undefined) this.cbs.handleEvent(response, xhr);
            }
        };

        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(IMAGES_URL);
        ajax.setResponseTypeJSON();
        ajax.data = {action : "list"};
        ajax.setTargetRightWindow();
        Server.AJAX.requestPage(ajax, success, error);
    }
}