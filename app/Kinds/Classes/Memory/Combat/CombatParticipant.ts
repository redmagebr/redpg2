class CombatParticipant {
    public id : number = 0;
    public name : string = "";
    public initiative : number = 0;
    public owner : number = 0;

    public setSheet (sheet : SheetInstance) {
        this.id = sheet.getId();
        this.name = sheet.getName();
    }

    public setSheetId (id : number ) {
        this.id = id;
    }

    public setName (name : string) {
        this.name = name;
    }

    public setInitiative (init : number) {
        this.initiative = init;
    }

    public setOwner (id : number) {
        this.owner = id;
    }

    public updateFromObject (obj : Array<any>) {
        if (Array.isArray(obj) && obj.length === 4) {
            this.id = obj[0];
            this.name = obj[1];
            this.initiative = obj[2];
            this.owner = obj[3];
        }
    }

    public exportAsObject () {
        var participant : Array<any> = [this.id, this.name, this.initiative, this.owner];
        return participant;
    }
}