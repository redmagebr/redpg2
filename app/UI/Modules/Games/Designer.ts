module UI.Games.Designer {
    document.getElementById("gameNewGameButton").addEventListener("click", function (e) {
        e.preventDefault();
        UI.Games.Designer.callSelf();
    });

    var currentGame : Game = null;
    var nameInput : HTMLInputElement = <HTMLInputElement> document.getElementById("gameDesignerName");
    var descInput : HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("gameDesignerMessage");

    var $error = $(document.getElementById("gameDesignerError"));

    document.getElementById("gameDesignerForm").addEventListener("submit", function (e) {
        e.preventDefault();
        UI.Games.Designer.submit();
    });

    function clear () {
        nameInput.value = "";
        descInput.value = "";
        $error.stop().hide();
    }

    export function callSelf (game? : Game) {
        currentGame = game === undefined ? null : game;

        clear();
        if (currentGame !== null) {
            nameInput.value = currentGame.name;
            descInput.value = currentGame.description;
        }
        UI.PageManager.callPage(UI.idGameDesigner);
    }

    export function toGame () : Game {
        var game : Game;
        if (currentGame !== null) {
            game = currentGame;
        } else {
            game = new Game();
        }

        game.name = nameInput.value.trim();
        game.description = descInput.value.trim();

        return game;
    }

    export function submit() {
        var cbs = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.callSelf();
            }
        };

        var cbe = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.Designer.showError();
            }
        };

        if (currentGame === null) {
            Server.Games.createGame(toGame(), cbs, cbe);
        } else {
            Server.Games.editGame(toGame(), cbs, cbe);
        }
    }

    export function showError () {
        $error.fadeIn(Application.Config.getConfig("animTime").getValue())
    }
}