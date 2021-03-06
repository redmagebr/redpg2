class ImagesFolder {
    private html : HTMLElement;
    private name : string;
    private folderContainer : HTMLElement;

    // .imagesFolder
    //     %a.imagesFolderIcon
    //     %span.imagesFolderTitle{:onclick => "this.parentNode.classList.toggle('folderOpen');"}="Nome da Pasta"
    constructor (images : Array<ImageLink>) {
        var folderName = images[0].getFolder();
        this.name = folderName;
        if (folderName === "") {
            folderName = UI.Language.getLanguage().getLingo("_IMAGESNOFOLDERNAME_");
        }

        var folderContainer = document.createElement("div");
        folderContainer.classList.add("imagesFolder");
        this.folderContainer = folderContainer;

        var folderIcon = document.createElement("a");
        folderIcon.classList.add("imagesFolderIcon");

        var folderTitle = document.createElement("span");
        folderTitle.classList.add("imagesFolderTitle");
        folderTitle.addEventListener("click", <EventListenerObject> {
            folder : this,
            handleEvent : function () {
                this.folder.toggle();
            }
        });
        folderTitle.appendChild(document.createTextNode(folderName));

        var deleteIcon = document.createElement("a");
        deleteIcon.classList.add("icons-imagesDelete");
        deleteIcon.classList.add("folderRightButton");
        deleteIcon.addEventListener("click", () => { this.delete(); });
        UI.Language.addLanguageTitle(deleteIcon, "_IMAGESDELETE_");
        UI.Language.markLanguage(deleteIcon);

        folderContainer.appendChild(folderIcon);
        folderContainer.appendChild(deleteIcon);
        folderContainer.appendChild(folderTitle);

        for (var k = 0; k < images.length; k++) {
            var imageRow = new ImagesRow(images[k], this);
            folderContainer.appendChild(imageRow.getHTML());
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

    public getHTML () {
        return this.html;
    }

    public delete () {
        let text = UI.Language.getLanguage().getLingo("_DELETEFOLDER_", {languagea : this.getName()});
        if (confirm(text)) {
            DB.ImageDB.removeFolder(this.getName());
            this.html.parentElement.removeChild(this.html);
        }
    }

    public considerSuicide () {
        if (this.html.children.length <= 2) {
            this.html.parentElement.removeChild(this.html);
        }
    }
}