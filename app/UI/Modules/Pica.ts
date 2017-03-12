module UI.Pica {
    var pictureWindow = document.getElementById("pictureWindow");
    var $pictureWindow = $(pictureWindow);
    var $loadingWindow = $(document.getElementById("pictureLoading"));

    export function getPictureWindow () {
        return pictureWindow;
    }

    export function loadImage (url : string) {
        url = Server.URL.fixURL(url);
        UI.Pica.Board.loadImage(url);
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