/// <reference path='../Application.ts' />
module Application.Login {
    var currentUser : User = null;
    var currentSession : String = null;
    var lastEmail : String = null;
    var lastUpdate : String = null;

    var sessionLife : number = 30 * 60 * 1000; // 30 * 60 seconds
    var keepAliveTime : number = 2 * 60 * 1000; // 2 * 60 seconds

    var interval = null;

    var trigger = new Trigger();

    // Constants for localStorage
    var LAST_LOGIN_STORAGE = "redpg_lastLogin";
    var LAST_SESSION_STORAGE = "redpg_lastSession";
    var LAST_SESSION_TIME_STORAGE = "redpg_lastSessionTime";

    /**
     * Checks localStorage for a valid Session id.
     * If there is no valid Session id, checks localStorage for last login's e-mail.
     * If there is no last e-mail, goes back to square one.
     */
    export function searchLogin () {
        if (localStorage.getItem(LAST_LOGIN_STORAGE) !== null) {
            lastEmail = localStorage.getItem(LAST_LOGIN_STORAGE);
        } else {
            lastEmail = null;
        }

        if (localStorage.getItem(LAST_SESSION_STORAGE) !== null) {
            var currentTime = new Date().getTime();
            var lastTime = parseInt(localStorage.getItem(LAST_SESSION_TIME_STORAGE));
            if ((currentTime - lastTime) <= sessionLife) {
                currentSession = localStorage.getItem(LAST_SESSION_STORAGE);
                lastUpdate = lastTime.toString();
            }
        }
    }

    export function hasLastEmail () : boolean {
        return lastEmail !== null;
    }

    export function getLastEmail () : string {
        return <string> lastEmail;
    }

    export function isLogged () : boolean {
        return currentUser !== null;
    }

    export function hasSession() : boolean {
        return currentSession !== null;
    }

    export function getSession() {
        return currentSession;
    }

    export function logout () {
        var oldLogged = isLogged();

        currentSession = null;
        currentUser = null;
        //lastEmail = null;
        //lastEmail must remain in memory
        if (interval !== null) window.clearInterval(interval);
        interval = null;

        localStorage.removeItem(LAST_SESSION_STORAGE);
        localStorage.removeItem(LAST_SESSION_TIME_STORAGE);

        if (oldLogged !== isLogged()) {
            triggerListeners();
        }
    }

    export function attemptLogin (email : string, password : string, cbs : Listener, cbe : Listener) {
        lastEmail = email;
        updateLocalStorage();

        Server.Login.doLogin(email, password, cbs, cbe);
    }

    export function receiveLogin (userJson : Object, sessionid : string) {
        var oldLogged = isLogged();
        var oldUser = currentUser;

        currentSession = sessionid;

        DB.UserDB.updateFromObject([userJson]);
        currentUser = DB.UserDB.getUser(userJson['id']);
        updateSessionLife();

        if (interval !== null) window.clearInterval(interval);
        interval = window.setInterval(function () {
            Application.Login.keepAlive();
        }, keepAliveTime);

        if (!oldLogged || oldUser.id !== currentUser.id) {
            triggerListeners();
        }
    }

    export function updateSessionLife () {
        lastUpdate = new Date().getTime().toString();
        updateLocalStorage();
    }

    export function updateLocalStorage () {
        if (lastEmail !== null) {
            localStorage.setItem(LAST_LOGIN_STORAGE, <string> lastEmail);
        }

        if (hasSession()) {
            if (lastUpdate !== null) {
                localStorage.setItem(LAST_SESSION_STORAGE, <string> currentSession);
                localStorage.setItem(LAST_SESSION_TIME_STORAGE, <string> lastUpdate);
            } else {
                localStorage.removeItem(LAST_SESSION_STORAGE);
                localStorage.removeItem(LAST_SESSION_TIME_STORAGE);
            }
        }
    }

    export function keepAlive () {
        var cbs : Listener = {
            handleEvent : function () {
                Application.Login.updateSessionLife();
            }
        };
        Server.Login.requestSession(true, cbs);
    }

    export function setSession (a : string) {
        currentSession = a;
    }

    export function addListener (listener : Listener | Function) {
        trigger.addListener(listener);
    }

    export function getUser () : User {
        return currentUser;
    }

    function triggerListeners () {
        trigger.trigger(isLogged());
    }
}