class SlashCommands extends SlashCommand {
    /**
     * Returns false for invalid commands. Returns true for valid commands.
     * @param slashCommand
     * @param message
     */
    public receiveCommand (slashCommand : string , message : string) : boolean {
        var room = Server.Chat.getRoom();
        if (room === null) return false;

        let commands = MessageFactory.getCommandsAndSlashes();

        var msg = new ChatSystemMessage(true);
        msg.addText("_CHATHELPCOMMANDSINTRO_");

        for (let i = 0; i < commands.length; i++) {
            let name = commands[i][0].name.toUpperCase();
            let slashes = <Array<string>> commands[i][1];
            msg.addLineBreak();
            msg.addLineBreak();
            msg.addText(slashes[0] + ": ");
            msg.addText("_CHATHELP" + name + "_");
            msg.addText(" [" + slashes.join("; ") + "]");
            UI.Chat.printElement(msg.getElement());
        }

        return true;
    }
}

MessageFactory.registerSlashCommand (SlashCommands, ["/help", "/ajuda", "/comandos", "/commands", "/howdo", "/comofas"]);