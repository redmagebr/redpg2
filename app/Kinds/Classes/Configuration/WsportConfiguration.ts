class WsportConfiguration extends Configuration {
    public setFunction = function (value : number) {
        if (Server.WEBSOCKET_PORTS.indexOf(value) === -1) {
            this.value = Server.WEBSOCKET_PORTS[0];
        } else {
            this.value = value;
        }
    }
}