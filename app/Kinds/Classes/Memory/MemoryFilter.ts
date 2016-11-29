class MemoryFilter extends TrackerMemory {
    public static names : Array<string> = ["none", "night", "noir", "trauma", "gray", "sepia", "evening", "fire"];

    private value : number = 0;

    public reset () {
        this.storeValue(0);
    }

    public getValue () {
        return MemoryFilter.names[this.value];
    }

    public storeName (name : string) {
        this.storeValue(MemoryFilter.names.indexOf(name));
    }

    public storeValue (i : number) {
        if (i < 0 || i >= MemoryFilter.names.length){
            i = 0;
        }
        if (this.value !== i) {
            this.value = i;
            this.triggerChange();
        }
    }

    public exportAsObject () {
        return this.value;
    }
}