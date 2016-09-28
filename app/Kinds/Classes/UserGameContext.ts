class UserGameContext {
    private user : User;
    private gameid : number = 0;

    constructor (user : User) {
        this.user = user;
    }

    public createRoom : boolean = false;
    public createSheet : boolean = false;
    public editSheet : boolean = false;
    public viewSheet : boolean = false;
    public deleteSheet : boolean = false;

    public invite : boolean = false;
    public promote : boolean = false;

    public getUser () {
        return this.user;
    }

    public updateFromObject (obj : {[id : string] : any}) {
        for (var id in this) {
            if (obj[id] !== undefined) {
                this[id] = obj[id];
            }
        }
    }
}