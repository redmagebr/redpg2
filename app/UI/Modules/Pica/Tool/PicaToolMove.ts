class PicaToolMove extends PicaToolPen {
    private lastPoint : PicaCanvasPoint;

    constructor () {
        super();

        this.setIcon("icons-picaToolMove");
    }

    public mouseDown (point : PicaCanvasPoint) {
        UI.Pica.Board.Canvas.getCanvas().classList.add("moving");
        this.lastPoint = point;
    }

    public mouseUp (point : PicaCanvasPoint) {
        this.mouseOut();
    }

    public mouseMove (point : PicaCanvasPoint) {
        if (this.lastPoint != null) {
            var xMovement = this.lastPoint.getX() - point.getX();
            var yMovement = this.lastPoint.getY() - point.getY();
            board = UI.Pica.Board.getBoard();
            board.scrollLeft += xMovement;
            board.scrollTop += yMovement;
        }
    }

    public mouseOut () {
        this.lastPoint = null;
        UI.Pica.Board.Canvas.getCanvas().classList.remove("moving");
    }

    public mouseWheel (up : boolean, point : PicaCanvasPoint) {
        UI.Pica.Board.changeRatio(up);
    }

    public updateCanvasClasses () {
        if (this.selected) {
            UI.Pica.Board.Canvas.getCanvas().classList.add("move");
        } else {
            UI.Pica.Board.Canvas.getCanvas().classList.remove("move");
            UI.Pica.Board.Canvas.getCanvas().classList.remove("moving");
        }
    }
}

var move = new PicaToolMove();
UI.Pica.Toolbar.registerTool(move);
//UI.Pica.Board.Canvas.setPen(move);
delete(move);