class MemoryVersion extends TrackerMemory {
    private importVersion : number = Server.Chat.Memory.version;

    public reset () {
        this.importVersion = Server.Chat.Memory.version;
    }

    public storeValue (v : number) {
        this.importVersion = v;
    }

    public getValue () {
        return this.importVersion;
    }

    public exportAsObject () {
        return Server.Chat.Memory.version;;
    }
}