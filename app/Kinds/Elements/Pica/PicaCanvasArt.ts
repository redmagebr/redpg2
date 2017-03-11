class PicaCanvasArt {
    private pen : PicaCanvasPen;
    private specialValues : Object = {}; // specialValues is a JSON string generated and read by the Pen
    public points : Array<PicaCanvasPoint> = [];

    public setSpecial (index : string, value : any) {
        this.specialValues[index] = value;
    }

    public getSpecial (index : string, defValue : any) {
        if (this.specialValues[index] != undefined) {
            return this.specialValues[index];
        }
        return defValue;
    }

    public exportAsObject () {
        var points = "";
        for (var i = 0; i < this.points.length; i++) {
            points += this.points[i].exportAsString();
        }
        return [
            this.pen.id,
            this.specialValues,
            points
        ];
    }

    public setPen (pen : PicaCanvasPen) {
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
        var oldLength = this.points.length;
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
                        if (k == i) continue;
                        var p2 = this.points[k];
                        if (PicaCanvasPoint.isEqual(p1, p2)) {
                            found = true;
                            break;
                        }
                    }
                    if (!found && PicaCanvasPoint.isTriangle(p1, lastAdded, this.points[i + 1])) {
                        lastAdded = p1;
                        cleanedPoints.push(p1);
                    }
                }
            }
        }
        this.points = cleanedPoints;
        console.debug(oldLength + " -> " + this.points.length + " = " + Math.round(this.points.length * 100 / oldLength) + "%");
    }

    public redraw () {
        this.pen.redraw(this);
    }

    public update (pen : typeof PicaCanvasPen, values : Object, points : Array<PicaCanvasPoint>) {
        this.pen = pen;
        this.specialValues = values;
        this.points = points;
    }
}