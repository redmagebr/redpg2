class StyleInstance {
    public id : number = 0;
    public gameid : number = 0;
    public name : string = "";
    public mainCode : string = null;
    public publicCode : string = null;
    public html : string = null;
    public css : string = null;
    public publicStyle : boolean = false;

    public isLoaded () {
        return this.html !== null;
    }

    public updateFromObject (obj) {
        for (var id in this) {
            if (obj[id] !== undefined) {
                this[id] = obj[id];
            }
        }
    }
}