class PicaBG  {
    private board : PicaBoard;
    private img : HTMLImageElement = document.createElement("img");

    constructor (board : PicaBoard) {
        this.board = board;

        this.img.style.position = "absolute";
        this.img.addEventListener("load", <EventListenerObject> {
            BG : this,
            handleEvent : function (data) {
                this.BG.onLoad();
            }
        });

        this.board.getHTML().appendChild(this.img);
    }

    public onLoad () {
        if (!this.img.complete || (typeof this.img.naturalHeight === "undefined" || this.img.naturalHeight === 0)) {
            return;
        }

        this.img.style.opacity = "1";

        var height = this.img.naturalHeight;
        var width = this.img.naturalWidth;

        if (!(height < this.board.getAvailHeight() && width < this.board.getAvailWidth())) {
            var fWidth = this.board.getAvailWidth() / width;
            var fHeight = this.board.getAvailHeight() / height;
            var factor = fWidth < fHeight ? fWidth : fHeight;


            height = height * factor;
            width = width * factor;
            console.log(fWidth, fHeight, factor, height, width);
        }
        this.img.height = height;
        this.img.width = width;
        this.img.style.left = ((this.board.getAvailWidth() - width) / 2).toString() + "px";
        this.img.style.top = ((this.board.getAvailHeight() - height) / 2).toString() + "px";

        UI.Pica.stopLoading();
    }

    public loadImage (url : string) {
        if (this.img.src === url) {
            return;
        } else {
            this.img.style.opacity = "0";
            UI.Pica.startLoading();
            this.img.src = url;
        }
    }

    public resize () {

    }
}