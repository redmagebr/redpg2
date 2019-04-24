class SlashClear extends SlashCommand {
    public receiveCommand (slashCommand : string , message : string) : boolean {
        if (message.trim() == "1") {
            if (confirm(UI.Language.getLanguage().getLingo("_REALLYDELETEMESSAGESFOREVER_"))) {
                Server.Chat.clearForever(Server.Chat.getRoom().id, {handleEvent : () => {UI.Chat.clearRoom();}});
            }
        } else {
            UI.Chat.clearRoom();
        }
        return true;
    }
}

MessageFactory.registerSlashCommand (SlashClear, ["/clear", "/clr", "/cls"]);