class PicaCanvasPoint {
    private x : number = 0;
    private y : number = 0;
    private canvas : PicaCanvas;
    private static minCurve = 10; // The minimum angle between points before they're kept in the final encoded art
    private static encoding = "0123456789abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXWYZ-+_=![]{}()*@/\\:;";
    private static precision = Math.pow(PicaCanvasPoint.encoding.length, 2);
    private static maxEncodedChars = 2;

    constructor (canvas : PicaCanvas) {
        this.canvas = canvas;
    }

    public setCoordinates (offsetX, offsetY) {
        var width = this.canvas.getWidth();
        var height = this.canvas.getHeight();
        this.x = parseInt((offsetX * PicaCanvasPoint.precision) / width);
        this.y = parseInt((offsetY * PicaCanvasPoint.precision) / height);
    }

    public setRelativeCoordinates (x, y) {
        this.x = x;
        this.y = y;
    }

    public getX () {
        var x = this.x * this.canvas.getWidth() / PicaCanvasPoint.precision;
        return x;
    }

    public getY () {
        var y = this.y * this.canvas.getHeight() / PicaCanvasPoint.precision;
        return y;
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

    /**
     * Encodes number "num" as a 2-character string.
     * Encodes from 0 to PicaCanvasPoint.encoding.length^PicaCanvasPoint.maxEncodedChars, so about 0 to 6000.
     * @param num
     * @returns {string}
     */
    public static encode (num : number) : string {
        var maxChars = PicaCanvasPoint.maxEncodedChars;
        if (num > Math.pow(PicaCanvasPoint.encoding.length, maxChars)) { return NaN; }
        if (num < 0) return NaN;

        if (num < PicaCanvasPoint.length) {
            return PicaCanvasPoint.encoding[0] + PicaCanvasPoint.encoding.charAt(num);
        } else {
            var a = parseInt(num / PicaCanvasPoint.encoding.length);
            var b = num - (a * PicaCanvasPoint.encoding.length);
            return PicaCanvasPoint.encoding.charAt(a) + PicaCanvasPoint.encoding.charAt(b);
        }
    }

    /**
     * Decodes a 4-character encoded string "str" as a new PicaCanvasPoint
     * @param str
     */
    public static decode (str : String, canvas : PicaCanvas) {
        // str.substr(0,2)
        // str.substr(2,2)
    }
}