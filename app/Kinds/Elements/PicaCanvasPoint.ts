class PicaCanvasPoint {
    private x : number = 0;
    private y : number = 0;
    private canvas : PicaCanvas;
    private static minCurve = 10; // The minimum angle between points before they're kept in the final encoded art
    private static encoding = "0123456789abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXWYZ-+_=![]{}()*@/\\:;";
    private static precision = Math.pow(PicaCanvasPoint.encoding.length, 2);

    constructor (offsetX, offsetY, canvas) {
        this.x = parseInt((offsetX * PicaCanvasPoint.precision) / width);
        this.y = parseInt((offsetY * PicaCanvasPoint.precision) / height);
    }

    public distanceTo (p2 : PicaCanvasPoint) {
        var x1 = this.x;
        var x2 = p2.x;
        var y1 = this.y;
        var y2 = p2.y;
        return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
    }

    public static isTriangle (p1 : PicaCanvasPoint, p2 : PicaCanvasPoint, p3 : PicaCanvasPoint) {
        var dab = p1.distanceTo(p2);
        var dbc = p2.distanceTo(p3);
        var dac = p1.distanceTo(p3);
        var triangle = !((dab + dbc) <= dac);
        if (!triangle) return false;

        if (((dab + dbc) - dac) < PicaCanvasPoint.maxCurve) {
            return false;
        }

        var angle = Math.acos(((dab * dab) + (dac*dac) - (dbc * dbc)) / (2 * dac * dab));
        angle = angle * 180 / Math.PI;

        if (angle > (180 - PicaCanvasPoint.minCurve)) {
            return false; // "Not a triangle" by our own definition
        }

        return true;
    }

    public static isEqual (p1 : PicaCanvasPoint, p2 : PicaCanvasPoint) {
        return p1.x == p2.x && p1.y == p2.y;
    }
}