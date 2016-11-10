class MemoryCombat extends TrackerMemory {
    private combatants : Array<CombatParticipant> = [];
    private round : number = 0;
    private turn : number = 0;

    private targets : Array<number> = [];
    private targetTrigger = new Trigger();

    public addTargetListener (f : Function | Listener) {
        this.targetTrigger.addListener(f);
    }

    public removeTargetListener (f : Function | Listener) {
        this.targetTrigger.removeListener(f);
    }

    public triggerTarget () {
        this.targetTrigger.trigger(this.targets);
    }

    public getCurrentTurnOwner () : CombatParticipant {
        if (this.combatants[this.turn] !== undefined) {
            return this.combatants[this.turn];
        }
        return null;
    }

    public cleanTargets () {
        var goodTargets : Array<number> = [];
        for (var i = 0; i < this.targets.length; i++) {
            var target : number = this.targets[i];
            for (var k = 0; k < this.combatants.length; k++) {
                if (this.combatants[i].id === target) {
                    goodTargets.push(target);
                    break;
                }
            }
        }
        this.targets = goodTargets;
    }

    public getTargets () {
        return this.targets;
    }

    public isTarget (id : number) {
        return this.targets.indexOf(id) !== -1;
    }

    public setTarget (id : number) {
        var idx = this.targets.indexOf(id);
        if (idx === -1) {
            this.targets.push(id);
        } else {
            this.targets.splice(idx, 1);
        }
        this.triggerTarget();
    }

    public endCombat () {
        this.round = 0;
        this.turn = 0;

        var remove = [];
        for (var i = 0; i < this.combatants.length; i++) {
            if (this.combatants[i].owner === 0) {
                remove.push(this.combatants[i]);
            }
        }
        for (var i = 0; i < remove.length; i++) {
            this.removeParticipant(remove[i]);
        }

        this.triggerChange();
    }

    public getRound () {
        return this.round;
    }

    public getTurn () {
        return this.turn;
    }

    public getCombatants () {
        return this.combatants;
    }

    public reset () {
        this.combatants = [];
        this.round = 0;
        this.turn = 0;

        this.triggerChange();
    }

    public removeParticipant (c : CombatParticipant) {
        var idx = this.combatants.indexOf(c);
        if (idx !== -1) {
            this.combatants.splice(idx, 1);
            this.triggerChange();
        }
    }

    public reorderCombatants () {
        this.combatants.sort(function (a : CombatParticipant, b : CombatParticipant) {
            return b.initiative - a.initiative;
        });
    }

    public addParticipant (sheet : SheetInstance, owner? : User) {
        var combatant = new CombatParticipant();
        combatant.setSheet(sheet);
        if (owner !== undefined) {
            combatant.setOwner(owner.id);
        }
        this.combatants.push(combatant);
        this.reorderCombatants();
        this.triggerChange();
    }

    public incrementRound () {
        this.round++;
        this.turn = 0;
        this.triggerChange();
    }

    public setTurn (combatant : CombatParticipant) {
        var idx = this.combatants.indexOf(combatant);
        if (idx !== -1 && idx !== this.turn) {
            this.turn = idx;
            this.triggerChange();
        }
    }

    public incrementTurn () {
        this.turn++;
        if ((this.turn + 1) > this.combatants.length) {
            this.turn = 0;
            this.round++;
        }
        this.triggerChange();
    }

    public exportAsObject () {
        var arr : Array<any> = [this.round, this.turn];

        var combatants = [];

        for (var i = 0; i <this.combatants.length; i++) {
            combatants.push(this.combatants[i].exportAsObject());
        }

        arr.push(combatants);

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
            this.reorderCombatants();

            var newJson = JSON.stringify(this.exportAsObject());
            if (newJson !== oldJson) {
                this.triggerChange();
            }
        }
    }

    public setInitiative (combatant : CombatParticipant, initiative : number) {
        var idx = this.combatants.indexOf(combatant);
        if (idx !== -1) {
            combatant.setInitiative(initiative);
            this.reorderCombatants();
            this.triggerChange();
        }
    }

    public getValue () {
        return null;
    }
}