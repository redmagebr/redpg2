class PicaToolbar {
    private container : HTMLElement;
    private static tools : Array<PicaTool> = [];

    constructor () {
        this.container = document.createElement("div");
        this.container.id = "pictureToolsContainer";

        for (var i = 0; i < PicaToolbar.tools.length; i++) {
            this.container.appendChild(PicaToolbar.tools[i].getHTML());
        }
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