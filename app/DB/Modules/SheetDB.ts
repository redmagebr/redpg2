module DB.SheetDB {
    export var sheets : {[id : number] : SheetInstance} = {};
    var changeTrigger = new Trigger();

    export function addChangeListener (list : Listener | Function) {
        changeTrigger.addListener(list);
    }

    export function removeChangeListener (list : Listener | Function) {
        changeTrigger.removeListener(list);
    }

    export function triggerChanged (sheet : SheetInstance) {
        changeTrigger.trigger(sheet);
    }

    export function hasSheet (id : number) {
        return sheets[id] !== undefined;
    }

    export function getSheet (id : number) : SheetInstance {
        if (hasSheet(id)) {
            return sheets[id];
        }
        return null;
    }

    export function releaseSheet (id : number) {
        if (hasSheet(id)) {
            delete (sheets[id]);
        }
    }

    export function updateFromObject (obj : Array<Object>) {
        for (var i = 0; i < obj.length; i++) {
            if (sheets[obj[i]['id']] === undefined) {
                sheets[obj[i]['id']] = new SheetInstance();
            }
            sheets[obj[i]['id']].updateFromObject(obj[i]);
        }
        triggerChanged(null);
    }
}