module UI.Images {
    document.getElementById("imagesButton").addEventListener("click", function () { UI.Images.callSelf(); });
    document.getElementById("dropboxImagesButton").addEventListener("click", function () { UI.Images.callDropbox(); });

    var folderInput : HTMLInputElement = <HTMLInputElement> document.getElementById("dropboxImagesFolderName");

    var target = document.getElementById("imagesTarget");
    var loadError = document.getElementById("imagesLoadError");
    var saveError = document.getElementById("imagesSaveError");
    target.removeChild(saveError);
    target.removeChild(loadError);

    var autoFolder : String = null;

    function emptyTarget (){
        while (target.firstChild !== null) {
            target.removeChild(target.lastChild);
        }
    }

    export function callSelf () {
        UI.PageManager.callPage(UI.idImages);

        var cbs = {handleEvent: function () {
            UI.Images.printImages();
        }};

        var cbe = {handleEvent: function (data) {
            UI.Images.printError(data, true);
        }};

        Server.Storage.requestImages(cbs, cbe);
    }

    export function printImages () {
        emptyTarget();
        
        var images = DB.ImageDB.getImagesByFolder();

        for (var i = 0; i < images.length; i++) {
            var folder = new ImagesFolder(images[i]);

            if (folder.getName() === autoFolder) {
                folder.open();
            }

            target.appendChild(folder.getHTML());
        }

        autoFolder = null;
    }

    export function stayInFolder (name : string) {
        autoFolder = name;
    }

    export function printError (data, onLoad : boolean) {
        emptyTarget();
        if (onLoad) {
            target.appendChild(loadError);
        } else {
            target.appendChild(saveError);
        }
    }

    export function callDropbox () {
        var options = {
            success: function(files) {
                UI.Images.addDropbox(files);
            },
            linkType: "preview",
            multiselect: true,
            extensions: ['images'],
        };
        Dropbox.choose(options);
    }

    export function addDropbox (files) {
        var intendedFolder = folderInput.value.trim();
        folderInput.value = "";
        var folders : Array<string> = [];

        var links : Array<ImageLink> = [];
        for (var i = 0; i < files.length; i++) {
            var originalName = files[i]['name'].substring(0, files[i]['name'].lastIndexOf('.'));;
            var originalUrl = Server.URL.fixURL(files[i]['link']);

            var name;
            var folderName;
            var hiphenPos = originalName.indexOf("-");
            if (intendedFolder !== "") {
                folderName = intendedFolder;
                name = originalName.trim();
            } else if (hiphenPos === -1) {
                folderName = "";
                name = originalName.trim();
            } else {
                folderName = originalName.substr(0, hiphenPos).trim();
                name = originalName.substr(hiphenPos+1, originalName.length - (hiphenPos+1)).trim();
            }

            var link = new ImageLink(name, originalUrl, folderName);
            links.push(link);

            if (folders.indexOf(folderName) === -1) {
                folders.push(folderName);
            }
        }
        DB.ImageDB.addImages(links);

        if (folders.length === 1) {
            autoFolder = folders[0];
        } else {
            autoFolder = null;
        }

        printImages();
    }
}