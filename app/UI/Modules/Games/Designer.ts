module UI.Games.Designer {
    function clear () {

    }

    export function fromGame (game? : Game) {
        clear();
        game = game === undefined ? null : game;
        if (game !== null) {

        }
    }

    export function toGame () : Game {
        var game = new Game();

        return game;
    }
}