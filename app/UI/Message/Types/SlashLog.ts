class SlashLog extends SlashCommand {
    /**
     * Returns false for invalid commands. Returns true for valid commands.
     * @param slashCommand
     * @param message
     */
    public receiveCommand (slashCommand : string , message : string) : boolean {
        var cbs = <EventListenerObject> {
            room : Server.Chat.getRoom(),
            handleEvent : function () {
                UI.Logger.callSelf(this.room);
            }
        };
        Server.Chat.getAllMessages(Server.Chat.getRoom().id, cbs);
        return true;
    }
}

MessageFactory.registerSlashCommand (SlashLog, ["/log", "/logger"]);