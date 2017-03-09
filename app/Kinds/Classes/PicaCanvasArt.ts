class PicaCanvasArt {
    private pen : typeof PicaCanvasPen;
    private specialValues : Object; // specialValues is a JSON string generated and read by the Pen
    private points : Array<PicaCanvasPoint> = [];

    public setPen (pen : typeof PicaCanvasPen) {
        this.pen = pen;
    }

    public setValues (values : Object) {
        this.specialValues = values;
    }

    public setPoints (points : Array<PicaCanvasPoint>) {
        this.points = points;
    }

    public addPoint (point : PicaCanvasPoint) {
        this.points.push(point);
    }

    public cleanUpPoints () {
        cleanedPoints = [];
        if (this.points.length > 0) {
            cleanedPoints.push(this.points[0]);
            var lastAdded = this.points[0];
            for (var i = 0; i < this.points.length; i++) {
                var p1 = this.points[i];
                if ((i+1) == this.points.length) {
                    cleanedPoints.push(p1);
                } else {
                    var found = false;
                    // Remove repeated points
                    for (var k = this.points.length - 1; k >= 0; k--) {
                        var p2 = this.points[k];
                        if (PicaCanvasPoint.isEqual(p1, p2)) {
                            found = true;
                            break;
                        }
                    }
                    if (!found && PicaCanvasPoint.isTriangle(lastAdded, p1, this.points[i + 1])) {
                        lastAdded = p1;
                        cleanedPoints.push(p1);
                    }
                }
            }
        }
        this.points = cleanedPoints;
    }

    public update (pen : typeof PicaCanvasPen, values : Object, points : Array<PicaCanvasPoint>) {
        this.pen = pen;
        this.specialValues = values;
        this.points = points;
    }
}