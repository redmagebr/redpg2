class PicaToolPensil extends PicaToolPen {
    constructor () {
        super();

        this.setIcon("icons-picaToolPensil");
    }
}

var pensil = new PicaToolPensil();
UI.Pica.Toolbar.registerTool(pensil);
UI.Pica.Board.Canvas.setPen(pensil);
delete(pensil);