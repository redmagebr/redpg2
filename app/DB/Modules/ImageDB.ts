module DB.ImageDB {
    var images : Array<ImageLink> = [];
    var changeTrigger : Trigger = new Trigger();

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
    
    export function getImagesByFolder () {
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
        return result;
    }

    export function updateFromObject (obj : Array<Object>) {
        images = [];
        var line;
        for (var i = 0; i < obj.length; i++) {
            line = obj[i];
            images.push(new ImageLink(line['name'], line['url'], line['folder']));
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
        changeTrigger.trigger(images);
    }

    export function addImages (imgs : Array<ImageLink>) {
        for (var i = 0; i < imgs.length; i++) {
            images.push(imgs[i]);
        }
        changeTrigger.trigger(images);
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