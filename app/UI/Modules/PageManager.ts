module UI.PageManager {
    var $currentLeft : JQuery = null;
    var $currentRight : JQuery = null;
    var mainWindow : HTMLElement = document.getElementById("mainWindow");

    export var $pages : {[id : string] : JQuery} = {};

    export function getAnimationTime () : number {
        return Application.Config.getConfig("animTime").getValue() * 2;
    }

    export function callPage (id : string) {
        var animationTime = getAnimationTime();
        var $page = $pages[id];
        if ($page === undefined) {
            return console.log("Attempt to call inexistent page at " + id + ". Ignoring.");
        }

        if ($page[0].classList.contains("leftSideWindow")) {
            if (UI.Handles.isAlwaysUp() && $currentRight !== null) closeRightPage();

            if ($currentLeft !== null && $page[0] === $currentLeft[0]) return;

            var offLeft = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentLeftSize;

            closeLeftPage();

            $page.finish();
            mainWindow.appendChild($page[0]);
            $page[0].style.left = offLeft + "px";

            $page.animate({
                left : (UI.Handles.isAlwaysUp() ? 60 : 10)
            }, animationTime, function () {
                this.style.left = "";
            });

            $currentLeft = $page;
        } else {
            if ($currentRight !== null && $page[0] === $currentRight[0]) return;

            closeRightPage();

            var offRight = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentRightSize;

            $page.finish();
            mainWindow.appendChild($page[0]);
            $page[0].style.right = offRight + "px";

            $page.animate({
                right : (UI.Handles.isAlwaysUp() ? 60 : 10)
            }, animationTime, function () {
                this.style.right = "";
            });

            $currentRight = $page;
        }
        UI.Language.updateScreen($page[0]);
    }

    export function closeLeftPage () {
        var offLeft = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentLeftSize;
        var animationTime = getAnimationTime();
        if ($currentLeft !== null) {
            $currentLeft.finish().animate({
                left: offLeft
            }, animationTime, function () {
                this.style.left = "";
                this.parentElement.removeChild(this);
            });
            $currentLeft = null;
        }
    }

    export function closeRightPage () {
        if ($currentRight === null) return;

        var animationTime = getAnimationTime();
        var offRight = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentRightSize;
        $currentRight.finish().animate({
            right: offRight
        }, animationTime, function () {
            this.style.right = "";
            this.parentElement.removeChild(this);
        });

        $currentRight = null;
    };

    export function readWindows () {
        var children : HTMLCollection = mainWindow.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var child : HTMLElement = <HTMLElement> children[i];
            if (child.getAttribute("id") !== null && (child.classList.contains("leftSideWindow") || child.classList.contains("rightSideWindow"))) {
                if (child.classList.contains("dontDetach")) {
                    continue;
                }
                $pages[child.getAttribute("id")] = $(child);
                mainWindow.removeChild(child);
            }
        }
    }

    export function getCurrentLeft () : String {
        if ($currentLeft === null) {
            return null;
        }

        return $currentLeft[0].getAttribute("id");
    }
}