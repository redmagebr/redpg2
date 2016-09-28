module MessageFactory {
    export var messageClasses : { [id : string] : typeof Message} = {};
    var messageSlash : { [slash : string] : typeof SlashCommand} = {};

    /**
     * Registers a message class for later use.
     * Messages are created when users type commands or when the system requires a message by name.
     * @param msg
     * @param id
     * @param slashCommands
     */
    export function registerMessage (msg : typeof Message, id : string, slashCommands : Array<string>) {
        if (messageClasses[id] !== undefined) {
            console.warn("Attempt to overwrite message type at " + id + ". Ignoring. Offending class:", msg);
            return;
        }

        messageClasses[id] = msg;

        for (var i = 0; i < slashCommands.length; i++) {
            if (messageSlash[slashCommands[i]] !== undefined) {
                console.warn("Attempt to overwrite message slash command at " + slashCommands[i] + ". Ignoring. Offending class:", msg);
                continue;
            }
            messageSlash[slashCommands[i]] = msg;
        }
    }

    /**
     * Registers a slashcommand class for later use.
     * SlashCommands are called when users type commands.
     * @param slash
     * @param slashCommands
     */
    export function registerSlashCommand (slash : typeof SlashCommand, slashCommands :Array<string>) {
        for (var i = 0; i < slashCommands.length; i++) {
            if (messageSlash[slashCommands[i]] !== undefined) {
                console.warn("Attempt to overwrite message slash command at " + slashCommands[i] + ". Ignoring. Offending class:", slash);
                continue;
            }
            messageSlash[slashCommands[i]] = slash;
        }
    }

    /**
     * Returns a new instance of Message for the given id. Can return MessageUnknown.
     * @param id
     * @returns {any}
     */
    export function createMessageFromType (id : string) : Message {
        id = id.toLowerCase();
        if (messageClasses[id] !== undefined) {
            return new messageClasses[id]();
        }

        return new MessageUnknown();
    }

    /**
     * Creates examples of every Message class for testing purposes.
     * @returns {Array<Message>}
     */
    export function createTestingMessages () : Array<Message> {
        var list : Array<Message> = [];

        for (var id in messageClasses) {
            var message = new messageClasses[id]();
            list = list.concat(message.makeMockUp());
        }

        return list;
    }

    export function getConstructorFromText (form : string) : typeof SlashCommand {
        var index = form.indexOf(' ');
        if (index !== -1) {
            var slash = form.substr(0, index).toLowerCase();
            var msg = form.substr(index + 1);
        } else {
            var slash = form;
            var msg = "";
        }
        if (messageSlash[slash] !== undefined) {
            return messageSlash[slash];
        }
        return null;
    }

    /**
     * Runs a form through a SlashCommand. Returns a Message if the SlashCommand was valid and for a Message.
     * @param form
     * @returns {any}
     */
    export function createFromText (form : string) : Message {
        var index = form.indexOf(' ');
        if (index !== -1) {
            var slash = form.substr(0, index).toLowerCase();
            var msg = form.substr(index + 1);
        } else {
            var slash = form;
            var msg = "";
        }
        if (messageSlash[slash] !== undefined) {
            var command = new messageSlash[slash]();
            var valid = command.receiveCommand(slash, msg);
            if (valid && command.isMessage()) {
                return <Message> command;
            } else if (!valid) {
                var errorHTML = command.getInvalidHTML(slash, msg);
                if (errorHTML !== null) UI.Chat.printElement(errorHTML);
                return null;
            }
        }

        var error = new ChatSystemMessage(true);
        error.addText("_CHATINVALIDCOMMAND_");
        UI.Chat.printElement(error.getElement());

        return null;
    }
}