class SheetsRow {
    private sheet : SheetInstance;
    private html : HTMLElement;
    private nameNode : Text;

    public open () {
        // TODO: Call Open Sheet
    }

    public deleteSheet () {
        // TODO: Call delete sheet
    }

    public editPerm () {
        // TODO: Call SheetPermDesigner
    }

    public editFolder () {
        var newName = prompt(UI.Language.getLanguage().getLingo("_SHEETSRENAMEFOLDERPROMPT_", {languagea : this.sheet.name, languageb : this.sheet.folder}));
        if (newName === null) {
            return;
        }
        this.sheet.folder = newName.trim();
        // TODO: Send folder to server
    }

    constructor (sheet : SheetInstance) {
        this.sheet = sheet;

        this.html = document.createElement("p");
        this.html.classList.add("sheetListSheet");

        // NAME
        var nameLink = document.createElement("a");
        nameLink.classList.add("sheetNameLink");
        this.nameNode = document.createTextNode(sheet.name);
        nameLink.appendChild(nameNode);
        this.html.appendChild(nameLink);

        nameLink.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.row.open();
            }
        });

        // FOLDER
        var folder = document.createElement("a");
        folder.classList.add("sheetExtraButton");
        folder.classList.add("textLink");
        folder.appendChild(document.createTextNode("_SHEETSRENAMEFOLDER_"));
        UI.Language.markLanguage(folder);
        this.html.appendChild(folder);

        folder.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.row.editFolder();
            }
        });

        // PERMISSIONS
        var perm = document.createElement("a");
        perm.classList.add("sheetExtraButton");
        perm.classList.add("textLink");
        perm.appendChild(document.createTextNode("_SHEETSCHANGEPERMISSIONS_"));
        UI.Language.markLanguage(perm);
        this.html.appendChild(perm);

        perm.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.row.editPerm();
            }
        });

        // DELETE
        var del = document.createElement("a");
        del.classList.add("sheetExtraButton");
        del.classList.add("textLink");
        del.appendChild(document.createTextNode("_SHEETSDELETE_"));
        UI.Language.markLanguage(del);
        this.html.appendChild(del);

        del.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.row.deleteSheet();
            }
        });
    }

    public getHTML () {
        return this.html;
    }
}