class PicaBG  {
    private board : PicaBoard;
    private img : HTMLImageElement = document.createElement("img");
    private ratio : number = 1;

    constructor (board : PicaBoard) {
        this.board = board;

        this.img.style.zIndex = "1";
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

        this.board.resize();

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
        var height = this.img.naturalHeight;
        var width = this.img.naturalWidth;
        this.ratio = 1;

        if (this.board.isFit()) {
            if (!this.board.isStretch()) {
                if (!(height < this.board.getAvailHeight() && width < this.board.getAvailWidth())) {
                    var fWidth = this.board.getAvailWidth() / width;
                    var fHeight = this.board.getAvailHeight() / height;
                    var factor = fWidth < fHeight ? fWidth : fHeight;

                    this.ratio = factor;
                    height = height * factor;
                    width = width * factor;
                }
            } else {
                var fWidth = this.board.getAvailWidth() / width;
                var fHeight = this.board.getAvailHeight() / height;
                var factor = fWidth < fHeight ? fWidth : fHeight;

                this.ratio = factor;
                height = height * factor;
                width = width * factor;
            }
        } else {
            var factor = this.board.getRatio();
            height = height * factor;
            width = width * factor;
            this.ratio = factor;
        }

        this.img.height = height;
        this.img.width = width;
        if (width < this.board.getAvailWidth()) {
            this.img.style.left = ((this.board.getAvailWidth() - width) / 2).toString() + "px";
        } else {
            this.img.style.left = "";
        }
        if (height < this.board.getAvailHeight()) {
            this.img.style.top = ((this.board.getAvailHeight() - height) / 2).toString() + "px";
        } else {
            this.img.style.top = "";
        }
    }

    public exportSizing () {
        return {
            height : this.img.height,
            width : this.img.width,
            left : this.img.style.left,
            top : this.img.style.top
        };
    }
}