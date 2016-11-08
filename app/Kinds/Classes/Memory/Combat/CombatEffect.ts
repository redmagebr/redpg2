/// <reference path='../MemoryCombat.ts' />
class CombatEffect {
    public name : string = "";
    public origin : number = 0;
    public target : number = 0;
    public roundEnd : number = 0;
    public turnEnd : number = 0;
    public endOnStart : boolean = false;
    public endOnEnd : boolean = false;
    public customString : String = null;
    private combat : MemoryCombat;

    public exportAsObject () {
        var arr = [this.name, this.origin];
        if (this.customString !== null) {
            arr.push(<string> this.customString);
        }
        return arr;
    }

    constructor (combat : MemoryCombat) {
        this.combat = combat;
    }

    public considerEnding () {

    }

    public reset () {
        this.name = UI.Language.getLanguage().getLingo("_TRACKERUNKNOWNEFFECT_");
    }

    public updateFromObject (array : Array<any>) {
        if (!Array.isArray(array)) {
            this.reset();
        } else {
            this.name = array[0];
            this.origin = array[1];
            if (typeof array[2] === "string") {
                this.customString = array[2];
            }
        }
    }
}