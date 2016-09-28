module Server.Login {
    var ACCOUNT_URL = "Account";

    /**
     * Requests session information from the server. Renews login information on success, logs out on error.
     * @param silent
     * @param cbs
     * @param cbe
     */
    export function requestSession (silent : boolean, cbs? : Listener, cbe? : Listener) {
        var success : Listener = <Listener> {
            cbs : cbs,
            cbe : cbe,
            handleEvent : function (response, xhr) {
                if (response.user !== undefined || response.logged === true) {
                    if (response.user !== undefined) {
                        Application.Login.receiveLogin(response.user, response.session);
                        if (response.user.config !== undefined) {
                            Application.Config.updateFromObject(response.user.config);
                        }
                    } else {
                        Application.Login.updateSessionLife();
                    }

                    if (this.cbs !== undefined) {
                        this.cbs.handleEvent(response, xhr);
                    }
                } else {
                    Application.Login.logout();
                    if (this.cbe !== undefined) this.cbe.handleEvent(response, xhr);
                }
            }
        };

        var error : Listener = <Listener> {
            cbe : cbe,
            handleEvent : function (response, xhr) {
                Application.Login.logout();

                if (this.cbe !== undefined) {
                    this.cbe.handleEvent(response, xhr);
                }
            }
        };

        var ajax = new AJAXConfig(ACCOUNT_URL);
        ajax.setResponseTypeJSON();

        if (silent) {
            ajax.data = {action : "requestSession"};
            ajax.setTargetNone();
        } else {
            ajax.data = {action : "login"};
            ajax.setTargetGlobal();
        }

        Server.AJAX.requestPage(ajax, success, error);
    }

    /**
     * Attempts to log in with information provided. Sets up login information on success. Runs cbe, if available, on failure.
     * @param email
     * @param password
     * @param cbs
     * @param cbe
     */
    export function doLogin (email : string, password : string, cbs? : Listener, cbe? : Listener) {
        var success : Listener = <Listener> {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                Application.Login.receiveLogin(response.user, response.session);

                if (response.user !== undefined && response.user.config !== undefined) {
                    Application.Config.updateFromObject(response.user.config);
                }

                if (this.cbs !== undefined) {
                    this.cbs.handleEvent(response, xhr);
                }
            }
        };

        var ajax = new AJAXConfig(ACCOUNT_URL);

        ajax.data = {
            login : email,
            password : password,
            action : "login"
        };

        ajax.setResponseTypeJSON();
        ajax.setTargetGlobal();

        Server.AJAX.requestPage(ajax, success, cbe);
    }

    /**
     * Attempts to log out from current session. Logs out on success.
     * @param cbs
     * @param cbe
     */
    export function doLogout (cbs? : Listener, cbe? : Listener) {
        var success : Listener = <Listener> {
            cbs : cbs,
            handleEvent : function (response, xhr) {
                Application.Login.logout();

                if (this.cbs !== undefined) {
                    this.cbs.handleEvent(response, xhr);
                }
            }
        };

        var error : Listener = <Listener> {
            cbe : cbe,
            handleEvent : function (response, xhr) {
                console.error("[ERROR] Failure while attempting to logout.");

                if (this.cbe !== undefined) {
                    this.cbe.handleEvent(response, xhr);
                }
            }
        };

        var ajax = new AJAXConfig(ACCOUNT_URL);
        ajax.data = {action : "logout"};
        ajax.setResponseTypeJSON();
        ajax.setTargetGlobal();

        Server.AJAX.requestPage(ajax, success, error);
    }
}