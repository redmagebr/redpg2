module UI.Pica.Board.Background {
    var img = document.createElement("img");
    img.style.zIndex = "1";
    img.style.position = "absolute";
    UI.Pica.Board.getBoard().appendChild(img);

    img.addEventListener("load", function () { UI.Pica.Board.Background.onLoad(); });

    UI.Pica.Board.addResizeListener(function () { UI.Pica.Board.Background.resize(); });
    UI.Pica.Board.addUrlListener(function (url) { UI.Pica.Board.Background.load(url); });

    var naturalWidth = 0;
    var naturalHeight = 0;
    var finalWidth = 0;
    var finalHeight = 0;
    var factor = 1;

    var loadTrigger = new Trigger();
    var sizeTrigger = new Trigger();

    export function load (url) {
        if (img.src === url) {
            return;
        }
        img.style.opacity = "0";
        UI.Pica.startLoading();
        img.src = url;
    }

    export function addLoadListener (f : Function | Listener) {
        loadTrigger.addListenerIfMissing(f);
    }

    export function addSizeListener (f : Function | Listener) {
        sizeTrigger.addListenerIfMissing(f);
    }

    export function onLoad () {
        if (!img.complete || (typeof img.naturalHeight === "undefined" || img.naturalHeight === 0)) {
            return;
        }

        img.style.opacity = "1";
        resize();
        UI.Pica.stopLoading();
        UI.Pica.Board.updateMinRatio();
        loadTrigger.trigger();
    }

    export function getMinRatio () {
        var maxWidth = UI.Pica.Board.getAvailWidth();
        var maxHeight = UI.Pica.Board.getAvailHeight();
        var fWidth = maxWidth / naturalWidth;
        var fHeight = maxHeight / naturalHeight;
        return (fWidth < fHeight ? fWidth : fHeight);
    }

    export function resize () {
        var maxWidth = UI.Pica.Board.getAvailWidth();
        var maxHeight = UI.Pica.Board.getAvailHeight();
        if (typeof img.naturalHeight === "undefined" || img.naturalHeight === 0) {
            return;
        }
        naturalWidth = img.naturalWidth;
        naturalHeight = img.naturalHeight;
        factor = 1;

        if (UI.Pica.Board.isFit()) {
            // If is supposed to stretch to fit, find max Factor
            // If doesn't fit, find factor to fit
            if (UI.Pica.Board.isStretch() || (naturalHeight > maxHeight || naturalWidth > maxWidth)) {
                var fWidth = maxWidth / naturalWidth;
                var fHeight = maxHeight / naturalHeight;
                factor = fWidth < fHeight ? fWidth : fHeight;
            }
        } else {
            factor = UI.Pica.Board.getImageRatio();
        }

        finalWidth = naturalWidth * factor;
        finalHeight = naturalHeight * factor;

        img.width = finalWidth;
        img.height = finalHeight;

        if (finalWidth < maxWidth) {
            img.style.left = ((maxWidth - finalWidth) / 2).toString() + "px";
        } else {
            img.style.left = "";
        }

        if (finalHeight < maxHeight) {
            img.style.top = ((maxHeight - finalHeight) / 2).toString() + "px";
        } else {
            img.style.top = "";
        }

        sizeTrigger.trigger();
    }

    export function exportSizes () {
        return {
            height : img.height,
            width : img.width,
            left : img.style.left,
            top : img.style.top
        };
    }
}