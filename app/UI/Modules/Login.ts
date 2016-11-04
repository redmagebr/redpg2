module UI.Login {
    document.getElementById("loginForm").addEventListener("submit", function(e) {UI.Login.submitLogin(e);});

    var inputEmail : HTMLInputElement = <HTMLInputElement> document.getElementById("loginEmailInput");
    var inputPassword : HTMLInputElement = <HTMLInputElement> document.getElementById("loginPasswordInput");

    var $error404 = $("#loginError404").hide();
    var $error = $("#loginError").hide();


    var forgotPasswordButton = document.getElementById("loginForgotPassword");
    forgotPasswordButton.style.display = "none";

    export function callSelf () {
        UI.WindowManager.callWindow(UI.idLoginWindow);
        hideErrors();
    }

    export function hideErrors () {
        $error404.stop(true, true).hide();
        $error.stop(true, true).hide();
    }

    export function showError (code) {
        hideErrors();
        if (code === 404) {
            $error404.fadeIn(Application.Config.getConfig("animTime").getValue() / 2);
        } else {
            $error.fadeIn(Application.Config.getConfig("animTime").getValue() / 2);
        }
    }

    export function resetState () {
        if (Application.Login.hasLastEmail()) {
            inputEmail.value = Application.Login.getLastEmail();
        } else {
            inputEmail.value = "";
        }
        inputPassword.value = "";
    }

    export function resetFocus () {
        if (inputEmail.value !== "") {
            inputPassword.focus();
        } else {
            inputEmail.focus();
        }
    }

    export function assumeEmail (email : string) {
        inputEmail.value = email;
    }

    export function submitLogin (e : Event) {
        e.preventDefault();
        hideErrors();

        var cbs : Listener = {
            handleEvent : function () {
                if (Application.Login.isLogged()) {
                    UI.WindowManager.callWindow("mainWindow");
                    UI.Login.resetState();
                } else {
                    alert("Failed login attempt");
                }
            }
        };

        var cbe : Listener = {
            handleEvent : function (response, xhr) {
                UI.Login.showError(xhr.status);
            }
        };

        Application.Login.attemptLogin(<string> inputEmail.value, <string> inputPassword.value, cbs, cbe);
    }
}