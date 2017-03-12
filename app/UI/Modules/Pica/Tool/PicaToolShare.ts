class PicaToolShare extends PicaTool {
    constructor () {
        super();

        this.setIcon("icons-picaToolShare");
        this.setLeftSide();
    }
}

var share = new PicaToolShare();
UI.Pica.Toolbar.registerTool(share);
delete(share);