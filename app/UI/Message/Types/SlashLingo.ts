class SlashLingo extends SlashCommand {
    /**
     * Returns false for invalid commands. Returns true for valid commands.
     * @param slashCommand
     * @param message
     */
    public receiveCommand (slashCommand : string , message : string) : boolean {
        var storyMode = slashCommand.toLowerCase().indexOf("sto") !== -1;
        if (storyMode && !Server.Chat.getRoom().getMe().isStoryteller()) {
            return false;
        }

        var wantedLingo = message.substring(0, message.indexOf(','));
        var lingo = PseudoLanguage.getLanguage(wantedLingo);

        if (lingo === null) {
            return false;
        }

        var mem = <MemoryLingo> Server.Chat.Memory.getConfiguration("Lingo");
        if (!Server.Chat.getRoom().getMe().isStoryteller() && !mem.isSpeaker(Server.Chat.getRoom().getMe().getUser().id, wantedLingo)) {
            return false;
        }

        var sentence = message.substring(message.indexOf(',') + 1, message.length).trim();

        var beginners = ['*', '[', '{', '('];
        var enders = ['*', ']', '}', ')'];

        var endResult = "";
        var currentSentence = "";
        var waitingFor = null;

        for (var i = 0; i < sentence.length; i++) {
            var character = sentence.charAt(i);
            if (waitingFor !== null) {
                currentSentence += character;
                if (character === waitingFor) {
                    endResult += currentSentence;
                    currentSentence = "";
                    waitingFor = null;
                }
            } else {
                var idx = beginners.indexOf(character);
                if (idx === -1) {
                    currentSentence += character;
                } else {
                    waitingFor = enders[idx];
                    if (currentSentence.length > 0) {
                        endResult += lingo.translate(currentSentence);
                    }
                    currentSentence = character;
                }
            }
        }

        if (currentSentence.length > 0) {
            endResult += lingo.translate(currentSentence);
        }

        //alert(endResult);

        var translatedMsg : Message;
        var pseudoMsg : Message;
        if (storyMode) {
            translatedMsg = new MessageStory();
            pseudoMsg = new MessageStory();
        } else {
            translatedMsg = new MessageRoleplay();
            pseudoMsg = new MessageRoleplay();
        }

        translatedMsg.setMsg(endResult);
        translatedMsg.findPersona();
        translatedMsg.setSpecial("translation", sentence);
        translatedMsg.setSpecial("language", wantedLingo);
        pseudoMsg.setMsg(endResult);
        pseudoMsg.setSpecial("language", wantedLingo);
        pseudoMsg.findPersona();

        var speakers = mem.getSpeakers(wantedLingo);

        translatedMsg.addDestinationStorytellers(Server.Chat.getRoom());
        for (var i = 0; i < speakers.length; i++) {
            translatedMsg.addDestination(speakers[i].getUser());
        }

        pseudoMsg.setSpecial("ignoreFor", translatedMsg.getDestinationArray());

        UI.Chat.sendMessage(translatedMsg);
        UI.Chat.sendMessage(pseudoMsg);

        return true;
    }

    /**
     * HTMLElement that should be printed when receiveCommand returns false.
     * @param slashCommand
     * @param msg
     * @returns {HTMLElement|null}
     */
    public getInvalidHTML (slashCommand : string, message : string) : HTMLElement {
        var smsg = new ChatSystemMessage(true);
        if (slashCommand.toLowerCase().indexOf("sto") !== -1 && !Server.Chat.getRoom().getMe().isStoryteller()) {
            smsg.addText("_SLASHLINGOINVALIDONLYGM_");
        } else {
            var wantedLingo = message.substring(0, message.indexOf(','));
            var lingo = PseudoLanguage.getLanguage(wantedLingo);
            var mem = <MemoryLingo> Server.Chat.Memory.getConfiguration("Lingo");
            if (lingo === null) {
                smsg.addText("_SLASHLINGOINVALIDNOSUCHLINGO_");
            } else if (!Server.Chat.getRoom().getMe().isStoryteller() && !mem.isSpeaker(Server.Chat.getRoom().getMe().getUser().id, wantedLingo)) {
                smsg.addText("_SLASHLINGOINVALIDYOUKNOWNOTHINGINNOCENT_");
            } else {
                smsg.addText("_SLASHLINGOINVALID_");
            }
        }

        return smsg.getElement();
    }
}

MessageFactory.registerSlashCommand (SlashLingo, ["/lang", "/ling", "/lingo", "/language", "/lingua"]);