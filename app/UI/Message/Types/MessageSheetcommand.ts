class MessageSheetcommand extends Message {
    public module : string = "sheetcmd";

    public createHTML () {
        return null;
    }
}

MessageFactory.registerMessage(MessageSheetcommand, "sheetcmd", []);