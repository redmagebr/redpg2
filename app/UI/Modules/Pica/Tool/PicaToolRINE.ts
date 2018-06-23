class PicaToolRINE extends PicaToolPen {
    private art = null;
    private lastPoint = null;
    public id = "rine";

    constructor () {
        super();
        this.setIcon("icons-picaToolRine");
        this.setTitleLingo("_PICARINE_");
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
        ctx.moveTo(p1.getX(), p1.getY());
        ctx.lineTo(p2.getX(), p2.getY());
        ctx.stroke();

        ctx.beginPath();
        var angle = Math.atan2(p2.getY() - p1.getY(), p2.getX() - p1.getX());
        ctx.moveTo(p2.getX(), p2.getY());
        var headlen = 10; // length of head in pixels
        ctx.lineTo(
            p2.getX() - headlen * Math.cos(angle-Math.PI/7),
            p2.getY() - headlen * Math.sin(angle-Math.PI/7)
        );

        //path from the side point of the arrow, to the other side point
        ctx.lineTo(
            p2.getX() - headlen * Math.cos(angle+Math.PI/7),
            p2.getY() - headlen * Math.sin(angle+Math.PI/7)
        );

        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        ctx.lineTo(
            p2.getX(),
            p2.getY()
        );

        // the fuck is this?
        ctx.lineTo(
            p2.getX() - headlen * Math.cos(angle-Math.PI/7),
            p2.getY() - headlen * Math.sin(angle-Math.PI/7)
        );

        // Draws arrows and fills them
        ctx.lineWidth =  art.getSpecial("width", 1);
        ctx.strokeStyle = '#' + art.getSpecial("color", "000000");
        ctx.fillStyle = '#' + art.getSpecial("color", "000000");
        ctx.stroke();
        ctx.fill();
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
    var pensil = new PicaToolRINE();
    UI.Pica.Toolbar.registerTool(pensil);
    PicaToolPen.registerPen("rine", pensil);
})();