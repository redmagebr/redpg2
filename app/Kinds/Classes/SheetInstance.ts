class SheetInstance {
    public id : number = 0;
    public gameid : number = 0;
    public folder : string = "";
    public name : string = "";
    public values : Object = {};
    public lastValues : string = "{}";

    public creator : number = null;
    public creatorNickname : string = "???#???";

    public styleId : number = 0;
    public styleName : string = "?";
    public styleCreator : number = 0;
    public styleCreatorNickname : string = "???#???";
    public styleSafe : boolean = false;

    public view : boolean = true;
    public edit : boolean = false;
    public delete : boolean = false;
    public promote : boolean = false;
    public isPublic : boolean = false;

    public changed : boolean = false;

    private changeTrigger = new Trigger();

    public addChangeListener (list : Listener | Function) {
        this.changeTrigger.addListener(list);
    }

    public triggerChanged () {
        this.changeTrigger.trigger(this);
        DB.SheetDB.triggerChanged(this);
    }

    public getMemoryId() {
        return "sheetBackup_" + this.id;
    }

    public setSaved () {
        this.changed = false;
        Application.LocalMemory.unsetMemory(this.getMemoryId());
    }

    public setName (name : string) {
        if (name !== this.name) {
            this.changed = true;
            this.name = name;
            this.triggerChanged();
        }
    }

    public setValues (values : Object, local : boolean) {
        // Local values = user changed them NOW.
        // Not local = saved on server.

        var newJson = JSON.stringify(values);
        if (newJson !== this.lastValues) {
            this.values = values;
            this.lastValues = newJson;
            this.changed = true;
        }

        if (this.changed) {
            if (local) {
                // Store in localStorage
                Application.LocalMemory.setMemory(this.getMemoryId(), newJson);
            } else {
                // Since these are the server values, even though the current instance changed, it's not changed in the way users see it.
                this.changed = false;
            }
            this.triggerChanged();
        }
    }

    public updateFromObject (obj : Object) {
        if (typeof obj['id'] !== 'undefined') this.id = obj['id'];
        if (typeof obj['gameid'] !== 'undefined') this.gameid = obj['gameid'];
        if (typeof obj['nome'] !== 'undefined') this.name = obj['nome'];

        if (typeof obj['criadorNick'] !== 'undefined' && typeof obj['criadorNickSufix'] !== 'undefined') this.creatorNickname = obj['criadorNick'] + "#" + obj['criadorNickSufix'];
        if (typeof obj['criador'] !== 'undefined') this.creator = obj['criador'];
        if (typeof obj['folder'] !== 'undefined') this.folder = obj['folder'];

        if (typeof obj['publica'] !== 'undefined') this.isPublic = obj['publica'];
        if (typeof obj['visualizar'] !== 'undefined') this.view = obj['visualizar'];
        if (typeof obj['deletar'] !== 'undefined') this.delete = obj['deletar'];
        if (typeof obj['editar'] !== 'undefined') this.edit = obj['editar'];
        if (typeof obj['promote'] !== 'undefined') this.promote = obj['promote'];

        if (typeof obj['nickStyleCreator'] !== 'undefined' && typeof obj['nicksufixStyleCreator'] !== 'undefined') this.styleCreatorNickname = obj['nickStyleCreator'] + "#" + obj['nicksufixStyleCreator'];
        if (typeof obj['idStyleCreator'] !== 'undefined') this.styleCreator = obj['idStyleCreator'];

        if (typeof obj['idstyle'] !== 'undefined') this.styleId = obj['idstyle'];
        if (typeof obj['styleName'] !== 'undefined') this.styleName = obj['styleName'];
        if (typeof obj['segura'] !== 'undefined') this.styleSafe = obj['segura'];

        if (typeof obj['values'] !== 'undefined') this.setValues(obj['values'], false);
    }
}