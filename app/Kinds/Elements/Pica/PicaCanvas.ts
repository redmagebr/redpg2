class PicaCanvas {
    private parent : PicaBoard;
    private canvas : HTMLCanvasElement = document.createElement("canvas");
    private artAllowed : MemoryPica = <MemoryPica> Server.Chat.Memory.getConfiguration("Pica");
    private locked : boolean = false;
    private width : number;
    private height : number;

    private pen : PicaCanvasPen = new PicaCanvasPen();

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

        this.bindMouse();
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

    private bindMouse () {
        this.canvas.addEventListener("mousedown", <EventListenerObject> {
            canvas : this,
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint(this.canvas);
                point.setCoordinates(e.offsetX, e.offsetY);
                this.canvas.mouseDown(point);
            }
        });

        this.canvas.addEventListener("mouseup", <EventListenerObject> {
            canvas : this,
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint(this.canvas);
                point.setCoordinates(e.offsetX, e.offsetY);
                this.canvas.mouseUp(point);
            }
        });

        this.canvas.addEventListener("mousemove", <EventListenerObject> {
            canvas : this,
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint(this.canvas);
                point.setCoordinates(e.offsetX, e.offsetY);
                this.canvas.mouseMove(point);
            }
        });

        this.canvas.addEventListener("mousewheel", <EventListenerObject> {
            canvas : this,
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint(this.canvas);
                point.setCoordinates(e.offsetX, e.offsetY);
                var up = e.deltaY <= 0;
                this.canvas.mouseWheel(up, point);
            }
        });

        this.canvas.addEventListener("mouseOut", <EventListenerObject> {
            canvas : this,
            handleEvent : function (e : MouseEvent) {
                this.canvas.mouseOut();
            }
        });
    }

    public mouseDown (point : PicaCanvasPoint) {
        this.pen.mouseDown(point);
    }

    public mouseUp (point : PicaCanvasPoint) {
        this.pen.mouseUp(point);
    }

    public mouseMove (point : PicaCanvasPoint) {
        this.pen.mouseMove(point);
    }

    public mouseOut () {
        this.pen.mouseOut();
    }

    public mouseWheel (up : boolean, point : PicaCanvasPoint) {
        this.pen.mouseWheel(up, point);
    }
}