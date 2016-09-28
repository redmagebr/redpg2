interface ChatController {
    start () : void;
    enterRoom (id : number) : void;
    sendStatus (info : PersonaInfo) : void;
    sendPersona (info : PersonaInfo) : void;
    sendMessage (message : Message) : void;
    addCloseListener (obj : Listener) : void;
    addOpenListener (obj : Listener) : void;
    addMessageListener (type : string, obj : Listener) : void;
    isReady () : boolean;
    onReady : Listener;
    end () : void;
}