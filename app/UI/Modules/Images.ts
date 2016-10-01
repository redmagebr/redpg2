declare module Dropbox {
    function choose (options);
}

module UI.Images {
    document.getElementById("imagesButton").addEventListener("click", function () { UI.Images.callSelf(); });
    document.getElementById("dropboxImagesButton").addEventListener("click", function () { UI.Images.callDropbox(); });

    var target = document.getElementById("imagesTarget");
    var loadError = document.getElementById("imagesLoadError");
    var saveError = document.getElementById("imagesSaveError");
    target.removeChild(saveError);
    target.removeChild(loadError);

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

        // .imagesFolder
        //     %a.imagesFolderIcon
        //     %span.imagesFolderTitle{:onclick => "this.parentNode.classList.toggle('folderOpen');"}="Nome da Pasta"
        
        var images = DB.ImageDB.getImagesByFolder();

        for (var i = 0; i < images.length; i++) {
            var folderName = images[i][0].getFolder();
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

            for (var k = 0; k < images[i].length; k++) {
                var imageRow = new ImagesRow(images[i][k]);
                folderContainer.appendChild(imageRow.getHTML());
            }

            target.appendChild(folderContainer);
        }
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
        console.log(files);
    }
}