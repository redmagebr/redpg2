/**
 * Created by Reddo on 14/09/2015.
 */
module Server.AJAX {
    export function requestPage (ajax : AJAXConfig, success : Listener | Function, error : Listener | Function) {
        var url = ajax.url;
        // Relative URL?
        if (url.indexOf("://") === -1) {
            url = Server.APPLICATION_URL + url;

            // Include session in link?
            if (Application.Login.hasSession()) {
                url += ';jsessionid=' + Application.Login.getSession();
            }
        }

        var xhr = new XMLHttpRequest();
        var method = ajax.data !== null ? "POST" : "GET";
        xhr.open(method, <string> url, true);
        xhr.responseType = ajax.responseType;

        xhr.addEventListener("loadend", {
            ajax : ajax,
            handleEvent : function (e : Event) {
                console.debug("AJAX request for " + this.ajax.url + " is complete.");
                this.ajax.finishConditionalLoading();
            }
        });

        xhr.addEventListener("load", {
            xhr : xhr,
            ajax : ajax,
            success : success,
            error : error,
            handleEvent : function (e) {
                if (this.xhr.status >= 200 && this.xhr.status < 300) {
                    console.debug("[SUCCESS " + this.xhr.status + "]: AJAX (" + this.ajax.url + ")...", this.xhr);
                    if (typeof this.success === 'function') {
                        (<Function> this.success)(this.xhr.response, this.xhr);
                    } else {
                        (<Listener> this.success).handleEvent(this.xhr.response, this.xhr);
                    }
                } else {
                    console.error("[ERROR " + this.xhr.status + "]: AJAX (" + this.ajax.url + ")...", this.xhr);

                    if (this.xhr.status === 401) {
                        Server.Login.requestSession(false);
                    }

                    if (typeof this.error === 'function') {
                        (<Function> this.error)(this.xhr.response, this.xhr);
                    } else {
                        (<Listener> this.error).handleEvent(this.xhr.response, this.xhr);
                    }
                }
            }
        });

        xhr.addEventListener("error", {
            xhr : xhr,
            ajax : ajax,
            error : error,
            handleEvent : function (e : Event) {
                console.error("[ERROR] AJAX call for " + this.ajax.url + " resulted in network error. Event, XHR:", e, this.xhr);
                if (typeof this.error === 'function') {
                    (<Function> this.error)(this.xhr.response, this.xhr);
                } else {
                    (<Listener> this.error).handleEvent(this.xhr.response, this.xhr);
                }
            }
        });

        ajax.startConditionalLoading();

        if (ajax.data !== null) {
            var data = {};

            for (var key in ajax.data) {
                if (typeof ajax.data[key] === "number" || typeof ajax.data[key] === "string") {
                    data[key] = ajax.data[key];
                } else {
                    data[key] = JSON.stringify(ajax.data[key]);
                }
            }

            console.debug("Ajax request for " + url + " includes Data. Data:", data);

            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send($.param(data));
        } else {
            xhr.send();
        }
    }
}