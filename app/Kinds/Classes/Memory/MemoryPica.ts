class MemoryPica extends TrackerMemory {
    private picaAllowed : boolean = true;

    private updateUnderway : boolean = false;
    private changeDetected : boolean = false;

    private static fieldOrder : Array<string> = ["picaAllowed"];

    public reset () {
        this.picaAllowed = true;
    }

    public getValue () {
        return this;
    }

    public picaAllowedStore (isIt : boolean) {
        isIt = isIt === true;
        if (isIt !== this.picaAllowed) {
            this.picaAllowed = isIt;
            if (this.updateUnderway) {
                this.changeDetected = true;
            } else {
                this.triggerChange();
            }
        }
    }

    public storeValue (values : Array<any>) {
        if (!Array.isArray(values) || values.length < MemoryPica.fieldOrder.length) {
            console.warn ("[ROOMMEMMORY] [MemoryPica] Invalid store operation requested. Ignoring.");
            return;
        }

        this.changeDetected = false;
        this.updateUnderway = true;
        for (var i = 0; i < MemoryPica.fieldOrder.length; i++) {
            this[MemoryPica.fieldOrder[i] + "Store"](values[i]);
        }
        if (this.changeDetected) {
            this.triggerChange();
        }
        this.updateUnderway = false;
    }

    public exportAsObject () : Array<any> {
        var result : Array<any> = [];
        for (var i = 0; i < MemoryPica.fieldOrder.length; i++) {
            result.push(this[MemoryPica.fieldOrder[i]]);
        }
        return result;
    }
}