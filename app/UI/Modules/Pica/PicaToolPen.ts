class PicaToolPen extends PicaTool {
    private static Pens = {};
    public id = "undefined";

    public mouseDown (point : PicaCanvasPoint) {
        console.log(point.getX() + " - " + point.getY());
    }

    public mouseUp (point : PicaCanvasPoint) {

    }

    public mouseMove (point : PicaCanvasPoint) {

    }

    public mouseOut () {

    }

    public mouseWheel (up : boolean, point : PicaCanvasPoint) {

    }

    public selected () : void {}

    public redraw () : void {}

    public drawFromArt (art : PicaCanvasArt) : void {}

    public static registerPen (id : string, pen : PicaToolPen) {
        PicaToolPen.Pens[id] = pen;
    }

    public static getPen (id : string) {
        if (PicaToolPen.Pens[id] != undefined) {
            return PicaToolPen.Pens[id];
        }
        console.error("[PicaToolPen] No pen for " + id + ".");
    }

    public setSelected (selected: boolean) {
        this.selected = selected;
        this.updateIcon();
        this.updateCanvasClasses();
    }

    public updateCanvasClasses () {

    }

    public onClick () {
        UI.Pica.Board.Canvas.setPen(this);
    }

    public static registerPen (id : string, pen : PicaToolPen) {
        PicaToolPen.Pens[id] = pen;
    }

    public static getPen (id : string) {
        return PicaToolPen.Pens[id];
    }
}