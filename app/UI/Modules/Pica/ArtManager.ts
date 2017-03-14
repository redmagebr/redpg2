module UI.Pica.ArtManager {
    Server.Chat.addRoomListener(function () {
        UI.Pica.Board.Canvas.redraw();
    });

    export function getLength (roomid : number, url : string) {
        return Application.LocalMemory.getMemoryLength(createIdString(roomid, url));
    }

    export function getLengthByUser (roomid : number, url : string) {
        var art = getArt(roomid, url);
        var userArts = {};
        for (var i = 0; i < art.length; i++) {
            if (userArts[art[i].getUserId()] == undefined) {
                userArts[art[i].getUserId()] = 0;
            }
            userArts[art[i].getUserId()] += 1;
        }
        return userArts;
    }

    export function addArt(art : PicaCanvasArt) {
        var room = Server.Chat.getRoom();
        var picaMemory : MemoryPica = <MemoryPica> Server.Chat.Memory.getConfiguration("Pica");
        if (room != null && picaMemory.isPicaAllowed()) {
            var roomid = room.id;
            var url = UI.Pica.Board.getUrl();

            includeArt(roomid, url, art);
            var stringified = JSON.stringify(art.exportAsObject());
            var msg = new MessagePica();
            msg.setArtString(stringified);
            msg.setUrl(url);
            msg.setConfirmation(getLengthByUser(roomid, url));
            UI.Chat.sendMessage(msg);
        } else {
            UI.Pica.Board.Canvas.redraw();
        }
    }

    export function getMyArtsAsString (roomid : number, url : string) {
        var art = getArt(roomid, url);
        var artStrings = [];
        for (var i = 0; i < art.length; i++) {
            if (art[i].getUserId() == Application.getMyId()) {
                artStrings.push(JSON.stringify(art[i].exportAsObject()));
            }
        }
        return artStrings;
    }

    export function getArt (roomid : number, url : string) : Array<PicaCanvasArt> {
        var oldArt = Application.LocalMemory.getMemory(createIdString(roomid, url), []);
        var instanced = [];
        for (var i = 0; i < oldArt.length; i++) {
            try {
                var newArt = new PicaCanvasArt();
                newArt.importFromString(oldArt[i]);
                instanced.push(newArt)
            } catch (e) {
                console.warn("[UI.Pica.ArtManager] Unparsable Art at " + createIdString(roomid, url) + ". Skipping.");
            }
        }
        return instanced;
    }

    export function removeAllArts (roomid : number, url: string) {
        Application.LocalMemory.unsetMemory(createIdString(roomid, url));
        if (UI.Pica.Board.getUrl() == url) {
            UI.Pica.Board.Canvas.redraw();
        }
    }

    export function removeArtFromUser (userid : number, roomid : number, url : string) {
        var oldArt = getArt(roomid, url);
        var newArt = [];
        for (var i = 0; i < oldArt.length; i++) {
            if (oldArt[i].getUserId() != userid) {
                newArt.push(JSON.stringify(oldArt[i].exportAsObject()));
            }
        }
        Application.LocalMemory.setMemory(createIdString(roomid, url), newArt);
        if (UI.Pica.Board.getUrl() == url) {
            UI.Pica.Board.Canvas.redraw();
        }
    }

    export function includeManyArts (roomid : number, url: string, arts : Array<PicaCanvasArt>) {
        var oldArt = Application.LocalMemory.getMemory(createIdString(roomid, url), []);

        for (var i = 0; i < arts.length; i++) {
            var art = arts[i];
            var stringified = JSON.stringify(art.exportAsObject());
            if (oldArt.indexOf(stringified) == -1) {
                oldArt.push(stringified);
            }
        }

        Application.LocalMemory.setMemory(createIdString(roomid, url), oldArt);

        var currentUrl = UI.Pica.Board.getUrl();
        if (currentUrl == url) {
            UI.Pica.Board.Canvas.redraw();
        }
    }


    export function includeArt (roomid : number, url : string, art : PicaCanvasArt) {
        var oldArt = Application.LocalMemory.getMemory(createIdString(roomid, url), []);
        var stringified = JSON.stringify(art.exportAsObject());
        if (oldArt.indexOf(stringified) == -1) {
            oldArt.push(stringified);
            Application.LocalMemory.setMemory(createIdString(roomid, url), oldArt);

            var currentUrl = UI.Pica.Board.getUrl();
            if (currentUrl == url) {
                UI.Pica.Board.Canvas.redraw();
            }
        }
    }

    function createIdString (roomid : number, url : string) {
        return "art_" + roomid + "_" + url;
    }
}