class MessageStream extends Message {
    public module : string = "stream";

    public createHTML () {
        return null;
    }
}

MessageFactory.registerMessage(MessageStream, "stream", []);