module UI.Login.NewAccount {
    document.getElementById("loginNewAccount").addEventListener("click", function () {
        UI.Login.NewAccount.callSelf();
    });

    document.getElementById("accountCreationForm").addEventListener("submit", function (e) {
        e.preventDefault();
        UI.Login.NewAccount.submit();
    });

    document.getElementById("accCreationReturnButton").addEventListener("click", function (e) {
        e.preventDefault();
        UI.Login.callSelf();
    });

    var $error401 = $("#accCreationError401").hide();
    var $error409 = $("#accCreationError409").hide();
    var $error = $("#accCreationError").hide();

    var nameInput = <HTMLInputElement> document.getElementById("accName");
    var nickInput = <HTMLInputElement> document.getElementById("accNickname");
    var emailInput = <HTMLInputElement> document.getElementById("accEmail");
    var passInput = <HTMLInputElement> document.getElementById("accPassword");
    var pass2Input = <HTMLInputElement> document.getElementById("accPassword2");

    export function callSelf () {
        UI.WindowManager.callWindow(UI.idAccountCreationWindow);
        hideErrors();
    }

    function getAnimTime () {
        return (Application.Config.getConfig("animTime").getValue() / 2);
    }

    export function hideErrors () {
        $error401.stop(true, true).fadeOut(getAnimTime());
        $error409.stop(true, true).fadeOut(getAnimTime());
        $error.stop(true, true).fadeOut(getAnimTime());
    }

    export function showError (code) {
        hideErrors();
        if (code === 401) {
            $error401.fadeIn(getAnimTime());
        } else if (code === 409) {
            $error409.fadeIn(getAnimTime());
        } else {
            $error.fadeIn(getAnimTime());
        }
    }

    export function submit () {
        nameInput.classList.remove("error");
        nickInput.classList.remove("error");
        emailInput.classList.remove("error");
        passInput.classList.remove("error");
        pass2Input.classList.remove("error");

        var name = nameInput.value.trim();
        var nick = nickInput.value.trim();
        var email = emailInput.value.trim();
        var pass = passInput.value.trim();
        var pass2 = pass2Input.value.trim();

        var fail = false;

        if (!name.match('^[a-zA-Z0-9 çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,200}$')) {
            nameInput.classList.add("error");
            fail = true;
        }

        if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            emailInput.classList.add("error");
            fail = true;
        }

        if (!nick.match('^[a-zA-Z0-9çÇéÉíÍóÓáÁàÀâÂÊêãÃõÕôÔ]{3,12}$')) {
            nickInput.classList.add("error");
            fail = true;
        }

        if (!pass.match('^[a-zA-Z0-9]{3,12}$')) {
            passInput.classList.add("error");
            fail = true;
        } else if (pass2 !== pass) {
            pass2Input.classList.add("error");
            fail = true;
        }

        if (!fail) {
            var cbs = function () {
                UI.Login.callSelf();
            };

            var cbe = function (response, xhr) {
                console.log(xhr);
                UI.Login.NewAccount.showError(xhr.status);
            };

            Server.Login.createAccount(name, pass, email, nick, cbs, cbe);
        }
    }
}