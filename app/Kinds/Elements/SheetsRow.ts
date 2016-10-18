class SheetsRow {
    private sheet : SheetInstance;
    private html : HTMLElement;
    private nameNode : Text;

    public open () {
        // TODO: Call Open Sheet
    }

    public deleteSheet () {
        if (confirm(UI.Language.getLanguage().getLingo("_SHEETCONFIRMDELETE_", {languagea : this.sheet.getName()}))) {
            var cbs = <EventListenerObject> {
                sheet : this.sheet,
                oldFolder : this.sheet.getFolder(),
                handleEvent : function () {
                    UI.Sheets.keepOpen(this.oldFolder, this.sheet.getGameid());
                    UI.Sheets.callSelf();
                }
            };

            Server.Sheets.deleteSheet(this.sheet, cbs);
        }
    }

    public editPerm () {
        // TODO: Call SheetPermDesigner
    }

    public editFolder () {
        var oldFolder = this.sheet.getFolder();
        var newName = prompt(UI.Language.getLanguage().getLingo("_SHEETSRENAMEFOLDERPROMPT_", {languagea : this.sheet.getName(), languageb : this.sheet.folder}));
        if (newName === null) {
            return;
        }
        this.sheet.folder = newName.trim();
        if (this.sheet.getFolder() !== oldFolder) {
            var cbs = <EventListenerObject> {
                sheet : this.sheet,
                oldFolder : oldFolder,
                handleEvent : function () {
                    UI.Sheets.keepOpen(this.oldFolder, this.sheet.getGameid());
                    UI.Sheets.callSelf();
                }
            };

            Server.Sheets.sendFolder(this.sheet, cbs);
        }
    }

    constructor (sheet : SheetInstance) {
        this.sheet = sheet;

        this.html = document.createElement("p");
        this.html.classList.add("sheetListSheet");

        // NAME
        var nameLink = document.createElement("a");
        nameLink.classList.add("sheetNameLink");
        this.nameNode = document.createTextNode(sheet.getName());
        nameLink.appendChild(this.nameNode);
        this.html.appendChild(nameLink);

        nameLink.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.row.open();
            }
        });

        // FOLDER
        if (sheet.isEditable()) {
            var folder = document.createElement("a");
            folder.classList.add("sheetExtraButton");
            folder.classList.add("textLink");
            folder.appendChild(document.createTextNode("_SHEETSRENAMEFOLDER_"));
            UI.Language.markLanguage(folder);
            this.html.appendChild(folder);

            folder.addEventListener("click", <EventListenerObject> {
                row: this,
                handleEvent: function (e) {
                    e.preventDefault();
                    this.row.editFolder();
                }
            });
        }

        // PERMISSIONS
        if (sheet.isPromotable()) {
            var perm = document.createElement("a");
            perm.classList.add("sheetExtraButton");
            perm.classList.add("textLink");
            perm.appendChild(document.createTextNode("_SHEETSCHANGEPERMISSIONS_"));
            UI.Language.markLanguage(perm);
            this.html.appendChild(perm);

            perm.addEventListener("click", <EventListenerObject> {
                row: this,
                handleEvent: function (e) {
                    e.preventDefault();
                    this.row.editPerm();
                }
            });
        }

        // DELETE
        if (sheet.isDeletable()) {
            var del = document.createElement("a");
            del.classList.add("sheetExtraButton");
            del.classList.add("textLink");
            del.appendChild(document.createTextNode("_SHEETSDELETE_"));
            UI.Language.markLanguage(del);
            this.html.appendChild(del);

            del.addEventListener("click", <EventListenerObject> {
                row: this,
                handleEvent: function (e) {
                    e.preventDefault();
                    this.row.deleteSheet();
                }
            });
        }
    }

    public getHTML () {
        return this.html;
    }
}