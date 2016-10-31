class MessageCutscene extends Message {
    public module : string = "csc";

    public createHTML () : HTMLElement {
        if (!this.getUser().isStoryteller() || this.getUser().getUser().isMe()) {
            return null;
        }

        var msg = new ChatSystemMessage(true);

        if (this.getMsg() === "1") {
            msg.addText("_CHATSHHHHHWEHOLLYWOODTURNDOWN_");
        } else {
            msg.addText("_CHATSHHHHHWEHOLLYWOODTURNUP_");
        }

        return msg.getElement();
    }

    public static sendNotification (chatAllowed : boolean) {
        var newMessage = new MessageCutscene();
        newMessage.setMsg(chatAllowed ? "1" : "0");
        UI.Chat.sendMessage(newMessage);
    }
}

MessageFactory.registerMessage(MessageCutscene, "csc", []);