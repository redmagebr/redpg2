class SoundLink {
    private name :string;
    private url : string;
    private folder : string;
    private bgm : boolean;

    public getFolder () {
        return this.folder;
    }

    public isBgm () {
        return this.bgm;
    }

    public setFolder (name) {
        //UI.Images.stayInFolder(this.folder);
        this.folder = name;
        //UI.Images.printImages();
        DB.SoundDB.considerSaving();
    }

    public getLink () {
        return Server.URL.fixURL(this.url);
    }

    public getName () {
        return this.name;
    }

    public setName (name : string) {
        if (this.name !== name) {
            this.name = name;
            DB.SoundDB.triggerChange(this);
            DB.SoundDB.considerSaving();
        }
    }

    constructor (name : string, url : string, folder : string, bgm : boolean) {
        this.name = name;
        this.url = url;
        this.folder = folder;
        this.bgm = bgm;
    }

    public exportAsObject () {
        return {
            name : this.name,
            url : this.url,
            folder : this.folder,
            bgm : this.bgm
        };
    }
}