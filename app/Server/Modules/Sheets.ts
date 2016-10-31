module Server.Sheets {
    var SHEET_URL = "Sheet";
    var STYLE_URL = "Style";

    var emptyCallback = <Listener> {handleEvent:function(){}};
    var emptyCallbackFunction = function () {};

    export function loadSheetAndStyle (sheetid : number, styleid : number, cbs? : EventListenerObject, cbe? : EventListenerObject) {
        var loaded = {
            style : false,
            sheet : false,
            success : cbs === undefined ? emptyCallback : cbs
        };

        var styleCBS = <EventListenerObject> {
            loaded : loaded,
            handleEvent : function (data) {
                this.loaded.style = true;
                if (this.loaded.sheet) {
                    this.loaded.success.handleEvent();
                }
            }
        };

        var sheetCBS = <EventListenerObject> {
            loaded : loaded,
            handleEvent : function (data) {
                this.loaded.sheet = true;
                if (this.loaded.style) {
                    this.loaded.success.handleEvent();
                }
            }
        };

        var error = cbe === undefined ? emptyCallback : cbe;

        loadSheet(sheetid, sheetCBS, error);
        loadStyle(styleid, styleCBS, error, true);
    }

    export function loadSheet (sheetid : number, cbs? : Listener, cbe? : Listener) {
        var success : Listener = <Listener> {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                DB.SheetDB.updateFromObject(response);
                if (this.cbs !== undefined) this.cbs.handleEvent(response, xhr);
            }
        };

        var error = cbe === undefined ? emptyCallback : cbe;

        var sheetAjax = new AJAXConfig(SHEET_URL);
        sheetAjax.setData("id", sheetid);
        sheetAjax.setData("action", "request");
        sheetAjax.setTargetRightWindow();
        sheetAjax.setResponseTypeJSON();
        Server.AJAX.requestPage(sheetAjax, success, error);
    }

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

    export function sendStyle (style : StyleInstance, cbs? : Listener | EventListenerObject | Function, cbe? : Listener | EventListenerObject | Function) {
        cbs = cbs === undefined ? emptyCallback : cbs;
        cbe = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(STYLE_URL);
        ajax.setResponseTypeJSON();
        if (style.id === 0) {
            ajax.setData("action", "createAdvanced");
        } else {
            ajax.setData("action", "editAdvanced");
            ajax.setData("id", style.id);
        }

        ajax.setData("name", style.name);
        ajax.setData("public", style.publicStyle ? '1' : '0');
        ajax.setData("html", style.html);
        ajax.setData("css", style.css);
        ajax.setData("afterProcess", style.publicCode);
        ajax.setData("beforeProcess", style.mainCode);
        ajax.setData("gameid", style.gameid);

        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, cbs, cbe);
    }

    export function loadStyle (id : number, cbs? : Listener, cbe? : Listener, right? : boolean) {
        var success : Listener = <Listener> {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                var newObj = {
                    id : response['id'],
                    name : response['name'],
                    html : response['html'],
                    css : response['css'],
                    mainCode : response['beforeProcess'],
                    publicCode : response['afterProcess']
                };

                if (response['gameid'] !== undefined) {
                    newObj['gameid'] = response['gameid'];
                } else {
                    newObj['publicStyle'] = Application.getMe().isAdmin();
                }
                DB.StyleDB.updateStyle(newObj);
                if (this.cbs !== undefined) this.cbs.handleEvent(response, xhr);
            }
        };

        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(STYLE_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "request");
        ajax.setData("id", id);
        if (right === true) {
            ajax.setTargetRightWindow();
        } else {
            ajax.setTargetLeftWindow();
        }

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

    export function getSheetPermissions (sheet : SheetInstance, cbs? : Listener | EventListenerObject | Function, cbe? : Listener | EventListenerObject | Function) {
        cbs = cbs === undefined ? emptyCallback : cbs;
        cbe = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(SHEET_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "listPerm");
        ajax.setData("id", sheet.getId());
        ajax.setTargetRightWindow();

        Server.AJAX.requestPage(ajax, cbs, cbe);
    }

    export function sendSheetPermissions (sheet : SheetInstance, permissions : Array<SheetPermRow>, cbs? : Listener | EventListenerObject | Function, cbe? : Listener | EventListenerObject | Function) {
        cbs = cbs === undefined ? emptyCallback : cbs;
        cbe = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(SHEET_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "updatePerm");
        ajax.setData("id", sheet.getId());

        var privileges = [];
        for (var i = 0; i < permissions.length; i++) {
            privileges.push(permissions[i].exportPrivileges());
        }
        ajax.setData("privileges", privileges);

        ajax.setTargetRightWindow();

        Server.AJAX.requestPage(ajax, cbs, cbe);
    }

    export function getStyleOptions (game : Game, cbs : Function | EventListenerObject, cbe : Function | EventListenerObject) {
        cbs = <EventListenerObject> {
            cbs : cbs,
            handleEvent : function (data) {
                if (typeof this.cbs === "function") {
                    this.cbs(data);
                } else if (typeof this.cbs === "object") {
                    this.cbs.handleEvent(data);
                }
            }
        }
        cbe = cbe === undefined ? emptyCallbackFunction : cbe;

        var ajax = new AJAXConfig(STYLE_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "list");
        ajax.setData("id", game.getId());
        ajax.setTargetRightWindow();

        // url : 'Style',
        //     data: {id : gameid, action : 'list'},

        Server.AJAX.requestPage(ajax, cbs, cbe);
    }

    export function createSheet (game : Game, sheetName : string, styleId : number, isPublic : boolean, cbs? : Listener | EventListenerObject | Function, cbe? : Listener | EventListenerObject | Function) {
        cbs = cbs === undefined ? emptyCallback : cbs;
        cbe = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(SHEET_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "create");
        ajax.setData("gameid", game.getId());
        ajax.setData("name", sheetName);
        ajax.setData("idstyle", styleId);
        ajax.setData("publica", isPublic);
        ajax.setTargetRightWindow();

        Server.AJAX.requestPage(ajax, cbs, cbe);
    }
}