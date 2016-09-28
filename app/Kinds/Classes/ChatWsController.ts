class ChatWsController implements ChatController {
    private socket : WebsocketController = new WebsocketController(Server.Chat.CHAT_URL);

    private currentRoom : number = null;

    public onReady : Listener = null;

    constructor () {
        this.socket.addOpenListener(<Listener> {
            controller : this,
            handleEvent : function () {
                if (this.controller.onReady !== null) {
                    this.controller.onReady.handleEvent();
                    this.controller.onReady = null;
                }
            }
        });
    }

    public isReady () {
        return this.socket.isReady();
    }

    public start () {
        this.socket.connect();
    }

    public end () {
        this.currentRoom = null;
        this.socket.close();
    }

    public enterRoom (id : number) {
        this.socket.send("room", id);
        this.currentRoom = id;
    }

    public sendStatus (info : PersonaInfo) {
        var status = [];
        status.push(info.typing ? "1" : "0");
        status.push(info.afk ? "1" : "0");
        status.push(info.focused ? "1" : "0");
        this.socket.send("status", status.join(","));
    }

    public sendPersona (info : PersonaInfo) {
        var persona = {
            persona : info.persona,
            avatar : info.avatar
        };

        this.socket.send("persona", JSON.stringify(persona));
    }

    public sendMessage (message : Message) {
        this.socket.send("message", message.exportAsObject());
    }

    public addCloseListener (obj : Listener) {
        this.socket.addCloseListener(obj);
    }

    public addOpenListener (obj : Listener) {
        this.socket.addOpenListener(obj);
    }

    public addMessageListener (type : string, obj : Listener) {
        this.socket.addMessageListener(type, obj);
    }
}