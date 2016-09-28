class ImageRed implements ImageInt {
    private name : string;
    private uploader : number;
    private uuid : string;

    public getLink () : string {
        var url = Server.IMAGE_URL + this.uploader + "_" + this.uuid;
        return url;
    }

    public getName () : string {
        return this.name;
    }

    public getId () : string {
        return this.uuid;
    }
}