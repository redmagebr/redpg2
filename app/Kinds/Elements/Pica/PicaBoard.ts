class PicaBoard {
    private board = document.createElement("div");
    private background = new PicaBG(this);
    private canvas = new PicaCanvas(this);

    private availHeight : number;
    private availWidth : number;

    public static _IMAGE_SCALING_FIT_NO_STRETCH = 0;
    public static _IMAGE_SCALING_FIT_STRETCH = 1;
    public static _IMAGE_SCALING_USE_RATIO = 2;

    //private imageScaling : number = PicaBoard._IMAGE_SCALING_FIT_NO_STRETCH;
    private imageScaling : number = PicaBoard._IMAGE_SCALING_FIT_STRETCH;
    private imageRatio : number = 1;

    public isFit () {
        return this.imageScaling != PicaBoard._IMAGE_SCALING_USE_RATIO;
    }

    public isStretch () {
        return this.imageScaling == PicaBoard._IMAGE_SCALING_FIT_STRETCH;
    }

    public getRatio () {
        return this.imageRatio;
    }

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