class PicaCanvasPen {
    private static Pens = {};

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

    public redraw (art : PicaCanvasArt) : void {}

    public static registerPen (id : string, pen : PicaCanvasPen) {
        PicaCanvasPen.Pens[id] = pen;
    }

    public static getPen (id : string) {
        if (PicaCanvasPen.Pens[id] != undefined) {
            return PicaCanvasPen.Pens[id];
        }
        console.error("[PicaCanvasPen] No pen for " + id + ".");
    }
}