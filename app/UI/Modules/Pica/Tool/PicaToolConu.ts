class PicaToolConu extends PicaToolPen {
    private art = null;
    private lastPoint = null;
    public id = "conu";

    constructor () {
        super();
        this.setIcon("icons-picaToolConu");
        this.setTitleLingo("_PICACONU_");
    }

    public mouseDown (point : PicaCanvasPoint) {
        this.art = new PicaCanvasArt();
        this.art.setUserId(Application.getMyId());
        this.art.addPoint(point);
        this.art.setSpecial("width", UI.Pica.Board.Canvas.getPenWidth());
        this.art.setSpecial("color", UI.Pica.Board.Canvas.getPenColor());
        this.art.setPen(this);
        this.lastPoint = point;
    }

    public mouseMove (point : PicaCanvasPoint) {
        if (this.art != null) {
            this.lastPoint = point;
            this.draw(this.art);
            UI.Pica.Board.Canvas.redraw();
        }
    }

    public mouseUp (point : PicaCanvasPoint) {
        this.lastPoint = point;
        this.mouseOut();
    }

    public mouseOut () {
        if (this.art != null) {
            this.art.addPoint(this.lastPoint);
            var art = this.art;
            this.art = null;
            this.lastPoint = null;
            UI.Pica.ArtManager.addArt(art);
        }
    }

    public draw (art : PicaCanvasArt) {
        var p1 = art.points[0];
        var p2 = art.points.length > 1 ? art.points[1] : this.lastPoint != null ? this.lastPoint : p1;

        var ctx = UI.Pica.Board.Canvas.getCanvasContext();
        ctx.lineWidth = art.getSpecial("width", 1);
        ctx.strokeStyle = '#' + art.getSpecial("color", "000000");
        ctx.beginPath();

        // Draw triangle
        var triangleHeight = p1.getRealDistanceTo(p2);
        var sideLength = (triangleHeight * 2) / Math.sqrt(3);
        var angle = Math.atan2(p1.getY() - p2.getY(), p1.getX() - p2.getX());

        ctx.moveTo(p1.getX(), p1.getY());
        ctx.lineTo(p1.getX() - sideLength * Math.cos(angle-Math.PI/6), p1.getY() - sideLength * Math.sin(angle-Math.PI/6));
        ctx.lineTo(p1.getX() - sideLength * Math.cos(angle+Math.PI/6), p1.getY() - sideLength * Math.sin(angle+Math.PI/6));
        ctx.lineTo(p1.getX(), p1.getY());

        ctx.stroke();
    }

    public redraw () {
        if (this.art != null) {
            this.draw(this.art);
        }
    }

    public drawFromArt (art : PicaCanvasArt) {
        this.draw(art);
    }

    public updateCanvasClasses () {
        if (this.selected) {
            UI.Pica.Board.Canvas.getCanvas().classList.add("draw");
        } else {
            UI.Pica.Board.Canvas.getCanvas().classList.remove("draw");
        }
    }
}

var pensil = new PicaToolConu();
UI.Pica.Toolbar.registerTool(pensil);
PicaToolPen.registerPen("conu", pensil);
delete(pensil);