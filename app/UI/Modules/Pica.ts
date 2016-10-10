module UI.Pica {
    var $pictureWindow = $(document.getElementById("pictureWindow"));
    var $loadingWindow = $(document.getElementById("pictureLoading"));

    var pica = new PicaContainer(document.getElementById("pictureWindow"));

    export function getPica () : PicaContainer {
        return pica;
    }

    export function loadImage (url : string) {
        pica.loadImage(url);
        callSelf();
    }

    export function callSelf () {
        //$pictureWindow.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
        $pictureWindow.stop().animate({
            opacity : 1
        }, Application.Config.getConfig("animTime").getValue());
        $pictureWindow[0].style.pointerEvents = "auto";
    }

    export function close () {
        $pictureWindow.stop().animate({
            opacity: 0
        }, Application.Config.getConfig("animTime").getValue());
        $pictureWindow[0].style.pointerEvents = "none";
    }

    export function startLoading () {
        $loadingWindow.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
    }

    export function stopLoading () {
        $loadingWindow.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
    }
}