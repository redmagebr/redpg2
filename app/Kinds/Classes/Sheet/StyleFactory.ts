module StyleFactory {
    export function getCreator () {
        var creator : typeof SheetStyle = SheetStyle;

        var a = "var DFS;(function (DFS) {    function sayHi() {        console.log('Hi');    }    DFS.sayHi = sayHi;})(DFS || (DFS = {}));var SomethingElse = (function () {    function SomethingElse() {        this.gluglu = 10;    }    return SomethingElse;})();var NewSheetStyle = (function (_super) {    __extends(NewSheetStyle, _super);    function NewSheetStyle() {        _super.call(this);        this.something = 0;        this.something = 1;    }    NewSheetStyle.prototype.createGl = function () {        return new SomethingElse();    };    NewSheetStyle.prototype.sayHi = function () {        DFS.sayHi();    };    return NewSheetStyle;})(SheetStyle);creator = NewSheetStyle;";

        try {
            eval(a);
        } catch (e) {
            console.error("[SheetStyle] Error in style code.");
            console.log(e);
            creator = SheetStyle;
        }

        if (creator === SheetStyle) {
            console.warn("[SheetStyle] No changes made to SheetStyle, utilizing common style.");
        }

        return creator;
    }
}