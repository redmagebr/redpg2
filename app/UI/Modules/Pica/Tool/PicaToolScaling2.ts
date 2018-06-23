class PicaToolScaling2 extends PicaToolScaling {
    protected scaling = UI.Pica.Board._IMAGE_SCALING_USE_RATIO;
    protected ratio = 1;

    constructor () {
        super();
        this.setIcon("icons-picaToolRatio1");
        this.setTitleLingo("_PICASCALERATIO1_");
    }
}

UI.Pica.Toolbar.registerTool(new PicaToolScaling2());