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

    public exportAsObject () {

    }

    public storeValue (obj : Object) {

    }

    public getValue () {
        return null;
    }
}