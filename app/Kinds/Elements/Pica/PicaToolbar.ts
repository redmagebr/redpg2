class PicaToolbar {
    private container : HTMLElement;

    constructor () {
        this.container = document.createElement("div");
        this.container.id = "pictureToolsContainer";
    }

    public getHTML () {
        return this.container;
    }


    public addTool () {

    }
}