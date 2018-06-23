class PicaToolScaling0 extends PicaToolScaling {
    protected scaling = UI.Pica.Board._IMAGE_SCALING_FIT_NO_STRETCH;

    constructor () {
        super();
        this.setIcon("icons-picaToolRatio1Fit");
        this.setTitleLingo("_PICASCALEFITNOSTRETCH_");
    }
}

UI.Pica.Toolbar.registerTool(new PicaToolScaling0());