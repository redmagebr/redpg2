module Server.Config {
    var CONFIG_URL = "Account";

    export function saveConfig (config : Object, cbs? : Listener | Function, cbe? : Listener | Function) {
        var ajax = new AJAXConfig(CONFIG_URL);
        ajax.setData("action", "StoreConfig");
        ajax.setData("config", config);
        ajax.setTargetLeftWindow();
        ajax.setResponseTypeJSON();

        var success = {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                if (this.cbs !== null) {
                    if (typeof this.cbs === "function") {
                        (<Function> this.cbs)(response, xhr);
                    } else {
                        (<Listener> this.cbs).handleEvent(response, xhr);
                    }
                }
            }
        };

        var error = {
            cbe : cbe,
            handleEvent : function (response, xhr) {
                if (this.cbe !== null) {
                    if (typeof this.cbe === "function") {
                        (<Function> this.cbe)(response, xhr);
                    } else {
                        (<Listener> this.cbe).handleEvent(response, xhr);
                    }
                }
            }
        };

        Server.AJAX.requestPage(ajax, success, error);
    }
}