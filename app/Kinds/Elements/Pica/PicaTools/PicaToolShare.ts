class PicaToolShare extends PicaTool {
    private a = document.createElement("a");

    constructor () {
        super();
        this.a.classList.add("leftPicaToolButton");
        this.a.classList.add("icons-picaShare");
        UI.Language.addLanguageTitle(this.a, "_PICASHARE_");
        UI.Language.markLanguage(this.a);
    }

    public getHTML () : HTMLElement {
        UI.Language.updateScreen(this.a);
        return this.a;
    }

    public onClick () {
        // Share the current Pica
    }

    public onHover () {} // Nothing happens on hover
    public updateVisibility () {} // Always visible
}

PicaToolbar.registerTool(PicaToolShare);