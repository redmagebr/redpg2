module Server.Games {
    var GAMES_URL = "Game";
    var INVITE_URL = "Invite";
    var ROOMS_URL = "Room";

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

    export function createGame (game : Game, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(GAMES_URL);
        ajax.setResponseTypeJSON();
        ajax.data = game.exportAsObject();
        ajax.setData("action", "create");
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function editGame (game : Game, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(GAMES_URL);
        ajax.setResponseTypeJSON();
        ajax.data = game.exportAsObject();
        ajax.setData("action", "edit");
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

    export function sendInvite (gameid : number, nickname : string, nicknamesufix : string, message : string, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(INVITE_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "send");
        ajax.setData("gameid", gameid.toString());
        ajax.setData("nickname", nickname);
        ajax.setData("nicksufix", nicknamesufix);
        if (message !== "") {
            ajax.setData("message", message);
        }
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

    export function leaveGame (gameid : number, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(GAMES_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "leave");
        ajax.setData("id", gameid.toString());
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function deleteGame (gameid : number, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(GAMES_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "delete");
        ajax.setData("id", gameid.toString());
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function deleteRoom (roomid : number, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(ROOMS_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "delete");
        ajax.setData("id", roomid.toString());
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }

    export function getPrivileges (gameid : number, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(GAMES_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "privileges");
        ajax.setData("id", gameid.toString());
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }


    export function setPrivileges (gameid : number, cbs? : Listener, cbe? : Listener) {
        var success = cbs === undefined ? emptyCallback : cbs;
        var error = cbe === undefined ? emptyCallback : cbe;

        var ajax = new AJAXConfig(GAMES_URL);
        ajax.setResponseTypeJSON();
        ajax.setData("action", "setPrivileges");
        ajax.setData("privileges", "permissions"); // TODO: Find out wtf "permissions" is
        ajax.setData("id", gameid.toString());
        ajax.setTargetLeftWindow();

        Server.AJAX.requestPage(ajax, success, error);
    }
}