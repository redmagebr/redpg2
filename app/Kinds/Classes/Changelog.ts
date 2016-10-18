class Changelog {
    private release : number;
    private minor : number;
    private major : number;

    private messages : {[lingo : string] : Array<string>} = {};

    private static updates : Array<Changelog> = [];
    private static updatesExternal : Array<Changelog> = null;

    private static addToUpdates (change : Changelog) {
        if (Changelog.updatesExternal === null) {
            Changelog.updates.push(change);
        } else {
            Changelog.updatesExternal.push(change);
        }
    }

    public static sort () {
        Changelog.updates.sort(function (a : Changelog, b : Changelog) {
            if (a.major !== b.major) return a.major - b.major;
            if (a.minor !== b.minor) return a.minor - b.minor;
            if (a.release !== b.release) return a.release - b.release;
            return 0;
        });

        if (Changelog.updatesExternal !== null) {
            Changelog.updatesExternal.sort(function (a: Changelog, b: Changelog) {
                if (a.major !== b.major) return a.major - b.major;
                if (a.minor !== b.minor) return a.minor - b.minor;
                if (a.release !== b.release) return a.release - b.release;
                return 0;
            });
        }
    }

    public static getMostRecentLocalUpdate () {
        return Changelog.updates[0];
    }

    public static getMostRecentExternalUpdate () {
        if (Changelog.updatesExternal !== null) {
            return Changelog.updatesExternal[0];
        }
        return null;
    }

    public static getUpdates () : Array<Changelog> {
        return Changelog.updates;
    }

    public static getMissingUpdates () {
        if (Changelog.updatesExternal === null) return [];
        var updates = [];
        for (var i = Changelog.updates.length; i < Changelog.updatesExternal.length; i++) {
            updates.push(Changelog.updatesExternal[i]);
        }
        return updates;
    }

    public static finished () {
        if (Changelog.updatesExternal === null) {
            Changelog.sort();
            Changelog.updatesExternal = [];
        } else {
            Changelog.sort();
            UI.ChangelogManager.print();
        }
    }

    public static getLocalVersion () {
        return Changelog.updates[Changelog.updates.length - 1].getVersion();
    }

    public static getExternalVersion () {
        if (Changelog.updatesExternal === null) {
            return null;
        }
        return Changelog.updatesExternal[Changelog.updatesExternal.length - 1].getVersion();
    }

    constructor (release : number, minor : number, major : number) {
        this.release = release;
        this.minor = minor;
        this.major = major;

        Changelog.addToUpdates(this);
    }

    public getVersion () {
        return [this.major, this.minor, this.release];
    }

    public addMessage (msg : string, lingo : string) {
        if (this.messages[lingo] === undefined) {
            this.messages[lingo] = [msg];
        } else {
            this.messages[lingo].push(msg);
        }
    }

    public getMessages () : Array<string> {
        var lingo = UI.Language.getLanguage();
        for (var i = 0; i < lingo.ids.length; i++) {
            if (this.messages[lingo.ids[i]] !== undefined) {
                return this.messages[lingo.ids[i]];
            }
        }
        if (this.messages['en'] !== undefined) return this.messages['en'];
        for (var key in this.messages) {
            return this.messages[key];
        }
        return ["Changelog contains no messages."];
    }

    public getHTML (missing : boolean) {
        // %p.mainWindowParagraph.changelogMissing
        //     %span.changelogChangeVersion="0.9.0"
        //     %span.changelogChange="Adicionadas coisas legais que você não tem."
        var p = document.createElement("p");
        p.classList.add("mainWindowParagraph");
        if (missing) {
            p.classList.add("changelogMissing");
        } else {
            p.classList.add("changelogCurrent");
        }

        var versSpan = document.createElement("span");
        versSpan.classList.add("changelogChangeVersion");
        versSpan.appendChild(document.createTextNode(this.major + "." + this.minor + "." + this.release));
        p.appendChild(versSpan);

        var messages = this.getMessages();
        for (var i = 0; i < messages.length; i++) {
            var span = document.createElement("span");
            span.classList.add("changelogChange");
            span.appendChild(document.createTextNode(messages[i]));
            p.appendChild(span);
        }

        return p;
    }
}