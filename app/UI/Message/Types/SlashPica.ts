class SlashPica extends SlashCommand {
    /**
     * Returns false for invalid commands. Returns true for valid commands.
     * @param slashCommand
     * @param message
     */
    public receiveCommand (slashCommand : string , message : string) : boolean {
        var room = Server.Chat.getRoom();
        if (room === null) return false;

        var link = "images/GreatBigPica.png?code=";

        message = message.trim();
        var code = message;
        if (code == "") {
            code = 'xxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        link += encodeURIComponent(code);

        if (message == "") {
            message = UI.Language.getLanguage().getLingo("_SLASHPICANONAME_");
        }

        MessageImage.shareLink(message, link);

        return true;
    }
}

MessageFactory.registerSlashCommand (SlashPica, ["/pica", "/quadro", "/board", "/desenho", "/drawing"]);