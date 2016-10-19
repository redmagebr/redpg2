class SheetPermRow {
    public sheetId : number;
    public userId : number;
    public nickname : string;
    public nicknamesufix : string;
    public deleteSheet : boolean = false;
    public editSheet : boolean = false;
    public viewSheet : boolean = false;
    public promoteSheet : boolean = false;

    public viewInput : HTMLInputElement;
    public editInput : HTMLInputElement;
    public deleteInput : HTMLInputElement;
    public promoteInput : HTMLInputElement;

    public exportPrivileges () {
        var obj = {
            userid : this.userId,
            deletar : this.deleteInput.checked,
            editar : this.editInput.checked,
            visualizar : this.viewInput.checked,
            promote : this.promoteInput.checked
        };
        return obj;
    }

    constructor (player) {
        this.deleteSheet = player['deletar'];
        this.editSheet = player['editar'];
        this.viewSheet = player['visualizar'];
        this.promoteSheet = player['promote'];

        this.sheetId = player['id'];
        this.userId = player['userid'];

        this.nickname = player['nickname'];
        this.nicknamesufix = player['nicknamesufix'];


        this.deleteInput = document.createElement("input");
        this.deleteInput.type = "checkbox";
        this.deleteInput.checked = this.deleteSheet;


        this.promoteInput = document.createElement("input");
        this.promoteInput.type = "checkbox";
        this.promoteInput.checked = this.promoteSheet;


        this.editInput = document.createElement("input");
        this.editInput.type = "checkbox";
        this.editInput.checked = this.editSheet;


        this.viewInput = document.createElement("input");
        this.viewInput.type = "checkbox";
        this.viewInput.checked = this.viewSheet;
    }

    public getHTML () {
        // %p.sheetPermRow
        //     momo#0000
        //     %label.sheetPermLabel.language
        //     %input.sheetPermCheckbox{:type=>"checkbox"}
        //     _SHEETPERMISSIONVIEW_
        //     %label.sheetPermLabel.language
        //     %input.sheetPermCheckbox{:type=>"checkbox"}
        //     _SHEETPERMISSIONEDIT_
        //     %label.sheetPermLabel.language
        //     %input.sheetPermCheckbox{:type=>"checkbox"}
        //     _SHEETPERMISSIONDELETE_
        var p = document.createElement("p");
        p.classList.add("sheetPermRow");
        p.appendChild(document.createTextNode(this.nickname + "#" + this.nicknamesufix));

        var viewLabel = document.createElement("label");
        viewLabel.classList.add("language");
        viewLabel.classList.add("sheetPermLabel");
        viewLabel.appendChild(document.createTextNode("_SHEETPERMISSIONVIEW_"));
        viewLabel.appendChild(this.viewInput);
        p.appendChild(viewLabel);

        var editLabel = document.createElement("label");
        editLabel.classList.add("language");
        editLabel.classList.add("sheetPermLabel");
        editLabel.appendChild(document.createTextNode("_SHEETPERMISSIONEDIT_"));
        editLabel.appendChild(this.editInput);
        p.appendChild(editLabel);

        // var deleteLabel = document.createElement("label");
        // deleteLabel.classList.add("language");
        // deleteLabel.classList.add("sheetPermLabel");
        // deleteLabel.appendChild(document.createTextNode("_SHEETPERMISSIONDELETE_"));
        // deleteLabel.appendChild(this.deleteInput);
        // p.appendChild(deleteLabel);

        // var promoteLabel = document.createElement("label");
        // promoteLabel.classList.add("language");
        // promoteLabel.classList.add("sheetPermLabel");
        // promoteLabel.appendChild(document.createTextNode("_SHEETPERMISSIONPROMOTE_"));
        // promoteLabel.appendChild(this.promoteInput);
        // p.appendChild(promoteLabel);

        UI.Language.updateScreen(p);

        return p;
    }
}