class PicaToolbar {
    private container : HTMLElement;
    private static tools : Array<PicaTool> = [];

    constructor () {
        this.container = document.createElement("div");
        this.container.id = "pictureToolsContainer";
    }

    public getHTML () {
        return this.container;
    }

    public static registerTool (tool : PicaTool) {
        if (PicaToolbar.tools.indexOf(tool) == -1) {
            PicaToolbar.tools.push(tool);
        }
    }
}