class MemoryCombat extends TrackerMemory {
    private combatants : Array<CombatParticipant> = [];
    private round : number = 0;
    private turn : number = 0;

    public reset () {
        this.combatants = [];
        this.round = 0;
        this.turn = 0;

        this.triggerChange();
    }

    public addParticipant (sheet : SheetInstance, owner? : User) {
        var combatant = new CombatParticipant();
        combatant.setSheet(sheet);
        if (owner !== undefined) {
            combatant.setOwner(owner.id);
        }
        this.combatants.push(combatant);
    }

    public incrementRound () {
        this.round++;
        this.turn = 0;
    }

    public incrementTurn () {
        this.turn++;
        if ((this.turn + 1) > this.combatants.length) {
            this.turn = 0;
            this.round++;
        }
    }

    public exportAsObject () {
        var arr = [this.round, this.turn];

        var combatants = [];

        for (var i = 0; i <this.combatants.length; i++) {
            combatants.push(this.combatants[i].exportAsObject());
        }

        return arr;
    }

    public storeValue (obj : any) {
        if (!Array.isArray(obj) || obj.length !== 3) {
            this.reset();
        } else {
            var oldJson = JSON.stringify(this.exportAsObject());

            this.round = obj[0];
            this.turn = obj[1];
            this.combatants = [];

            if (Array.isArray(obj[2]) && obj[2].length > 0) {
                for (var i = 0; i < obj[2].length; i++) {
                    var combatant = new CombatParticipant();
                    combatant.updateFromObject(obj[2][i]);
                    if (combatant.id !== 0) {
                        this.combatants.push(combatant);
                    }
                }
            }

            var newJson = JSON.stringify(this.exportAsObject());
            if (newJson !== oldJson) {
                this.triggerChange();
            }
        }
    }

    public getValue () {
        return null;
    }
}