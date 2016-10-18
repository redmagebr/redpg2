class SheetPermRow {
    public sheetId : number;
    public userId : number;
    public nickname : string;
    public nicknamesufix : string;
    public deleteSheet : boolean = false;
    public editSheet : boolean = false;
    public viewSheet : boolean = false;
    public promoteSheet : boolean = false;

    constructor (player) {
        this.deleteSheet = player['deletar'];
        this.editSheet = player['editar'];
        this.viewSheet = player['visualizar'];
        this.promoteSheet = player['promote'];

        this.sheetId = player['id'];
        this.userId = player['userid'];

        this.nickname = player['nickname'];
        this.nicknamesufix = player['nicknamesufix'];
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
        p.appendChild(document.createTextNode(players[i]['nickname'] + "#" + players[i]['nicknamesufix']));

        var viewLabel = document.createElement("label");
        viewLabel.classList.add("language");
        viewLabel.classList.add("sheetPermLabel");

        return p;
    }
}