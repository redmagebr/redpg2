module UI.Sounds {
    document.getElementById("soundsButton").addEventListener("click", function () { UI.Sounds.callSelf(); });
    document.getElementById("dropboxSoundsButton").addEventListener("click", function () { UI.Sounds.callDropbox(); });

    var bgmInput : HTMLInputElement = <HTMLInputElement> document.getElementById("dropboxSoundsIsBGM");
    var folderInput : HTMLInputElement = <HTMLInputElement> document.getElementById("dropboxFolderName");

    var target = document.getElementById("soundsTarget");
    var loadError = document.getElementById("soundsLoadError");
    var saveError = document.getElementById("soundsSaveError");
    target.removeChild(saveError);
    target.removeChild(loadError);

    var autoFolder : String = null;

    function emptyTarget (){
        while (target.firstChild !== null) {
            target.removeChild(target.lastChild);
        }
    }

    export function callSelf () {
        UI.PageManager.callPage(UI.idSounds);

        var cbs = {handleEvent: function () {
            UI.Sounds.printSounds();
        }};

        var cbe = {handleEvent: function (data) {
            UI.Sounds.printError(data, true);
        }};

        Server.Storage.requestSounds(cbs, cbe);
    }

    export function printSounds () {
        emptyTarget();

        var sounds = DB.SoundDB.getSoundsByFolder();

        for (var i = 0; i < sounds.length; i++) {
            var folder = new SoundsFolder(sounds[i]);

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
                UI.Sounds.addDropbox(files);
            },
            linkType: "preview",
            multiselect: true,
            extensions: ['audio'],
        };
        Dropbox.choose(options);
    }

    export function addDropbox (files) {
        var intendedFolder = folderInput.value.trim();
        folderInput.value = "";
        var folders : Array<string> = [];

        var links : Array<SoundLink> = [];
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

            var link = new SoundLink(name, originalUrl, folderName, bgmInput.checked);
            links.push(link);

            if (folders.indexOf(folderName) === -1) {
                folders.push(folderName);
            }
        }
        DB.SoundDB.addSounds(links);

        if (folders.length === 1) {
            autoFolder = folders[0];
        } else {
            autoFolder = null;
        }

        printSounds();
    }
}