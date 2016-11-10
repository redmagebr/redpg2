class ChatCombatRow {
    private visible = document.createElement("div");
    private combatant : CombatParticipant;
    private input : HTMLInputElement;

    constructor (combatant : CombatParticipant, currentTurn : boolean, currentTarget : boolean, isStoryteller : boolean) {
        this.combatant = combatant;

        this.visible.classList.add("combatRow");
        if (currentTurn) this.visible.classList.add("currentTurn");
        if (currentTarget) this.visible.classList.add("currentTarget");

        if (isStoryteller) {
            var remove = document.createElement("a");
            remove.classList.add("combatRemove", "language");
            UI.Language.addLanguageTitle(remove, "_COMBATTRACKERREMOVE_");
            remove.addEventListener("click", (function (e) {
                e.preventDefault();
                this.remove();
            }).bind(this));

            this.visible.appendChild(remove);
        }

        var span = document.createElement("span");
        span.classList.add("combatName");
        span.appendChild(document.createTextNode(combatant.name));
        this.visible.appendChild(span);

        var input = document.createElement("input");
        input.classList.add("combatRowInitiative");
        input.value = combatant.initiative.toString();
        this.input = input;
        this.visible.appendChild(input);
        this.input.disabled = !isStoryteller;

        if (isStoryteller) {
            input.addEventListener("change", (function () {
                this.change();
            }).bind(this));

            // TURN!!!!!!!!!!!!!!
            var turn = document.createElement("a");
            turn.classList.add("combatSetTurn", "language");
            UI.Language.addLanguageTitle(turn, "_COMBATTRACKERSETTURN_");
            turn.addEventListener("click", (function (e) {
                e.preventDefault();
                this.setTurn();
            }).bind(this));

            this.visible.appendChild(turn);
        }

        // TARGET!!!!
        var target = document.createElement("a");
        target.classList.add("combatTarget", "language");
        UI.Language.addLanguageTitle(target, "_COMBATTRACKERSETTARGET_");
        target.addEventListener("click", (function (e) {
            e.preventDefault();
            this.setTarget();
        }).bind(this));

        this.visible.appendChild(target);

        // SHEET!!!!!!!
        if (isStoryteller || Application.isMe(this.combatant.owner)) {
            var sheet = document.createElement("a");
            sheet.classList.add("combatSheet", "language");
            UI.Language.addLanguageTitle(sheet, "_COMBATTRACKERSHEET_");
            sheet.addEventListener("click", (function (e) {
                e.preventDefault();
                this.openSheet();
            }).bind(this));

            this.visible.appendChild(sheet);
        }

        UI.Language.updateScreen(this.visible);
    }

    public getHTML () {
        return this.visible;
    }

    public change () {
        var value = Number(this.input.value);
        if (!isNaN(value)) {
            var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");
            memory.setInitiative(this.combatant, value);
        } else {
            UI.Chat.Combat.update();
        }
    }

    public remove () {
        var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");
        memory.removeParticipant(this.combatant);
    }

    public setTurn () {
        var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");
        memory.setTurn(this.combatant);
        UI.Chat.Combat.announceTurn();
    }

    public setTarget () {
        var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");
        memory.setTarget(this.combatant.id);
    }

    public openSheet () {
        UI.Sheets.SheetManager.openSheetId(this.combatant.id);
    }
}