class MemoryCombat extends TrackerMemory {
    private combatants : Array<CombatParticipant> = [];
    private effects : { [id : number] : Array<CombatEffect>} = {};
    private storedEffects : { [id : number] : Array<string>} = {};
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

    public getEffects () {
        return this.effects;
    }

    public getEffectsOn (id : number) : Array<CombatEffect> {
        if (this.effects[id] !== undefined) {
            return this.effects[id];
        }
        return [];
    }

    public removeEffect (ce : CombatEffect) {
        if (this.effects[ce.target] !== undefined) {
            this.effects[ce.target].splice(this.effects[ce.target].indexOf(ce), 1);

            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATCOMBATEFFECTENDED_");
            msg.addLangVar("a", ce.name);
            msg.addLangVar("b", ce.getTargetName());
            UI.Chat.printElement(msg.getElement());

            this.triggerChange();
        }
    }

    public addCombatEffect (effect : CombatEffect) {
        if (this.effects[effect.target] === undefined) {
            this.effects[effect.target] = [effect];
        } else {
            this.effects[effect.target].push(effect);
        }
        this.triggerChange();
    }

    public addEffect (ce : CombatEffectInfo) {
        var effect = new CombatEffect(this);
        effect.name = ce.name;
        effect.target = ce.target;
        effect.roundEnd = ce.roundEnd;
        effect.turnEnd = ce.turnEnd;
        effect.endOnStart = ce.endOnStart;
        effect.customString = ce.customString === undefined ? null : ce.customString;

        this.addCombatEffect(effect);
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

    public getTargetCombatants () {
        var targets = [];
        for (var i = 0; i < this.targets.length; i++) {
            for (var k = 0; k < this.combatants.length; k++) {
                if (this.combatants[k].id === this.targets[i]) {
                    targets.push(this.combatants[k]);
                }
            }
        }
        return targets;
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

        this.effects = {};

        this.triggerChange();
    }

    public getRound () {
        return this.round;
    }

    public getTurn () {
        return this.turn;
    }

    public getRoundFor (id : number) {
        for (var i = 0; i < this.combatants.length; i++) {
            if (this.combatants[i].id === id) {
                return i;
            }
        }
        return null;
    }

    public getCombatants () {
        return this.combatants;
    }

    public getMyCombatants () {
        var combatants = [];

        for (var i = 0; i < this.combatants.length; i++) {
            if (Application.isMe(this.combatants[i].owner) && combatants.indexOf(this.combatants[i]) === -1) {
                combatants.push(this.combatants[i]);
            }
        }

        return combatants;
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

    public considerEndingEffects () {
        for (var id in this.effects) {
            for (var i = this.effects[id].length - 1; i >= 0; i--) {
                this.effects[id][i].considerEnding();
            }
        }
    }

    public setTurn (combatant : CombatParticipant) {
        var idx = this.combatants.indexOf(combatant);
        if (idx !== -1 && idx !== this.turn) {
            this.turn = idx;
            this.considerEndingEffects();
            this.triggerChange();
        }
    }

    public incrementTurn () {
        this.turn++;
        if ((this.turn + 1) > this.combatants.length) {
            this.turn = 0;
            this.round++;
        }
        this.considerEndingEffects();
        this.triggerChange();
    }

    public exportAsObject () {
        var arr : Array<any> = [this.round, this.turn];

        var combatants = [];

        for (var i = 0; i < this.combatants.length; i++) {
            combatants.push(this.combatants[i].exportAsObject());
        }

        arr.push(combatants);

        var effects = [];

        for (var id in this.effects) {
            var effect : Array<any> = [Number(id)];
            for (var i = 0; i < this.effects[id].length; i++) {
                effect.push(this.effects[id][i].exportAsObject());
            }

            effects.push(effect);
        }

        arr.push(effects);

        return arr;
    }

    public storeEffectNames () {
        this.storedEffects = {};

        for (var id in this.effects) {
            this.storedEffects[id] = [];
            for (var k = 0; k < this.effects[id].length; k++) {
                this.storedEffects[id].push(this.effects[id][k].name);
            }
        }
    }

    public announceEffectEnding () {
        var room = Server.Chat.getRoom();
        if (room !== null && !room.getMe().isStoryteller()) {
            var mySheets = this.getMyCombatants();

            for (var i = 0; i < mySheets.length; i++) {
                var effectNames = [];
                var effects = this.getEffectsOn(mySheets[i].id);
                for (var k = 0; k < effects.length; k++) {
                    effectNames.push(effects[k].name);
                }

                var oldEffectNames = this.storedEffects[mySheets[i].id];
                if (oldEffectNames !== undefined) {
                    for (var k = 0; k < oldEffectNames.length; k++) {
                        if (effectNames.indexOf(oldEffectNames[k]) === -1) {
                            var msg = new ChatSystemMessage(true);
                            msg.addText("_CHATCOMBATEFFECTENDED_");
                            msg.addLangVar("a", oldEffectNames[k]);
                            msg.addLangVar("b", mySheets[i].name);
                            UI.Chat.printElement(msg.getElement());
                        }
                    }
                }
            }
        }
    }

    public storeValue (obj : any) {
        if (!Array.isArray(obj)) {
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
                    console.log(combatant);
                }
            }
            this.reorderCombatants();

            this.storeEffectNames();

            this.effects = {};
            if (Array.isArray(obj[3]) && obj[3].length > 0) {
                for (var i = 0; i < obj[3].length; i++) {
                    var target = obj[3][i][0];

                    for (var k = 1; k < obj[3][i].length; k++) {
                        var effect = new CombatEffect(this);
                        effect.target = target;
                        effect.updateFromObject(obj[3][i][k]);
                        this.addCombatEffect(effect);
                    }
                }
            }

            this.announceEffectEnding();

            var newJson = JSON.stringify(this.exportAsObject());
            if (newJson !== oldJson) {
                this.triggerChange();
            }
        }
    }

    public applyInitiative (id : number, initiative : number) {
        var foundOne = false;
        for (var i = 0; i < this.combatants.length; i++) {
            if (this.combatants[i].id === id) {
                foundOne = true;
                this.combatants[i].setInitiative(initiative);
            }
        }

        if (foundOne) {
            this.reorderCombatants();
            this.triggerChange();
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