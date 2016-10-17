class SheetsFolder {
    private html : HTMLElement;
    private folderContainer : HTMLElement;

    constructor (sheets : Array<SheetInstance>, open? : boolean) {
        var folderName = sheets[0].folder;
        if (folderName === "") {
            folderName = UI.Language.getLanguage().getLingo("_SHEETSNOFOLDERNAME_");
        }

        // .sheetListFolderContainer.lightHoverable.openSheetFolder
        this.html = document.createElement("div");
        this.html.classList.add("sheetListFolderContainer");
        this.html.classList.add("lightHoverable");
        if (open === true) {
            this.html.classList.add("openSheetFolder");
        }

        // %p.sheetListFolderName{:onclick=>"this.parentNode.classList.toggle('openSheetFolder');"}="Nome da pasta"
        var p = document.createElement("p");
        p.classList.add("sheetListFolderName");
        p.appendChild(document.createTextNode(folderName));
        p.addEventListener("click", function (e) {
            e.preventDefault();
            this.parentElement.classList.toggle("openSheetFolder");
        });
        this.html.appendChild(p);

        for (var i = 0; i < sheets.length; i++) {
            var sheet = new SheetsRow (sheets[i]);
            this.html.appendChild(sheet.getHTML());
        }
    }

    public getHTML () {
        return this.html;
    }
}