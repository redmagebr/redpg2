class ImagesRow {
    private html : HTMLElement;
    private image : ImageLink;
    private folder : ImagesFolder;
    private nameNode : Text;

    //     .imagesRow
    //         %a.imagesLeftButton.icons-imagesShare
    //         %a.imagesLeftButton.icons-imagesView
    //         %a.imagesLeftButton.icons-imagesPersona
    //         %a.imagesRightButton.icons-imagesDelete
    //         %a.imagesRightButton.icons-imagesRename
    //         %a.imagesRightButton.icons-imagesFolder
    //         %a.imagesRowTitle="Nome da Imagem"

    public view () {
        UI.Pica.loadImage(this.image.getLink());
    }

    public share () {
        MessageImage.shareLink(this.image.getName(), this.image.getLink());
    }

    public usePersona () {
        UI.Chat.PersonaDesigner.createPersona(this.image.getName().replace(/ *\([^)]*\) */, '').trim(), this.image.getLink());
        UI.Chat.PersonaManager.createAndUsePersona(this.image.getName().replace(/ *\([^)]*\) */, '').trim(), this.image.getLink());
    }

    public delete () {
        this.html.parentElement.removeChild(this.html);
        this.folder.considerSuicide();
        DB.ImageDB.removeImage(this.image);
    }

    public renameFolder () {
        var newName = prompt(UI.Language.getLanguage().getLingo("_IMAGESRENAMEFOLDERPROMPT_", {languagea : this.image.getName(), languageb : this.image.getFolder()}));
        if (newName === null) {
            return;
        }
        this.image.setFolder(newName.trim());
    }

    public rename () {
        var newName = prompt(UI.Language.getLanguage().getLingo("_IMAGESRENAMEPROMPT_", {languagea : this.image.getName()}));
        if (newName === null || newName === "") {
            return;
        }
        this.image.setName(newName);
        this.nameNode.nodeValue = this.image.getName();
    }

    constructor (image : ImageLink, folder : ImagesFolder) {
        this.folder = folder;
        this.image = image;

        var imageContainer = document.createElement("div");
        imageContainer.classList.add("imagesRow");

        // SHARE
        var shareButton = document.createElement("a");
        shareButton.classList.add("imagesLeftButton");
        shareButton.classList.add("icons-imagesShare");
        UI.Language.addLanguageTitle(shareButton, "_IMAGESSHARE_");

        shareButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.share();
            }
        });

        // VIEW
        var viewButton = document.createElement("a");
        viewButton.classList.add("imagesLeftButton");
        viewButton.classList.add("icons-imagesView");
        UI.Language.addLanguageTitle(viewButton, "_IMAGESVIEW_");

        viewButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.view();
            }
        });

        // PERSONA
        var personaButton = document.createElement("a");
        personaButton.classList.add("imagesLeftButton");
        personaButton.classList.add("icons-imagesPersona");
        UI.Language.addLanguageTitle(personaButton, "_IMAGESPERSONA_");

        personaButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.usePersona();
            }
        });

        // DELETE
        var deleteButton = document.createElement("a");
        deleteButton.classList.add("imagesRightButton");
        deleteButton.classList.add("icons-imagesDelete");
        UI.Language.addLanguageTitle(deleteButton, "_IMAGESDELETE_");

        deleteButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.delete();
            }
        });

        // RENAME
        var renameButton = document.createElement("a");
        renameButton.classList.add("imagesRightButton");
        renameButton.classList.add("icons-imagesRename");
        UI.Language.addLanguageTitle(renameButton, "_IMAGESRENAME_");

        renameButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.rename();
            }
        });

        // FOLDER
        var folderButton = document.createElement("a");
        folderButton.classList.add("imagesRightButton");
        folderButton.classList.add("icons-imagesFolder");
        UI.Language.addLanguageTitle(folderButton, "_IMAGESFOLDER_");

        folderButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.renameFolder();
            }
        });

        var imageTitle = document.createElement("a");
        imageTitle.classList.add("imagesRowTitle");
        var nameNode = document.createTextNode(image.getName());
        imageTitle.appendChild(nameNode);
        this.nameNode = nameNode;

        UI.Language.markLanguage(shareButton, viewButton, personaButton, deleteButton, renameButton, folderButton);

        imageContainer.appendChild(shareButton);
        imageContainer.appendChild(viewButton);
        imageContainer.appendChild(personaButton);
        imageContainer.appendChild(deleteButton);
        imageContainer.appendChild(renameButton);
        imageContainer.appendChild(folderButton);
        imageContainer.appendChild(imageTitle);

        this.html = imageContainer;
    }

    public getHTML () : HTMLElement {
        return this.html;
    }
}