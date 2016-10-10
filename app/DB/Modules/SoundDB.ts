module DB.SoundDB {
    var sounds : Array<SoundLink> = [];
    var changeTrigger : Trigger = new Trigger();
    var delayedStore : Number = null;
    var delayedStoreTimeout = 3000;

    export function removeSound (snd : SoundLink) {
        var idx = sounds.indexOf(snd);
        if (idx === -1) {
            console.warn("[SoundDB] Attempt to remove unregistered sound. Ignoring. Offender: ", snd);
            return;
        }
        sounds.splice(idx, 1);

        considerSaving();
    }

    export function considerSaving () {
        if (delayedStore !== null) {
            clearTimeout(<number> delayedStore);
        }
        delayedStore = setTimeout(function () { Server.Storage.sendSounds(); }, delayedStoreTimeout);
    }

    export function getSounds () {
        return sounds;
    }

    export function getSoundByName (name : string) {
        name = name.toLowerCase();
        for (var i = 0; i < sounds.length; i++) {
            if (sounds[i].getName().toLowerCase() === name) {
                return sounds[i];
            }
        }
        return null;
    }

    export function getSoundByLink (url : string) {
        for (var i = 0; i < sounds.length; i++) {
            if (sounds[i].getLink() === url) {
                return sounds[i];
            }
        }
        return null;
    }

    export function hasSoundByName (name : string) {
        return (getSoundByName(name) !== null);
    }

    export function hasSoundByLink (url : string) {
        return (getSoundByLink(url) !== null);
    }

    export function getSoundsByFolder () : Array<Array<SoundLink>> {
        var folders : {[id : string] : Array<SoundLink>} = {};
        var result : Array<Array<SoundLink>> = [];
        for (var i = 0; i < sounds.length; i++) {
            if (folders[sounds[i].getFolder()] === undefined) {
                folders[sounds[i].getFolder()] = [sounds[i]];
                result.push(folders[sounds[i].getFolder()]);
            } else {
                folders[sounds[i].getFolder()].push(sounds[i]);
            }
        }

        result.sort(function (a : Array<SoundLink>,b : Array<SoundLink>) {
            if (a[0].getFolder() < b[0].getFolder()) return -1;
            if (a[0].getFolder() > b[0].getFolder()) return 1;
            return 0;
        });

        for (var i = 0; i < result.length; i++) {
            result[i].sort(function (a : SoundLink, b : SoundLink) {
                if (a.getName() < b.getName()) return -1;
                if (a.getName() > b.getName()) return 1;
                return 0;
            });
        }

        return result;
    }

    export function exportAsObject () {
        var arr = [];
        for (var i = 0; i < sounds.length; i++) {
            arr.push(sounds[i].exportAsObject());
        }
        return arr;
    }

    export function updateFromObject (obj : Array<Object>) {
        sounds = [];
        var line;
        console.log(obj);
        if (obj.length > 0 && typeof obj[0]["url"] === "undefined") {
            console.log("Old version");
            var rest = [];
            for (var i = 0; i < obj.length; i++) {
                var folder = obj[i];
                var folderName = folder['name'];
                for (var k = 0; k < folder['sounds'].length; k++) {
                    var row = folder['sounds'][k];
                    rest.push({
                        bgm : row['bgm'],
                        name : row['name'],
                        url : row['link'],
                        folder : folderName
                    });
                }
            }
            obj = rest;
        }
        for (var i = 0; i < obj.length; i++) {
            line = obj[i];
            sounds.push(new SoundLink(line['name'], line['url'], line['folder'], line['bgm']));
        }
        sounds.sort(function (a : SoundLink, b : SoundLink) {
            if (a.getFolder() < b.getFolder()) return -1;
            if (a.getFolder() > b.getFolder()) return 1;

            var na = a.getName().toLowerCase();
            var nb = b.getName().toLowerCase();
            if (na < nb) return -1;
            if (na > nb) return 1;

            if (a.getLink() < b.getLink()) return -1;
            if (a.getLink() > b.getLink()) return 1;
            return 0;
        });

        changeTrigger.trigger(sounds);
    }

    export function addSound (snd : SoundLink) {
        sounds.push(snd);
        considerSaving();
    }

    export function addSounds (snds : Array<SoundLink>) {
        for (var i = 0; i < snds.length; i++) {
            sounds.push(snds[i]);
        }
        changeTrigger.trigger(sounds);
        Server.Storage.sendImages();
    }

    export function triggerChange (image : SoundLink) {
        if (image === null) {
            changeTrigger.trigger(sounds);
        } else {
            changeTrigger.trigger(image);
        }
    }

    export function addChangeListener (f : Listener | Function) {
        changeTrigger.addListener(f);
    }

    export function removeChangeListener (f : Listener | Function) {
        changeTrigger.removeListener(f);
    }
}