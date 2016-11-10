class MemoryCutscene extends TrackerMemory {
    private chatAllowed : boolean = true;
    private static button = document.getElementById("chatHollywood");

    constructor () {
        super();
        MemoryCutscene.button.addEventListener("click", <EventListenerObject> {
            cutscene : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.cutscene.click();
            }
        });
    }

    public click () {
        if (Server.Chat.getRoom().getMe().isStoryteller()) {
            this.storeValue(!this.getValue());
            if (!this.getValue()) {
                var msg = new ChatSystemMessage(true);
                msg.addText("_CHATSHHHHHWEHOLLYWOODACTIVE_");
                UI.Chat.printElement(msg.getElement());
            } else {
                var msg = new ChatSystemMessage(true);
                msg.addText("_CHATSHHHHHWEHOLLYWOODINACTIVE_");
                UI.Chat.printElement(msg.getElement());
            }
            //The button already shows the change, let's not ruin the cutscene by printing a warning
            //MessageCutscene.sendNotification(this.getValue());
        }
    }

    public reset () {
        this.chatAllowed = true;
    }

    public storeValue (v : boolean | number) {
        var allowed = v === true || v === 1;
        if (allowed !== this.chatAllowed) {
            this.chatAllowed = allowed;
            this.triggerChange();
            if (this.getValue()) {
                MemoryCutscene.button.classList.add("icons-chatHollywood");
                MemoryCutscene.button.classList.remove("icons-chatHollywoodOff");
            } else {
                MemoryCutscene.button.classList.remove("icons-chatHollywood");
                MemoryCutscene.button.classList.add("icons-chatHollywoodOff");
            }
        }
    }

    public getValue () {
        return this.chatAllowed;
    }

    public exportAsObject () {
        return this.chatAllowed ? 1 : 0;
    }
}