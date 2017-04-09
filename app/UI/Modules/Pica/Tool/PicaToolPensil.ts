class PicaToolPensil extends PicaToolPen {
    private art = null;
    private lastPoint = null;
    public id = "pensil";

    constructor () {
        super();
        this.setIcon("icons-picaToolPensil");
        this.setTitleLingo("_PICAPENSIL_");
    }

    public mouseDown (point : PicaCanvasPoint) {
        this.art = new PicaCanvasArt();
        this.art.setUserId(Application.getMyId());
        this.art.addPoint(point);
        this.art.setSpecial("width", UI.Pica.Board.Canvas.getPenWidth());
        this.art.setSpecial("color", UI.Pica.Board.Canvas.getPenColor());
        this.art.setPen(this);
        this.beginDrawing(this.art);
    }

    public mouseMove (point : PicaCanvasPoint) {
        if (this.art != null) {
            this.art.addPoint(point);
            this.drawTo(point);
            this.stroke();
        }
    }

    public mouseUp (point : PicaCanvasPoint) {
        if (this.art != null) {
            this.art.addPoint(point);
            this.mouseOut();
        }
    }

    public mouseOut () {
        if (this.art != null) {
            var art = this.art;
            this.art = null;
            art.cleanUpPoints();
            UI.Pica.ArtManager.addArt(art);
        }
    }

    public beginDrawing (art : PicaCanvasArt) {
        var ctx = UI.Pica.Board.Canvas.getCanvasContext();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = art.getSpecial("width", 1);
        ctx.strokeStyle = '#' + art.getSpecial("color", "000000");
        ctx.beginPath();
        var point = art.points[0];
        ctx.moveTo(point.getX(), point.getY());
        this.lastPoint = point;
    }

    public drawTo (point : PicaCanvasPoint) {
        var ctx = UI.Pica.Board.Canvas.getCanvasContext();

        var x = (point.getX() + this.lastPoint.getX()) / 2;
        var y = (point.getY() + this.lastPoint.getY()) / 2;

        ctx.lineTo(point.getX(), point.getY());
        ctx.moveTo(point.getX(), point.getY());

        this.lastPoint = point;
    }

    public stroke () {
        var ctx = UI.Pica.Board.Canvas.getCanvasContext();
        ctx.stroke();
    }

    public redraw () {
        if (this.art != null) {
            this.beginDrawing(this.art);
            for (var i = 1; i < this.art.points.length; i++) {
                this.drawTo(this.art.points[i]);
                this.stroke();
            }
        }
    }

    public drawFromArt (art : PicaCanvasArt) {
        this.beginDrawing(art);
        for (var i = 1; i < art.points.length; i++) {
            this.drawTo(art.points[i]);
        }
        this.stroke();
    }

    public updateCanvasClasses () {
        if (this.selected) {
            UI.Pica.Board.Canvas.getCanvas().classList.add("draw");
        } else {
            UI.Pica.Board.Canvas.getCanvas().classList.remove("draw");
        }
    }
}

var pensil = new PicaToolPensil();
UI.Pica.Toolbar.registerTool(pensil);
PicaToolPen.registerPen("pensil", pensil);
delete(pensil);