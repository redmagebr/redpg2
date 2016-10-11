class SoundsRow {
    private html : HTMLElement;
    private sound : SoundLink;
    private folder : SoundsFolder;
    private nameNode : Text;

    //     .imagesRow
    //         %a.imagesLeftButton.icons-imagesShare
    //         %a.imagesLeftButton.icons-imagesView
    //         %a.imagesLeftButton.icons-imagesPersona
    //         %a.imagesRightButton.icons-imagesDelete
    //         %a.imagesRightButton.icons-imagesRename
    //         %a.imagesRightButton.icons-imagesFolder
    //         %a.imagesRowTitle="Nome da Imagem"

    public play () {
        if (this.sound.isBgm()) {
            UI.SoundController.playBGM(this.sound.getLink());
        } else {
            UI.SoundController.playSE(this.sound.getLink());
        }
    }

    public share () {
        if (this.sound.isBgm()) {
            MessageBGM.shareLink(this.sound.getName(), this.sound.getLink());
        } else {
            MessageSE.shareLink(this.sound.getName(), this.sound.getLink());
        }
    }

    public delete () {
        this.html.parentElement.removeChild(this.html);
        this.folder.considerSuicide();
        DB.SoundDB.removeSound(this.sound);
    }

    public renameFolder () {
        UI.Sounds.stayInFolder(this.sound.getFolder());
        var newName = prompt(UI.Language.getLanguage().getLingo("_SOUNDSRENAMEFOLDERPROMPT_", {languagea : this.sound.getName(), languageb : this.sound.getFolder()}));
        if (newName === null) {
            return;
        }
        this.sound.setFolder(newName.trim());
        UI.Sounds.printSounds();
    }

    public rename () {
        var newName = prompt(UI.Language.getLanguage().getLingo("_SOUNDSRENAMEPROMPT_", {languagea : this.sound.getName()}));
        if (newName === null || newName === "") {
            return;
        }
        this.sound.setName(newName);
        this.nameNode.nodeValue = this.sound.getName();
    }

    constructor (snd : SoundLink, folder : SoundsFolder) {
        this.folder = folder;
        this.sound = snd;

        var soundContainer = document.createElement("div");
        soundContainer.classList.add("imagesRow");

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
        viewButton.classList.add("icons-soundsPlay");
        UI.Language.addLanguageTitle(viewButton, "_SOUNDSPLAY_");

        viewButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.play();
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
        UI.Language.addLanguageTitle(renameButton, "_SOUNDSRENAME_");

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
        UI.Language.addLanguageTitle(folderButton, "_SOUNDSFOLDER_");

        folderButton.addEventListener("click", <EventListenerObject> {
            row : this,
            handleEvent : function () {
                this.row.renameFolder();
            }
        });

        var imageTitle = document.createElement("a");
        imageTitle.classList.add("imagesRowTitle");
        var nameNode = document.createTextNode(this.sound.getName());
        imageTitle.appendChild(nameNode);
        this.nameNode = nameNode;

        UI.Language.markLanguage(shareButton, viewButton, personaButton, deleteButton, renameButton, folderButton);

        soundContainer.appendChild(shareButton);
        soundContainer.appendChild(viewButton);
        soundContainer.appendChild(deleteButton);
        soundContainer.appendChild(renameButton);
        soundContainer.appendChild(folderButton);
        soundContainer.appendChild(imageTitle);

        this.html = soundContainer;
    }

    public getHTML () : HTMLElement {
        return this.html;
    }
}