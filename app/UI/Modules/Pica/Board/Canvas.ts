/// <reference path='Background.ts' />
module UI.Pica.Board.Canvas {
    UI.Pica.Board.Background.addSizeListener(function () { UI.Pica.Board.Canvas.resize(); });

    var canvas : HTMLCanvasElement = document.createElement("canvas");
    canvas.classList.add("picaCanvas");
    UI.Pica.Board.getBoard().appendChild(canvas);

    var context : CanvasRenderingContext2D = canvas.getContext("2d");
    var picaMemory : MemoryPica = <MemoryPica> Server.Chat.Memory.getConfiguration("Pica");
    picaMemory.addChangeListener(function () {
        UI.Pica.Board.Canvas.setLocked();
    });

    var locked : boolean = picaMemory.isPicaAllowed();
    var lockedTrigger : Trigger = new Trigger();

    var height = 0;
    var width = 0;

    var pen : PicaToolPen = new PicaToolPen();
    var penWidth : number = 1;
    var penColor : string = "000000";

    var penTrigger = new Trigger();

    var updatePenFunction = function () { UI.Pica.Toolbar.updateVisibility(); };
    lockedTrigger.addListenerIfMissing(updatePenFunction);
    Server.Chat.addRoomListener(updatePenFunction);

    export function clearCanvas () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    export function redraw () {
        clearCanvas();

        var room = Server.Chat.getRoom();
        if (room != null) {
            var roomid = room.id;
            var url = UI.Pica.Board.getUrl();
            var art = <Array<PicaCanvasArt>> UI.Pica.ArtManager.getArt(roomid, url);
            for (var i = 0; i < art.length; i++) {
                art[i].redraw();
            }
        }

        pen.redraw();
    }

    export function getCanvas () {
        return canvas;
    }

    export function getCanvasContext () {
        return context;
    }

    export function getHeight () {
        return height;
    }

    export function getWidth () {
        return width;
    }

    export function setLocked () {
        locked = !picaMemory.isPicaAllowed();
        if (locked) {
            canvas.classList.add("locked");
        } else {
            canvas.classList.remove("locked");
        }
        lockedTrigger.trigger();
    }

    export function addLockListener (f : Listener | Function) {
        lockedTrigger.addListenerIfMissing(f);
    }

    export function resize () {
        var sizeObj = UI.Pica.Board.Background.exportSizes();

        height = sizeObj.height;
        width = sizeObj.width;
        canvas.width = sizeObj.width;
        canvas.height = sizeObj.height;
        canvas.style.left = sizeObj.left;
        canvas.style.top = sizeObj.top;

        redraw();
    }

    export function mouseDown (point : PicaCanvasPoint) {
        pen.mouseDown(point);
    }

    export function mouseUp (point : PicaCanvasPoint) {
        pen.mouseUp(point);
    }

    export function mouseMove (point : PicaCanvasPoint) {
        pen.mouseMove(point);
    }

    export function mouseOut () {
        pen.mouseOut();
    }

    export function mouseWheel (up : boolean, point : PicaCanvasPoint) {
        pen.mouseWheel(up, point);
    }

    export function setPen (newPen : PicaToolPen) {
        pen.setSelected(false);
        pen = newPen;
        pen.setSelected(true);
    }

    export function addPenListener (f : Function | Listener) {
        penTrigger.addListenerIfMissing(f);
    }

    export function getPenWidth () {
        return penWidth;
    }

    export function getPenColor () {
        return penColor;
    }

    export function setPenWidth (newWidth : number) {
        if (newWidth != penWidth) {
            penWidth = newWidth;
            penTrigger.trigger();
        }
    }

    export function setPenColor (newColor : string) {
        if (newColor != penColor) {
            penColor = newColor;
            penTrigger.trigger();
        }
    }

    // Binding Mouse on Canvas
    {
        canvas.addEventListener("mousedown", <EventListenerObject> {
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint();
                point.setCoordinates(e.offsetX, e.offsetY);
                UI.Pica.Board.Canvas.mouseDown(point);
            }
        });

        canvas.addEventListener("mouseup", <EventListenerObject> {
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint();
                point.setCoordinates(e.offsetX, e.offsetY);
                UI.Pica.Board.Canvas.mouseUp(point);
            }
        });

        canvas.addEventListener("mousemove", <EventListenerObject> {
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint();
                point.setCoordinates(e.offsetX, e.offsetY);
                UI.Pica.Board.Canvas.mouseMove(point);
            }
        });

        canvas.addEventListener("mousewheel", <EventListenerObject> {
            handleEvent : function (e : MouseEvent) {
                e.stopPropagation();
                e.preventDefault();
                var point = new PicaCanvasPoint();
                point.setCoordinates(e.offsetX, e.offsetY);
                var up = (<any> e).deltaY <= 0;
                UI.Pica.Board.Canvas.mouseWheel(up, point);
            }
        });

        canvas.addEventListener("mouseout", <EventListenerObject> {
            handleEvent : function (e : MouseEvent) {
                UI.Pica.Board.Canvas.mouseOut();
            }
        });
    }
}