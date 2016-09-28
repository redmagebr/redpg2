module DB.GameDB {
    var games : {[id : number] : Game} = {};

    export function hasGame (id : number) {
        return games[id] !== undefined;
    }

    export function getGame (id : number) : Game {
        if (hasGame(id)) {
            return games[id];
        }
        return null;
    }

    export function getOrderedGameList () : Array<Game> {
        var list : Array<Game> = [];

        for (var id in games) {
            list.push(games[id]);
        }

        list.sort(function (a : Game, b : Game) : number {
            var na = a.name.toLowerCase();
            var nb = b.name.toLowerCase();
            if (na < nb) return -1;
            if (nb < na) return 1;
            return 0;
        });

        return list;
    }

    export function updateFromObject (obj : Array<Object>, cleanup : boolean) {
        var cleanedup : {[id : number] : Game} = {};
        for (var i = 0; i < obj.length; i++) {
            if (games[obj[i]['id']] === undefined) {
                games[obj[i]['id']] = new Game();
            }
            games[obj[i]['id']].updateFromObject(obj[i], cleanup);
            cleanedup[<string> obj[i]['id']] = <Game> games[obj[i]['id']];
        }
        if (cleanup) {
            games = cleanedup;
        }
    }
}