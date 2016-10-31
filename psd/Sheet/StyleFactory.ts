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

        if (creator === SheetStyle) {
            console.warn("[SheetStyle] No changes made to SheetStyle, utilizing common style.");
        }

        var _endTime = (new Date()).getTime();
        console.debug("[StyleFactory] " + style.name + "'s Creator took " + (_endTime - _startTime) + "ms to process.");
        return creator;
    }

    export function getSheetStyle (style : StyleInstance, reload? : boolean) {
        if (styles[style.id] !== undefined) {
            if (reload !== true) {
                return styles[style.id];
            } else {
                styles[style.id].die();
            }
        }

        styles[style.id] = new (getCreator(style))();
        styles[style.id].addStyle(style);

        return styles[style.id];
    }
}