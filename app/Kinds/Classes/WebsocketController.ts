class WebsocketController {
    private url : string;
    private socket : WebSocket = null;
    private keepAlive : boolean = true;
    private keepAliveTime : number = 15 * 1000;
    private keepAliveInterval = null;

    private static READYSTATE_CONNECTING : number = 0;
    private static READYSTATE_OPEN : number = 1;
    private static READYSTATE_CLOSING : number = 2;
    private static READYSTATE_CLOSED : number = 3;

    private onOpen : Array<Listener> = [];
    private onClose : Array<Listener> = [];
    private onMessage : Array<Listener> = [];
    private onError : Array<Listener> = [];

    constructor (url : string) {
        this.url = url;
    }

    public connect () {
        if (this.isReady()) {
            console.warn("[WEBSOCKET] Attempt to connect a WebSocket that was already connected. Disconnecting first.");
            this.close();
        }
        var url = Server.getWebsocketURL() + this.url;
        if (Application.Login.hasSession()) {
            url += ';jsessionid=' + Application.Login.getSession();
        }
        this.socket = new WebSocket(url);

        this.socket.addEventListener("open", {
            controller : this,
            handleEvent: function (e) {
                this.controller.resetInterval();
                this.controller.triggerOpen();
                console.debug("[WEBSOCKET] " + this.controller.url + ": Open.", e);
            }
        });

        this.socket.addEventListener("error", {
            controller : this,
            handleEvent: function (e) {
                console.error("[WEBSOCKET] " + this.controller.url + ": Error.", e);
            }
        });

        this.socket.addEventListener("message", {
            controller : this,
            handleEvent: function (e : MessageEvent) {
                this.controller.resetInterval();
                if (e.data !== "1" && e.data.indexOf("[\"status") !== 0) console.debug("[WEBSOCKET] " + this.controller.url + ": Message: ", e);
                this.controller.triggerMessage(e);
            }
        });

        this.socket.addEventListener("close", {
            controller : this,
            handleEvent: function (e) {
                this.controller.disableInterval();
                this.controller.triggerClose();
                console.warn("[WEBSOCKET] " + this.controller.url + ": Closed.", e);
            }
        });
    }

    public isReady () {
        return this.socket !== null && this.socket.readyState === WebsocketController.READYSTATE_OPEN;
    }

    public resetInterval () {
        if (this.keepAlive) {
            if (this.keepAliveInterval !== null) {
                clearInterval(this.keepAliveInterval);
            }

            var interval = function (controller) {
                controller.doKeepAlive();
            };
            this.keepAliveInterval = setInterval(interval.bind(null, this), this.keepAliveTime);
        }
    }

    public disableInterval () {
        if (this.keepAliveInterval !== null) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
    }

    public doKeepAlive () {
        this.socket.send("0");
    }

    public send (action : string, obj : any) {
        if (this.isReady()) {
            if (typeof obj !== "string") {
                obj = JSON.stringify(obj);
            }
            this.socket.send(action + ";" + obj);
            if (action !== "status") console.debug("[WEBSOCKET] Message sent:", action + ";" + obj);
        } else {
            console.warn("[WEBSOCKET] Attempt to send messages through a WebSocket that isn't ready. Ignoring. Offending message: ", action, obj);
        }
    }

    public close () {
        if (this.socket !== null && (this.socket.readyState === WebsocketController.READYSTATE_CONNECTING || this.socket.readyState === WebsocketController.READYSTATE_OPEN)) {
            this.socket.close();
        }
    }

    public addCloseListener (obj : Listener) {
        this.onClose.push(obj);
    }

    public addOpenListener (obj : Listener) {
        this.onOpen.push(obj);
    }

    public addMessageListener (type : string, obj : Listener) {
        this.onMessage.push(<Listener> {
            type : type,
            obj : obj,
            handleEvent : function (e : MessageEvent) {
                var response = JSON.parse(e.data);
                if (Array.isArray(response) && response[0] === this.type) {
                    obj.handleEvent(response);
                }
            }
        });
    }

    public triggerOpen () {
        for (var i = 0; i < this.onOpen.length; i++) {
            this.onOpen[i].handleEvent();
        }
    }

    public triggerClose () {
        for (var i = 0; i < this.onClose.length; i++) {
            this.onClose[i].handleEvent();
        }
    }

    public triggerMessage (e : MessageEvent) {
        for (var i = 0; i < this.onMessage.length; i++) {
            this.onMessage[i].handleEvent(e);
        }
    }
}