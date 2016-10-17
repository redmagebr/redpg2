class Changelog {
    private release : number;
    private minor : number;
    private major : number;

    private static updates : Array<Changelog> = [];
    private static updatesExternal : Array<Changelog> = null;

    private static addToUpdates (change : Changelog) {
        if (Changelog.updatesExternal === null) {
            Changelog.updates.push(change);
        } else {
            Changelog.updatesExternal.push(change);
        }
    }

    public static finished () {
        if (Changelog.updatesExternal === null) {
            Changelog.updatesExternal = [];
        } else {
            // TODO : Populate changelog HTML
        }
    }

    constructor (release : number, minor : number, major : number) {
        this.release = release;
        this.minor = minor;
        this.major = major;

        Changelog.addToUpdates(this);
    }
}