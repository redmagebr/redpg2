class PicaToolScaling1 extends PicaToolScaling {
    protected scaling = UI.Pica.Board._IMAGE_SCALING_FIT_STRETCH;

    constructor () {
        super();
        this.setIcon("icons-picaToolFit");
        this.setTitleLingo("_PICASCALEFITSTRETCH_");
    }
}

UI.Pica.Toolbar.registerTool(new PicaToolScaling1());