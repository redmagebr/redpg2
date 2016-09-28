module Server.Games {
    var GAMES_URL = "Game";
    var INVITE_URL = "Invite";

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

        var ajax = new AJAXConfig(GAMES_URL);
        ajax.setResponseTypeJSON();
        ajax.data = {action : "list"};
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function getInviteList (cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(INVITE_URL);
        ajax.setResponseTypeJSON();
        ajax.data = {action : "list"};
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function acceptInvite (gameid : number, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(INVITE_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "accept");
        ajax.setData("gameid", gameid.toString());
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function rejectInvite (gameid : number, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(INVITE_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "reject");
        ajax.setData("gameid", gameid.toString());
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }
}