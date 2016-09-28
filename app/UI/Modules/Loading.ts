module UI.Loading {
    var $loadingWindow : JQuery = $("#loadingWindow").fadeOut(250);
    var loadingCounter : number = 0;

    export var $leftLoader : JQuery = $("#leftLoading").hide();
    var $rightLoader : JQuery = $("#rightLoading").hide();
    var leftCounter = 0;
    var rightCounter = 0;

    export function stopLoading () {
        if (--loadingCounter <= 0) {
            loadingCounter = 0;
            $loadingWindow.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
        }
    }

    export function startLoading () {
        if (++loadingCounter > 0) {
            $loadingWindow.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
        }
    }

    export function blockLeft () {
        if (++leftCounter > 0) {
            $leftLoader.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
        }
    }

    export function blockRight () {
        if (++rightCounter > 0) {
            $rightLoader.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
        }
    }

    export function unblockLeft () {
        if (--leftCounter <= 0) {
            leftCounter = 0;
            $leftLoader.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
        }
    }

    export function unblockRight () {
        if (--rightCounter <= 0) {
            rightCounter = 0;
            $rightLoader.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
        }
    }
}