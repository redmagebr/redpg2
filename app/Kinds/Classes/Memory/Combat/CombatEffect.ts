/// <reference path='../MemoryCombat.ts' />
interface CombatEffectInfo {
    name : string;
    target : number;
    roundEnd : number;
    turnEnd : number;
    endOnStart : boolean;
    customString : String;
}

class CombatEffect {
    public name : string = "";
    public target : number = 0;
    public roundEnd : number = 0;
    public turnEnd : number = 0;
    public endOnStart : boolean = false;
    public customString : String = null;
    private combat : MemoryCombat;

    constructor (combat : MemoryCombat) {
        this.combat = combat;
    }

    public getTargetName () {
        var sheet = DB.SheetDB.getSheet(this.target);
        if (sheet !== null) {
            return sheet.getName();
        }

        var combatants = this.combat.getCombatants();
        for (var i = 0; i < combatants.length; i++) {
            if (combatants[i].id === this.target) {
                return combatants[i].name;
            }
        }

        return "???";
    }

    public considerEnding () {
        if (this.combat.getRound() > this.roundEnd) {
            this.combat.removeEffect(this);
        } else if (this.combat.getRound() === this.roundEnd) {
            if (this.endOnStart) {
                if (this.turnEnd === this.combat.getTurn()) {
                    this.combat.removeEffect(this);
                }
            } else if (this.turnEnd < this.combat.getTurn()) {
                this.combat.removeEffect(this);
            }
        }
    }

    public reset () {
        this.name = UI.Language.getLanguage().getLingo("_TRACKERUNKNOWNEFFECT_");
    }

    public exportAsObject () {
        var arr = [this.name, this.roundEnd, this.turnEnd, this.endOnStart ? 1 : 0];
        if (this.customString !== null) {
            arr.push(<string> this.customString);
        }
        return arr;
    }

    public updateFromObject (array : Array<any>) {
        if (!Array.isArray(array)) {
            this.reset();
        } else {
            this.name = array[0];
            this.roundEnd = array[1];
            this.turnEnd = array[2];
            this.endOnStart = array[3] === 1;
            if (typeof array[4] === "string") {
                this.customString = array[4];
            }
        }
    }
}