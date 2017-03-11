class PicaToolbar {
    private container : HTMLElement;
    private tools : Array<PicaTool> = [];
    private static tools : Array<typeof PicaTool> = [];

    constructor () {
        this.container = document.createElement("div");
        this.container.id = "pictureToolsContainer";

        for (var i = 0; i < PicaToolbar.tools.length; i++) {
            this.tools.push(new PicaToolbar.tools[i]());
            this.container.appendChild(this.tools[i].getHTML());
        }
    }

    public getHTML () {
        return this.container;
    }

    public static registerTool (tool : typeof PicaTool) {
        if (PicaToolbar.tools.indexOf(tool) == -1) {
            PicaToolbar.tools.push(tool);
        }
    }
}