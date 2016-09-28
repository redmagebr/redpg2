module UI.Login {
    document.getElementById("loginForm").addEventListener("submit", function(e) {UI.Login.submitLogin(e);});

    var inputEmail : HTMLInputElement = <HTMLInputElement> document.getElementById("loginEmailInput");
    var inputPassword : HTMLInputElement = <HTMLInputElement> document.getElementById("loginPasswordInput");

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
            handleEvent : function () {
                alert("Failed login attempt");
            }
        };

        Application.Login.attemptLogin(<string> inputEmail.value, <string> inputPassword.value, cbs, cbe);
    }

    export function exposeLoginFailure (e : Event, statusCode : number) {
        alert("Invalid Login or Error, status: " + statusCode);
    }
}