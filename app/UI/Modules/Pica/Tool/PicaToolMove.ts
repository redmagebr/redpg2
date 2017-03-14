class PicaToolMove extends PicaToolPen {
    private lastPoint : PicaCanvasPoint;

    constructor () {
        super();

        this.setIcon("icons-picaToolMove");
        this.setTitleLingo("_PICAMOVE_");
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
        var board = UI.Pica.Board.getBoard();
        var availScrollTop = board.scrollHeight - UI.Pica.Board.getAvailHeight();
        if (availScrollTop < 1) availScrollTop = 1;
        var availScrollLeft = board.scrollWidth - UI.Pica.Board.getAvailWidth();
        if (availScrollLeft < 1) availScrollLeft = 1;

        var relLeft = board.scrollLeft / availScrollLeft;
        var relTop = board.scrollTop / availScrollTop;

        UI.Pica.Board.changeRatio(up);

        var availScrollTop = board.scrollHeight - UI.Pica.Board.getAvailHeight();
        if (availScrollTop < 1) availScrollTop = 1;
        var availScrollLeft = board.scrollWidth - UI.Pica.Board.getAvailWidth();
        if (availScrollLeft < 1) availScrollLeft = 1;

        board.scrollLeft = availScrollLeft * relLeft;
        board.scrollTop = availScrollTop * relTop;
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
UI.Pica.Board.Canvas.setPen(move);
delete(move);