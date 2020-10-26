module Server {
    export var IMAGE_URL : string = "https://img.redpg.com.br/";
    export var APPLICATION_URL:string = "https://app.redpg.com.br/service/";
    export var CLIENT_URL:string = "https://app.redpg.com.br/";
    export var WEBSOCKET_SERVERURL:string = "wss://app.redpg.com.br";

    if (window.location.hostname.indexOf("beta") === 0) {
        APPLICATION_URL = "https://beta.redpg.com.br/service/";
        CLIENT_URL = "https://beta.redpg.com.br/";
        WEBSOCKET_SERVERURL = "wss://beta.redpg.com.br";
    }

    export var WEBSOCKET_CONTEXT : string = "/service/";
    export var WEBSOCKET_PORTS : Array<number> = [443];

    // export var APPLICATION_URL : string = "http://localhost:8080/RedPG/";
    // export var WEBSOCKET_SERVERURL : string = "ws://localhost";
    // export var WEBSOCKET_CONTEXT : string = "/RedPG/";
    //export var WEBSOCKET_PORTS : Array<number> = [8080];

    //export var APPLICATION_URL : string = "http://93.188.167.121/service/";
    //export var WEBSOCKET_SERVERURL : string = "ws://93.188.167.121";
    //export var WEBSOCKET_CONTEXT : string = "/service/";
    //export var WEBSOCKET_PORTS : Array<number> = [80, 8080, 8081];

    Application.Config.registerConfiguration("wsPort", new WsportConfiguration(WEBSOCKET_PORTS[0]));

    export function getWebsocketURL () : string {
        return WEBSOCKET_SERVERURL + ":" + Application.Config.getConfig("wsPort").getValue() + WEBSOCKET_CONTEXT;
    }
}