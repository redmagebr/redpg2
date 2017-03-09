class PicaBoard {
    private board = document.createElement("div");
    private background = new PicaBG(this);
    private canvas = new PicaCanvas(this);

    private availHeight : number;
    private availWidth : number;

    constructor () {
        this.board.id = "pictureBoard";

        console.debug("[PicaBoard] Binding on window resize.");

        var resizer = <EventListenerObject> {
            board : this,
            handleEvent : function () {
                this.board.resize();
            }
        };

        window.addEventListener("resize", resizer);
    }

    public getBackground () : PicaBG {
        return this.background;
    }

    public loadImage (url : string) {
        this.resize();
        this.background.loadImage(url);
    }

    public getAvailHeight () {
        return this.availHeight;
    }

    public getAvailWidth () {
        return this.availWidth;
    }

    public resize () {
        this.availHeight = this.board.offsetHeight;
        this.availWidth = this.board.offsetWidth;

        this.background.resize();
        this.canvas.resize();
    }

    public getHTML () {
        return this.board;
    }
}