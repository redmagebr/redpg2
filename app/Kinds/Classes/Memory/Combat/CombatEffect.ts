class CombatEffect {
    public name : string = "";
    public origin : number = 0;
    public customString : String = null;

    public reset () {
        this.name = UI.Language.getLanguage().getLingo("_TRACKERUNKNOWNEFFECT_");
    }

    public exportAsObject () {
        var arr = [this.name, this.origin];
        if (this.customString !== null) {
            arr.push(<string> this.customString);
        }
        return arr;
    }

    public storeValue (array : Array<any>) {
        if (!Array.isArray(array) || typeof array[0] !== "string" || typeof array[1] !== "number") {
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