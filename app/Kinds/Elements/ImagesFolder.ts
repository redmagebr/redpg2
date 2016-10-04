class ImagesFolder {
    private html : HTMLElement;

    // .imagesFolder
    //     %a.imagesFolderIcon
    //     %span.imagesFolderTitle{:onclick => "this.parentNode.classList.toggle('folderOpen');"}="Nome da Pasta"
    constructor (images : Array<ImageLink>) {
        var folderName = images[0].getFolder();
        if (folderName === "") {
            folderName = UI.Language.getLanguage().getLingo("_IMAGESNOFOLDERNAME_");
        }

        var folderContainer = document.createElement("div");
        folderContainer.classList.add("imagesFolder");

        var folderIcon = document.createElement("a");
        folderIcon.classList.add("imagesFolderIcon");

        var folderTitle = document.createElement("span");
        folderTitle.classList.add("imagesFolderTitle");
        folderTitle.addEventListener("click", function () { (<HTMLElement> this.parentNode).classList.toggle('folderOpen'); });
        folderTitle.appendChild(document.createTextNode(folderName));

        folderContainer.appendChild(folderIcon);
        folderContainer.appendChild(folderTitle);

        for (var k = 0; k < images.length; k++) {
            var imageRow = new ImagesRow(images[k]);
            folderContainer.appendChild(imageRow.getHTML());
        }

        this.html = folderContainer;
    }

    public getHTML () {
        return this.html;
    }
}