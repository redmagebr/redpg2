module DB.StyleDB {
    var styles : {[id : number] : StyleInstance} = {};
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

    export function hasStyle (id : number) {
        return styles[id] !== undefined;
    }

    export function getStyle (id : number) : StyleInstance {
        if (hasStyle(id)) {
            return styles[id];
        }
        return null;
    }

    export function getStyles () : Array<StyleInstance> {
        var orderedStyles = [];

        for (var id in styles) {
            orderedStyles.push(styles[id]);
        }

        orderedStyles.sort(function (a : StyleInstance, b : StyleInstance) {
            var na = a.name.toLowerCase();
            var nb = b.name.toLowerCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
        });

        return orderedStyles;
    }

    export function releaseStyle (id : number) {
        if (hasStyle(id)) {
            delete (styles[id]);
        }
    }

    export function updateStyle (obj) {
        if (!hasStyle(obj['id'])) {
            styles[obj['id']] = new StyleInstance();
        }
        getStyle(obj['id']).updateFromObject(obj);
    }
}