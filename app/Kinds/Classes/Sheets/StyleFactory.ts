module StyleFactory {
    var styles : {[id : number] : SheetStyle} = {};

    export function getCreator (style : StyleInstance) : typeof SheetStyle {
        var _startTime = (new Date()).getTime();
        var creator : typeof SheetStyle = SheetStyle;

        try {
            eval(style.mainCode);
        } catch (e) {
            console.error("[SheetStyle] Error in style code.");
            console.warn(e);
            creator = SheetStyle;
        }

        class SheetStyleAdapted extends creator {
            public getCreator (kind : string, type : string, def : string) {
                var name = kind + this.stringToType(type);
                if (eval ("typeof " + name) === "function") {
                    return eval(name);
                }
                return eval(kind + def);
            }
        }

        var _endTime = (new Date()).getTime();
        console.debug("[StyleFactory] " + style.name + "'s Creator took " + (_endTime - _startTime) + "ms to process.");
        return SheetStyleAdapted;
    }

    export function getSheetStyle (style : StyleInstance, reload? : boolean) {
        if (styles[style.id] !== undefined) {
            if (reload !== true) {
                return styles[style.id];
            } else {
                styles[style.id].die();
            }
        }

        styles[style.id] = new (getCreator(style))(style);

        return styles[style.id];
    }
}