class PicaCanvasArt {
    private userId : number = 0;
    private pen : PicaToolPen;
    private specialValues : Object = {}; // specialValues is a JSON string generated and read by the Pen
    public points : Array<PicaCanvasPoint> = [];

    public draw () {
        this.pen.drawFromArt(this);
    }

    public setUserId (id : number) {
        this.userId = id;
    }

    public getUserId () {
        return this.userId;
    }

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
            this.userId,
            this.pen.id,
            this.specialValues,
            points
        ];
    }

    /**
     * Can throw errors
     * @param str
     * @returns {boolean}
     */
    public importFromString (str : string) {
        let obj = JSON.parse(str);
        this.setUserId(obj[0]);
        this.setPen(PicaToolPen.getPen(obj[1]));
        this.specialValues = obj[2];
        //this.setPoints(obj[3]);
        this.importPointStrings(obj[3].match(/.{4}/g));
    }

    public importPointStrings (a : Array<string>) {
        for(var i = 0; i < a.length; i++) {
            var point = new PicaCanvasPoint();
            point.updateFromString(a[i]);
            this.addPoint(point);
        }
    }

    public setPen (pen : PicaToolPen) {
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
        let cleanedPoints = [];
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
        this.pen.drawFromArt(this);
    }
}