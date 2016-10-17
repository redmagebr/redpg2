module UI.Sheets {
    document.getElementById("sheetsButton").addEventListener("click", function () { UI.Sheets.callSelf(); });

    var sheetList = document.getElementById("sheetWindowSheetList");

    var lastFolder : String = null;
    var lastGame : Number = null;

    export function keepOpen (folder : string, gameid : number) {
        lastFolder = folder;
        lastGame = gameid;
    }

    export function keepClosed () {
        lastFolder = null;
        lastGame = null;
    }

    export function callSelf () {
        UI.PageManager.callPage(UI.idSheets);

        Server.Sheets.updateLists(<Listener> {
            handleEvent : function () {
                UI.Sheets.printSheets();
            }
        });
    }

    function empty () {
        while (sheetList.firstChild) sheetList.removeChild(sheetList.firstChild);
    }

    export function printSheets () {
        empty();

        // .sheetListGameContainer.lightHoverable.openSheetGame
        //     %p.sheetListGameName{:onclick=>"this.parentNode.classList.toggle('openSheetGame');"}="Nome da Mesa"
        var games = DB.GameDB.getOrderedGameList();
        for (var k = 0; k < games.length; k++) {
            var game = games[k];
            var wanted = DB.SheetDB.getSheetsByGame(game);
            var sheets = DB.SheetDB.getSheetsByFolder(wanted);

            var gameFolder = document.createElement("div");
            gameFolder.classList.add("sheetListGameContainer");
            gameFolder.classList.add("lightHoverable");
            gameFolder.classList.add("openSheetGame");

            var gameName = document.createElement("p");
            gameName.classList.add("sheetListGameName");
            gameFolder.appendChild(gameName);
            gameName.addEventListener("click", function (e) {
                e.preventDefault();
                this.parentElement.classList.toggle("openSheetGame");
            });
            gameName.appendChild(document.createTextNode(game.getName()));

            if (sheets.length > 0) {
                for (var i = 0; i < sheets.length; i++) {
                    var open = game.getId() === lastGame && sheets[i][0].getFolder() === lastFolder;
                    var sheetFolder = new SheetsFolder(sheets[i], open);
                    gameFolder.appendChild(sheetFolder.getHTML());
                }
            } else {
                var p = document.createElement("p");
                p.classList.add("sheetListNoSheet");
                p.appendChild(document.createTextNode("_SHEETSNOSHEETS_"));
                UI.Language.markLanguage(p);
                gameFolder.appendChild(p);
            }

            var p = document.createElement("p");
            p.classList.add("sheetListNewSheetButton");
            p.classList.add("textLink");
            p.classList.add("lightHoverable");
            p.appendChild(document.createTextNode("> "));
            p.appendChild(document.createTextNode("_SHEETSNEWSHEET_"));
            UI.Language.markLanguage(p);
            gameFolder.appendChild(p);

            p.addEventListener("click", <EventListenerObject> {
                game : game,
                handleEvent : function (e) {
                    e.preventDefault();
                    UI.Sheets.Designer.callSelf(this.game);
                }
            });

            sheetList.appendChild(gameFolder);
        }
    }
}