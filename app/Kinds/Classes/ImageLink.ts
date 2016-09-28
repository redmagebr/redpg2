class ImageLink {
    private name :string;
    private url : string;
    private folder : string;

    public getFolder () {
        return this.folder;
    }

    public getLink () {
        return Server.URL.fixURL(this.url);
    }

    public getName () {
        return this.name;
    }

    constructor (name : string, url : string, folder : string) {
        this.name = name;
        this.url = url;
        this.folder = folder;
    }
}