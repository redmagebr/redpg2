class SlashImages extends SlashCommand {
    /**
     * Returns false for invalid commands. Returns true for valid commands.
     * @param slashCommand
     * @param message
     */
    public receiveCommand (slashCommand : string , message : string) : boolean {
        var room = Server.Chat.getRoom();
        if (room === null) return false;

        var messages = MessageImage.getLastImages(room.id);

        if (messages.length > 0) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATIMAGESPRINTINGIMAGES_");
            UI.Chat.printElement(msg.getElement());
            MessageImage.stopAutomation();
            for (var i = messages.length - 1; i >= 0; i--) {
                UI.Chat.printMessage(messages[i]);
            }
            MessageImage.resumeAutomation();
        } else {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATIMAGESNOIMAGES_");
            UI.Chat.printElement(msg.getElement());
        }

        return true;
    }
}

MessageFactory.registerSlashCommand (SlashImages, ["/images", "/imgs", "/imagens", "/fotos", "/picas"]);