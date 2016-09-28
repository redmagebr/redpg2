class CombatParticipant {
    public id : number = 0;
    public name : string = "";
    public initiative : number = 0;

    public effects : Array<CombatEffect> = [];

    private combatMemory : MemoryCombat;

    constructor (memo : MemoryCombat) {
        this.combatMemory = memo;
    }

    public setSheet (sheet : SheetInstance) {
        this.id = sheet.id;
        this.name = sheet.name;
    }

    public exportAsObject () {
        var participant : Array<any> = [this.id, this.name, this.initiative];

        var effects = [];

        for (var i = 0; i < this.effects.length; i++) {
            effects.push(this.effects[i].exportAsObject());
        }

        participant.push(effects);

        return participant;
    }
}