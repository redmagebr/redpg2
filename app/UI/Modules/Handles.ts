module UI.Handles {
    var $leftHandle : JQuery = $("#leftHandleBar");
    var $leftHandleIcon : JQuery = $("#leftHandleIcon");
    var $rightHandle : JQuery = $("#rightHandleBar");
    var $rightHandleIcon : JQuery = $("#rightHandleIcon");
    var alwaysUp = false;

    $leftHandle[0].addEventListener("mouseenter", function (e) { UI.Handles.mouseIn(this); });
    $rightHandle[0].addEventListener("mouseenter", function (e) { UI.Handles.mouseIn(this); });
    $leftHandle[0].addEventListener("mouseleave", function (e) { UI.Handles.mouseOut(this); });
    $rightHandle[0].addEventListener("mouseleave", function (e) { UI.Handles.mouseOut(this); });

    $leftHandle[0].style.left = "-60px";
    $rightHandle[0].style.right = "-60px";

    export function isAlwaysUp () : boolean {
        return alwaysUp;
    }

    export function mouseIn (handle : HTMLElement) {
        if (alwaysUp) return;
        var left = $leftHandle[0] === handle;

        var css = {};
        css[left ? "left" : "right"] = "0px";

        if (left) {
            $leftHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
        } else {
            $rightHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
        }
    }

    export function mouseOut (handle : HTMLElement) {
        if (alwaysUp) return;
        var left = $leftHandle[0] === handle;

        var css = {};
        css[left ? "left" : "right"] = "-60px";

        if (left) {
            $leftHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
        } else {
            $rightHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
        }
    }


    function prepareAlwaysUp () {
        $leftHandleIcon[0].style.display = "none";
        $rightHandleIcon[0].style.display = "none";

        $leftHandle[0].style.left = "0px";
        $rightHandle[0].style.right = "0px";
        $leftHandle[0].style.width = "60px";
        $rightHandle[0].style.width = "60px";
    }

    function prepareNotAlwaysUp() {
        $leftHandleIcon[0].style.display = "";
        $rightHandleIcon[0].style.display = "";

        $leftHandle[0].style.left = "-60px";
        $rightHandle[0].style.right = "-60px";
        $leftHandle[0].style.width = "";
        $rightHandle[0].style.width = "";
    }

    export function setAlwaysUp (keepUp : boolean) {
        if (keepUp === alwaysUp) return;

        if (keepUp) {
            alwaysUp = true;
            prepareAlwaysUp();
        } else {
            alwaysUp = false;
            prepareNotAlwaysUp();
        }
    }

    // Setting up button functions
    $("#logoutButton").on("click", function () { Server.Login.doLogout(); });
}