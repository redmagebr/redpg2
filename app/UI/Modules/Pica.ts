module UI.Pica {
    var $pictureWindow = $(document.getElementById("pictureWindow"));
    var $loadingWindow = $(document.getElementById("pictureLoading"));

    var pictureContainer = document.getElementById("pictureContainer");

    export function callSelf () {
        $pictureWindow.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
    }

    export function close () {
        $pictureWindow.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
    }

    export function startLoading () {
        $loadingWindow.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
    }

    export function stopLoading () {
        $loadingWindow.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
    }
}