class ImagesRow {
    private html : HTMLElement;
    private image : ImageLink;

    //     .imagesRow
    //         %a.imagesLeftButton.icons-imagesShare
    //         %a.imagesLeftButton.icons-imagesView
    //         %a.imagesLeftButton.icons-imagesPersona
    //         %a.imagesRightButton.icons-imagesDelete
    //         %a.imagesRightButton.icons-imagesRename
    //         %a.imagesRightButton.icons-imagesFolder
    //         %a.imagesRowTitle="Nome da Imagem"

    public share () {
        MessageImage.shareLink(this.image.getName(), this.image.getLink());
    }

    public usePersona () {
        UI.Chat.PersonaDesigner.createPersona(this.image.getName(), this.image.getLink());
        UI.Chat.PersonaManager.createAndUsePersona(this.image.getName(), this.image.getLink());
    }

    constructor (image : ImageLink) {
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

        // RENAME
        var renameButton = document.createElement("a");
        renameButton.classList.add("imagesRightButton");
        renameButton.classList.add("icons-imagesRename");
        UI.Language.addLanguageTitle(renameButton, "_IMAGESRENAME_");

        // FOLDER
        var folderButton = document.createElement("a");
        folderButton.classList.add("imagesRightButton");
        folderButton.classList.add("icons-imagesFolder");
        UI.Language.addLanguageTitle(folderButton, "_IMAGESFOLDER_");

        var imageTitle = document.createElement("a");
        imageTitle.classList.add("imagesRowTitle");
        imageTitle.appendChild(document.createTextNode(image.getName()));

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