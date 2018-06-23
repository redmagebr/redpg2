class PicaToolSqua extends PicaToolPen {
    private art = null;
    private lastPoint = null;
    public id = "squa";

    constructor () {
        super();
        this.setIcon("icons-picaToolSqua");
        this.setTitleLingo("_PICASQUA_");
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

        var centerX = p1.getX();
        var centerY = p1.getY();
        var distX = Math.abs(p1.getX() - p2.getX());
        var distY = Math.abs(p1.getY() - p2.getY());
        var dist = distX > distY ? distX : distY;

        var ctx = UI.Pica.Board.Canvas.getCanvasContext();
        ctx.lineWidth = art.getSpecial("width", 1);
        ctx.strokeStyle = '#' + art.getSpecial("color", "000000");
        ctx.beginPath();

        var s1 = [p1.getX() - dist, p1.getY() - dist];
        var s2 = [p1.getX() + dist, p1.getY() - dist];
        var s3 = [p1.getX() + dist, p1.getY() + dist];
        var s4 = [p1.getX() - dist, p1.getY() + dist];
        var square = [s1,s2,s3,s4];

        for (var i = 0; i < square.length; i++) {
            if (i == 0) {
                ctx.moveTo(square[i][0], square[i][1]);
            } else {
                ctx.lineTo(square[i][0], square[i][1]);
            }
        }
        ctx.lineTo(square[0][0], square[0][1]);

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

(function () {
    var pensil = new PicaToolSqua();
    UI.Pica.Toolbar.registerTool(pensil);
    PicaToolPen.registerPen("squa", pensil);
})();