module UI.Pica.Board {
    import triggerStatus = Server.Chat.triggerStatus;
    var board = document.createElement("div");
    board.id = "pictureBoard";
    UI.Pica.getPictureWindow().appendChild(board);

    var currentUrl = "";
    var urlTrigger = new Trigger();

    export var _IMAGE_SCALING_FIT_NO_STRETCH = 0;
    export var _IMAGE_SCALING_FIT_STRETCH = 1;
    export var _IMAGE_SCALING_USE_RATIO = 2;

    var availHeight = 0;
    var availWidth = 0;
    var imageScaling = _IMAGE_SCALING_FIT_NO_STRETCH;
    var imageRatio = 2;
    var imageRatioRate = 0.12;

    var sizeTrigger : Trigger = new Trigger();

    // Bind on resize to update height and width
    console.debug("[PicaBoard] Binding on window resize.");
    window.addEventListener("resize", function () {
        UI.Pica.Board.resize();
    });

    export function isFit () : boolean { return imageScaling == _IMAGE_SCALING_FIT_NO_STRETCH || imageScaling == _IMAGE_SCALING_FIT_STRETCH; }
    export function isStretch () : boolean { return imageScaling == _IMAGE_SCALING_FIT_STRETCH; }

    export function getBoard () {
        return board;
    }

    export function getImageRatio () {
        return imageRatio;
    }

    export function loadImage (url : string) {
        resize();
        UI.Pica.Board.Canvas.clearCanvas();
        currentUrl = url;
        urlTrigger.trigger(url);
    }

    export function getUrl () {
        return currentUrl;
    }

    export function resize () {
        var oldString = availWidth + "x" + availHeight;
        availWidth = board.offsetWidth;
        availHeight = board.offsetHeight;
        var newString = availWidth + "x" + availHeight;
        if (newString != oldString) {
            triggerSizeChange();
        }
    }

    export function getAvailHeight () {
        return availHeight;
    }

    export function getAvailWidth () {
        return availWidth;
    }

    export function addResizeListener (f : Function | Listener) {
        sizeTrigger.addListenerIfMissing(f);
    }

    export function addUrlListener (f : Function | Listener) {
        urlTrigger.addListenerIfMissing(f);
    }

    export function setImageScaling (num : number) {
        imageScaling = num;
        triggerSizeChange();
    }

    export function changeRatio (up : boolean) {
        if (imageScaling != _IMAGE_SCALING_USE_RATIO) {
            if (imageScaling == _IMAGE_SCALING_FIT_STRETCH) {
                imageRatio = UI.Pica.Board.Background.getMinRatio();
            } else {
                var minRatio = UI.Pica.Board.Background.getMinRatio();
                imageRatio = minRatio < 1 ? minRatio : 1;
            }
            imageScaling = _IMAGE_SCALING_USE_RATIO;
        }

        imageRatioRate = UI.Pica.Board.Background.getMinRatio() * 0.1; // Use rate relative to image size so that it isn't terribly slow for small images

        if (up) {
            imageRatio += imageRatioRate;
        } else {
            imageRatio -= imageRatioRate;
        }

        updateMinRatio();

        triggerSizeChange();
    }

    export function updateMinRatio () {
        var minRatio = UI.Pica.Board.Background.getMinRatio();
        minRatio = 1 < minRatio ? 1 : minRatio;
        if (imageRatio < minRatio) {
            imageRatio = minRatio;
        }
    }

    export function getScaling () {
        return imageScaling;
    }

    export function resetRatio () {
        if (imageRatio != 1) {
            imageRatio = 1;
            triggerSizeChange();
        }
    }

    function triggerSizeChange () {
        sizeTrigger.trigger();
    }
}