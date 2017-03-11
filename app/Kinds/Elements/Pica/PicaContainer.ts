class PicaContainer {
    private container : HTMLElement;
    private tools : PicaToolbar = new PicaToolbar();
    private board : PicaBoard = new PicaBoard();

    public getBoard () : PicaBoard {
        return this.board;
    }

    constructor (picaWindow : HTMLElement) {
        this.container = document.createElement("div");
        this.container.id = "pictureContainer";

        this.container.appendChild(this.board.getHTML());
        this.container.appendChild(this.tools.getHTML());

        picaWindow.appendChild(this.container);
        this.board.resize();
    }

    public loadImage (url : string) {
        this.board.loadImage(url);
    }

    public getHTML () {
        return this.container;
    }
}