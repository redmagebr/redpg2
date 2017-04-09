module DB.ImageDB {
    var images : Array<ImageLink> = [];
    var changeTrigger : Trigger = new Trigger();
    var delayedStore : Number = null;
    var delayedStoreTimeout = 3000;

    export function removeImage (img : ImageLink) {
        var idx = images.indexOf(img);
        if (idx === -1) {
            console.warn("[ImageDB] Attempt to remove unregistered image. Ignoring. Offender: ", img);
            return;
        }
        images.splice(idx, 1);

        considerSaving();
    }

    export function considerSaving () {
        if (delayedStore !== null) {
            clearTimeout(<number> delayedStore);
        }
        delayedStore = setTimeout(function () { Server.Storage.sendImages(); }, delayedStoreTimeout);
    }

    export function getImages () {
        return images;
    }

    export function getImageByName (name : string) {
        name = name.toLowerCase();
        for (var i = 0; i < images.length; i++) {
            if (images[i].getName().toLowerCase() === name) {
                return images[i];
            }
        }
        return null;
    }

    export function getImageByLink (url : string) {
        for (var i = 0; i < images.length; i++) {
            if (images[i].getLink() === url) {
                return images[i];
            }
        }
        return null;
    }

    export function hasImageByName (name : string) {
        return (getImageByName(name) !== null);
    }

    export function hasImageByLink (url : string) {
        return (getImageByLink(url) !== null);
    }
    
    export function getImagesByFolder () : Array<Array<ImageLink>> {
        var folders : {[id : string] : Array<ImageLink>} = {};
        var result : Array<Array<ImageLink>> = [];
        for (var i = 0; i < images.length; i++) {
            if (folders[images[i].getFolder()] === undefined) {
                folders[images[i].getFolder()] = [images[i]];
                result.push(folders[images[i].getFolder()]);
            } else {
                folders[images[i].getFolder()].push(images[i]);
            }
        }

        result.sort(function (a : Array<ImageLink>,b : Array<ImageLink>) {
            if (a[0].getFolder() < b[0].getFolder()) return -1;
            if (a[0].getFolder() > b[0].getFolder()) return 1;
            return 0;
        });

        for (var i = 0; i < result.length; i++) {
            result[i].sort(function (a : ImageLink, b : ImageLink) {
                if (a.getName() < b.getName()) return -1;
                if (a.getName() > b.getName()) return 1;
                return 0;
            });
        }

        return result;
    }

    export function exportAsObject () {
        var arr = [];
        for (var i = 0; i < images.length; i++) {
            arr.push(images[i].exportAsObject());
        }
        return arr;
    }

    export function updateFromObject (obj : Array<Object>) {
        images = [];
        var line;
        for (var i = 0; i < obj.length; i++) {
            line = obj[i];
            var newImage = new ImageLink(line['name'], line['url'], line['folder']);
            newImage.updateFromObject(line);
            images.push(newImage);
        }
        images.sort(function (a : ImageLink, b : ImageLink) {
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

        changeTrigger.trigger(images);
    }

    export function addImage (img : ImageLink) {
        images.push(img);
        considerSaving();
    }

    export function addImages (imgs : Array<ImageLink>) {
        for (var i = 0; i < imgs.length; i++) {
            images.push(imgs[i]);
        }
        changeTrigger.trigger(images);
        Server.Storage.sendImages();
    }

    export function triggerChange (image : ImageLink) {
        if (image === null) {
            changeTrigger.trigger(images);
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