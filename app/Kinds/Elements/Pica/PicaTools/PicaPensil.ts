class PicaPensil extends PicaCanvasPen {
    public id = "Pensil";
    private currentArt : PicaCanvasArt = null;
    private lastPoint : PicaCanvasPoint;

    constructor () {
        super();
        PicaCanvasPen.registerPen(this.id, this);
    }


    public mouseDown (point : PicaCanvasPoint) {
        this.currentArt = new PicaCanvasArt();
        this.currentArt.setPen(this);
        this.currentArt.addPoint(point);
        this.beginDrawing(point);
    }

    public mouseUp (point : PicaCanvasPoint) {
        if (this.currentArt != null) {
            this.currentArt.addPoint(point);
            this.finishDrawing();
        }
    }

    public mouseMove (point : PicaCanvasPoint) {
        if (this.currentArt != null) {
            this.currentArt.addPoint(point);
            this.drawTo(point);
            this.stroke();
        }
    }

    public mouseOut () {
        if (this.currentArt != null) {
            this.finishDrawing();
        }
    }

    public mouseWheel (up : boolean, point : PicaCanvasPoint) {}

    public selected () : void {}

    public beginDrawing (point : PicaCanvasPoint) {
        var canvas = UI.Pica.getPica().getBoard().getCanvas();
        var ctx = canvas.getCanvasContext();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = canvas.getPensSize();
        ctx.strokeStyle = '#' + canvas.getPensColor();
        ctx.beginPath();
        ctx.moveTo(point.getX(), point.getY());
        this.lastPoint = point;
    }

    public drawTo (point : PicaCanvasPoint) {
        var canvas = UI.Pica.getPica().getBoard().getCanvas();
        var ctx = canvas.getCanvasContext();

        var x = (point.getX() + this.lastPoint.getX()) / 2;
        var y = (point.getY() + this.lastPoint.getY()) / 2;

        ctx.lineTo(point.getX(), point.getY());
        //ctx.quadraticCurveTo(point.getX(), point.getY(), x, y);
        ctx.moveTo(point.getX(), point.getY());

        this.lastPoint = point;
    }

    public finishDrawing () {
        this.currentArt.cleanUpPoints();
        var canvas = UI.Pica.getPica().getBoard().getCanvas();
        canvas.addArt(this.currentArt);
        this.currentArt = null;
    }

    public stroke () {
        var canvas = UI.Pica.getPica().getBoard().getCanvas();
        var ctx = canvas.getCanvasContext();
        ctx.stroke();
    }

    public redraw (art? : PicaCanvasArt) : void {
        if (art != undefined) {
            if (art.points.length >0) {
                this.beginDrawing(art.points[0]);
                for (var i = 1; i < art.points.length; i++) {
                    this.drawTo(art.points[i]);
                }
            }
            this.stroke();
        } else {
            if (this.PicaCanvasArt != null && this.currentArt.points.length > 0) {
                this.beginDrawing(this.currentArt.points[0]);
                for (var i = 1; i < this.currentArt.points.length; i++) {
                    this.drawTo(this.currentArt.points[i]);
                }
            }
        }
    }
}