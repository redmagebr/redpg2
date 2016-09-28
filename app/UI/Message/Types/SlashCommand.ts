class SlashCommand {
    /**
     * Returns false for invalid commands. Returns true for valid commands.
     * @param slashCommand
     * @param message
     */
    public receiveCommand (slashCommand : string , message : string) : boolean {
        console.error("SlashCommand.receiveCommand is abstract. Offending class:", this.constructor['name'], this);
        return false;
    }

    /**
     * Informs MessageFactory whether this SlashCommand is a message or not. Probably doesn't have to be changed.
     * @returns {boolean}
     */
    public isMessage () : boolean {
        return this instanceof Message;
    }

    /**
     * HTMLElement that should be printed when receiveCommand returns false.
     * @param slashCommand
     * @param msg
     * @returns {HTMLElement|null}
     */
    public getInvalidHTML (slashCommand : string, msg : string) : HTMLElement {
        return null;
    }
}