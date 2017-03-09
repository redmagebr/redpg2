class PicaCanvas {
    private parent : PicaBoard;
    private canvas : HTMLCanvasElement = document.createElement("canvas");
    private artAllowed : MemoryPica = <MemoryPica> Server.Chat.Memory.getConfiguration("Pica");
    private locked : boolean = false;
    private width : number;
    private height : number;

    constructor (board : PicaBoard) {
        this.parent = board;

        this.canvas.style.zIndex = "2";
        this.canvas.style.position = "absolute";

        this.canvas.classList.add("picaCanvas");

        this.parent.getHTML().appendChild(this.canvas);

        this.artAllowed.addChangeListener(<Listener> {
            picaCanvas : this,
            handleEvent : function (artAllowed : MemoryPica) {
                console.log("Updating canvas to pica allowed change");
                this.picaCanvas.setLock(artAllowed.isPicaAllowed());
            }
        });
        this.setLock(this.artAllowed.isPicaAllowed());
    }
    
    public setLock (isLocked : boolean) {
        this.locked = isLocked;
        if (this.locked) {
            this.canvas.classList.add("locked");
        } else {
            this.canvas.classList.remove("locked");
        }
    }


    public redraw () {
        // TODO: First draw all stored arts
        // TODO: Then redraw whatever art is being done right now and don't close it
    }

    public getHeight () {
        return this.height;
    }

    public getWidth () {
        return this.width;
    }

    public resize () {
        var sizeObj = this.parent.getBackground().exportSizing();

        this.height = sizeObj.height;
        this.width = sizeObj.width;
        this.canvas.width = sizeObj.width;
        this.canvas.height = sizeObj.height;
        this.canvas.style.left = sizeObj.left;
        this.canvas.style.top = sizeObj.top;

        this.redraw();
    }
}