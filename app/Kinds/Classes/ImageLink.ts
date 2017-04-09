class ImageLink {
    private name :string;
    private url : string;
    private folder : string;
    private tokenWidth : number = null;
    private tokenHeight : number = null;

    public getFolder () {
        return this.folder;
    }

    public setFolder (name) {
        UI.Images.stayInFolder(this.folder);
        this.folder = name;
        UI.Images.printImages();
        DB.ImageDB.considerSaving();
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
            DB.ImageDB.triggerChange(this);
            DB.ImageDB.considerSaving();
        }
    }

    constructor (name : string, url : string, folder : string) {
        this.name = name;
        this.url = url;
        this.folder = folder;
    }

    public updateFromObject (obj) {
        if (obj['tokenWidth'] != undefined && obj['tokenHeight'] != undefined) {
            this.tokenWidth = obj['tokenWidth'];
            this.tokenHeight = obj['tokenHeight'];
        }
    }

    public exportAsObject () {
        var obj = {
            name : this.name,
            url : this.url,
            folder : this.folder
        };

        if (this.tokenWidth != null && this.tokenHeight != null) {
            obj['tokenWidth'] = this.tokenWidth;
            obj['tokenHeight'] = this.tokenHeight;
        }

        return obj;
    }
}