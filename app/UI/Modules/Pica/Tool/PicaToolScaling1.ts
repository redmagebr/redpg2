class PicaToolScaling1 extends PicaToolScaling {
    protected scaling = UI.Pica.Board._IMAGE_SCALING_FIT_STRETCH;

    constructor () {
        super();
        this.setIcon("icons-picaToolFit");
    }
}

var tool = new PicaToolScaling1();
UI.Pica.Toolbar.registerTool(tool);
delete(tool);