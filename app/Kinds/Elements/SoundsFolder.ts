class SoundsFolder {
    private html : HTMLElement;
    private name : string;
    private folderContainer : HTMLElement;

    // .imagesFolder
    //     %a.imagesFolderIcon
    //     %span.imagesFolderTitle{:onclick => "this.parentNode.classList.toggle('folderOpen');"}="Nome da Pasta"
    constructor (sounds : Array<SoundLink>) {
        var folderName = sounds[0].getFolder();
        this.name = folderName;
        if (folderName === "") {
            folderName = UI.Language.getLanguage().getLingo("_SOUNDSNOFOLDERNAME_");
        }

        var folderContainer = document.createElement("div");
        folderContainer.classList.add("imagesFolder");
        this.folderContainer = folderContainer;

        var folderIcon = document.createElement("a");
        folderIcon.classList.add("imagesFolderIcon");

        var deleteIcon = document.createElement("a");
        deleteIcon.classList.add("icons-imagesDelete");
        deleteIcon.classList.add("folderRightButton");
        deleteIcon.addEventListener("click", () => { this.delete(); });
        UI.Language.addLanguageTitle(deleteIcon, "_IMAGESDELETE_");
        UI.Language.markLanguage(deleteIcon);

        var folderTitle = document.createElement("span");
        folderTitle.classList.add("imagesFolderTitle");
        folderTitle.addEventListener("click", <EventListenerObject> {
            folder : this,
            handleEvent : function () {
                this.folder.toggle();
            }
        });
        folderTitle.appendChild(document.createTextNode(folderName));

        folderContainer.appendChild(folderIcon);
        folderContainer.appendChild(deleteIcon);
        folderContainer.appendChild(folderTitle);

        for (var k = 0; k < sounds.length; k++) {
            var soundRow = new SoundsRow(sounds[k], this);
            folderContainer.appendChild(soundRow.getHTML());
        }

        this.html = folderContainer;
    }

    public getName () {
        return this.name;
    }

    public open () {
        this.folderContainer.classList.add("folderOpen");
    }

    public toggle () {
        this.folderContainer.classList.toggle("folderOpen");

        if (this.folderContainer.classList.contains("folderOpen")) {
            UI.Images.stayInFolder(this.name);
        }
    }

    public delete () {
        let text = UI.Language.getLanguage().getLingo("_DELETEFOLDER_", {languagea : this.getName()});
        if (confirm(text)) {
            DB.SoundDB.removeFolder(this.getName());
            this.html.parentElement.removeChild(this.html);
        }
    }

    public getHTML () {
        return this.html;
    }

    public considerSuicide () {
        if (this.html.children.length <= 2) {
            this.html.parentElement.removeChild(this.html);
        }
    }
}