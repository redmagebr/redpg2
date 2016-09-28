module UI.WindowManager {
    var currentWindow : string = "";
    var windowList : {[id : string] : HTMLElement}  = {};
    var $windowList : {[id : string] : JQuery}  = {};

    export var currentLeftSize : number;
    export var currentRightSize : number;

    var style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);
    var lastStyleInnerHTML = "";

    (function() {
        var children : HTMLCollection = document.body.children;
        for (var i = 0; i < children.length; i++) {
            var child : HTMLElement = <HTMLElement> children[i];
            if (child.classList.contains("window")) {
                windowList[child.getAttribute("id")] = child;
                $windowList[child.getAttribute("id")] = $(child);
            }
        }
    })();

    export function callWindow (id : string) {
        var animationTime = Application.Config.getConfig("animTime").getValue() * 2;
        if (windowList[id] === undefined) {
            console.log("--- Error: Attempt to call inexistent window: " + id + ", ignoring.");
            return;
        }

        if (id === currentWindow) return; // Same window, no point

        if (currentWindow === "") {
            detachAllWindows ();
        } else {
            console.debug("Detaching current window: " + currentWindow);
            windowList[currentWindow].style.zIndex = "1";
            windowList[currentWindow].style.opacity = "1";
        }

        var oldid = currentWindow;
        currentWindow = id;
        console.debug("Appending window: " + id);
        $windowList[currentWindow].finish().css("opacity", "0").animate({opacity : 1}, animationTime, (function () {
            var ele = document.getElementById(this.oldid);
            if (ele === null) {
                return;
            }
            if (ele.parentNode !== null) {
                ele.parentNode.removeChild(ele);
            }
        }).bind({oldid : oldid}));
        windowList[currentWindow].style.zIndex = "2";
        document.body.appendChild(windowList[currentWindow]);
        UI.Language.updateScreen(windowList[currentWindow]);
    }

    function detachAllWindows () {
        for (var key in windowList) {
            document.body.removeChild(windowList[key]);
        }
    }

    function detachWindow (id : string) {
        document.body.removeChild(windowList[id]);
    }

    export function updateWindowSizes () {
        var stylehtml = "";
        // Find left and right sizes
        var totalWidth = window.innerWidth;
        var rightSize = 698;
        var leftSize = 35 + 340 + 100; // Buttons + 4 Avatars + 2 extra dice buttons
        var remainingSize = totalWidth - rightSize - leftSize - 20;
        if (remainingSize > 255) {
            remainingSize = 255 + ((remainingSize - 255) * 1 / 2); // Right side grows too when too big
        }
        if (remainingSize < 0 || Application.Config.getConfig("fsmode").getValue()) {
            UI.Handles.setAlwaysUp(true);
            leftSize = totalWidth - 120;
            rightSize = leftSize;

            stylehtml += ".rightSideWindow { background-color: rgba(0,0,0,.5);} ";
        } else {
            UI.Handles.setAlwaysUp(false);
            leftSize += Math.floor(remainingSize / 85) * 85; // Fit as many avatars as possible
            rightSize = totalWidth - leftSize - 20; // Remove handle sizes
        }
        stylehtml += ".leftSideWindow { width: " + leftSize + "px; }\n.rightSideWindow { width: " + rightSize + "px; }";

        currentLeftSize = leftSize;
        currentRightSize = rightSize;

        // Set up handles
        if (UI.Handles.isAlwaysUp()) {
            stylehtml += "\n.leftSideWindow { left: 60px; }\n.rightSideWindow { right: 60px; }";
        }

        // Only do costly update if necessary
        if (stylehtml !== lastStyleInnerHTML) {
            style.innerHTML = stylehtml;
            lastStyleInnerHTML = stylehtml;
        }
    }

    window.addEventListener("resize", function () {
        UI.WindowManager.updateWindowSizes();
    });
}