/**
 * Created by Reddo on 01/11/2015.
 */
class Lingo {
    public ids : Array<string> = [];
    public name : string;
    public shortname : string;
    public flagIcon : string;

    public unknownLingo : string = " :( ";

    public langValues : { [id : string] : string } = {};

    public setLingo (id : string, value : string) {
        this.langValues[id] = value;
    }

    public getLingo (id : string, dataset? : {[id : string] : string}) {
        if (this.langValues[id] === undefined) {
            console.warn("[LANGUAGE] No string for \"" + id + "\" in " + this.name + ".");
            return this.unknownLingo;
        }

        var result : string = this.langValues[id];

        if (dataset === undefined) {
            return result;
        }

        var number = "a".charCodeAt(0);
        while (dataset["language" + String.fromCharCode(number)] !== undefined) {
            result = result.replace(new RegExp("%" + String.fromCharCode(number), 'g'), dataset["language" + String.fromCharCode(number)]);
            number++;
        }

        return result;
    }
}

module LingoList {
    var lingos :{ [id : string] : Lingo } = {};

    export function getLingos () : Array<Lingo> {
        var list = [];

        for (var id in lingos) {
            if (list.indexOf(lingos[id]) === -1) list.push(lingos[id]);
        }

        list.sort(function (a : Lingo, b : Lingo) {
            var na = a.name.toLowerCase();
            var nb = b.name.toLowerCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
            return 0;
        });

        return list;
    }

    export function getLingo (id : string) : Lingo {
        id = id.toLowerCase().trim();

        if (lingos[id] !== undefined) {
            return lingos[id];
        }

        id = id.split("-")[0];

        if (lingos[id] !== undefined) {
            return lingos[id];
        }

        return lingos["pt"];
    }

    export function storeLingo (lingo : Lingo) {
        for (var i = 0; i < lingo.ids.length; i++) {
            lingos[lingo.ids[i]] = lingo;
        }
    }
}