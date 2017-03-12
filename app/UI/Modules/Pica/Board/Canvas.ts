/// <reference path='Background.ts' />
module UI.Pica.Board.Canvas {
    UI.Pica.Board.Background.addSizeListener(function () { UI.Pica.Board.Canvas.resize(); });

    var canvas : HTMLCanvasElement = document.createElement("canvas");
    canvas.style.zIndex = "2";
    canvas.style.position = "absolute";
    canvas.classList.add("picaCanvas");
    UI.Pica.Board.getBoard().appendChild(canvas);

    var context : CanvasRenderingContext2D = canvas.getContext("2d");
    var picaMemory : MemoryPica = <MemoryPica> Server.Chat.Memory.getConfiguration("Pica");
    picaMemory.addChangeListener(function (picaMemory : MemoryPica) { UI.Pica.Board.Canvas.setLocked(picaMemory.isPicaAllowed()); });

    var locked : boolean = picaMemory.isPicaAllowed();
    var lockedTrigger : Trigger = new Trigger();

    var height = 0;
    var width = 0;

    var pen : PicaToolPen = new PicaToolPen();

    function redraw () {

    }

    export function getCanvas () {
        return canvas;
    }

    export function getHeight () {
        return height;
    }

    export function getWidth () {
        return width;
    }

    export function setLocked (isLocked : boolean) {
        if (isLocked != locked) {
            locked = isLocked;
            lockedTrigger.trigger();
        }
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
                var up = e.deltaY <= 0;
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