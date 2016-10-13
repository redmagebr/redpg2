module UI.Games.InviteDesigner {
    var currentGame : Game = null;
    var gameName = document.getElementById("gameInviteDesignerGameName");

    var form : HTMLFormElement = <HTMLFormElement> document.getElementById("gameInviteDesignerForm");
    var nameInput : HTMLInputElement = <HTMLInputElement> document.getElementById("gameInviteDesignerName");
    var msgInput : HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("gameInviteDesignerMessage");

    var err404 = document.getElementById("gameInviteDesigner404");
    var err401 = document.getElementById("gameInviteDesigner401");
    var success = document.getElementById("gameInviteDesigner200");
    export var $msgs = $([err404, err401, success]);
    var $404 = $(err404);
    var $401 = $(err401);
    var $success = $(success);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        UI.Games.InviteDesigner.submit();
    });

    export function callSelf (game : Game) {
        UI.PageManager.callPage(UI.idInviteDesigner);
        UI.Language.addLanguageVariable(gameName, "a", game.name);
        UI.Language.updateElement(gameName);
        currentGame = game;

        $msgs.stop().hide();
        nameInput.value = "";
        msgInput.value = "";
    }

    export function emptyName () {
        nameInput.value = "";
    }

    export function submit () {
        $msgs.stop().hide();

        var cbs = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.InviteDesigner.emptyName();
                UI.Games.InviteDesigner.showMessage(200);
            }
        };

        var cbe = <EventListenerObject> {
            handleEvent : function (data, xhr) {
                if (xhr.status === 409) {
                    UI.Games.InviteDesigner.showMessage(401);
                } else {
                    UI.Games.InviteDesigner.showMessage(404);
                }
            }
        };

        var nick = nameInput.value.split("#");
        if (nick.length !== 2) {
            showMessage(404);
            return;
        }
        var message = msgInput.value;

        Server.Games.sendInvite(currentGame.id, nick[0], nick[1], message, cbs, cbe);
    }

    export function showMessage (id : number) {
        $msgs.stop().hide();
        if (id === 200) {
            $success.fadeIn(Application.Config.getConfig("animTime").getValue());
        } else if (id === 401) {
            $401.fadeIn(Application.Config.getConfig("animTime").getValue());
        } else {
            $404.fadeIn(Application.Config.getConfig("animTime").getValue());
        }
    }
}