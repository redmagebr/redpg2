class PicaToolbar {
    private container : HTMLElement;

    constructor () {
        this.container = document.createElement("div");
        this.container.id = "pictureToolsContainer";
    }

    public getHTML () {
        return this.container;
    }

    // %a.leftPicaToolButton.language.icons-picaShare{:data=>{:titlelingo=>"_PICASHARE_"}}
    // %a.rightPicaToolButton
    // %a.picaTool="Compartilhar"
    // %a.picaToolButton
    // %a.picaToolButton
    // %a.picaToolButton
    // %a.picaToolButton
    public addTool () {

    }
}