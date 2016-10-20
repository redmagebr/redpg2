module UI.Styles.StyleDesigner {
    var nameInput = <HTMLInputElement> document.getElementById("styleEditorName");
    var publicStyleInput = <HTMLInputElement> document.getElementById("styleEditorPublic");
    var gameSelect = <HTMLSelectElement> document.getElementById("styleEditorGameSelect");
    var copySelect = <HTMLSelectElement> document.getElementById("styleEditorCopySelect");
    var remainInput = <HTMLInputElement> document.getElementById("styleEditorRemain");

    var htmlInput = <HTMLTextAreaElement> document.getElementById("styleEditorHTML");
    var cssInput = <HTMLTextAreaElement> document.getElementById("styleEditorCSS");
    var jsInput = <HTMLTextAreaElement> document.getElementById("styleEditorJS");
    var publicCodeInput = <HTMLTextAreaElement> document.getElementById("styleEditorPublicCode");

    var publicStyleLabel = document.getElementById("styleEditorPublicLabel");
    var copyLabel = document.getElementById("styleEditorCopyLabel");
    var gameLabel = document.getElementById("styleEditorGameLabel");
    var remainLabel = document.getElementById("styleEditorRemainLabel");

    var currentStyle : StyleInstance = null;

    document.getElementById("styleEditorCopyButton").addEventListener("click", function (e) {
        e.preventDefault();
        UI.Styles.StyleDesigner.copy();
    });

    document.getElementById("styleEditorForm").addEventListener("submit", function (e) {
        e.preventDefault();
        UI.Styles.StyleDesigner.submit();
    });

    document.getElementById("stylesNewStyleButton").addEventListener("click", function (e) {
        e.preventDefault();
        UI.Styles.StyleDesigner.callSelf();
    });

    function empty () {
        nameInput.value = "";
        htmlInput.value = "";
        cssInput.value = "";
        jsInput.value = "";
        publicCodeInput.value = "";
        publicStyleInput.checked = false;
    }

    function emptyGameSelect () {
        while (gameSelect.firstChild !== null) gameSelect.removeChild(gameSelect.firstChild);
    }

    export function callSelf (id? : number) {
        UI.PageManager.callPage(UI.idStyleDesigner);

        if (Application.getMe().isAdmin()) {
            publicStyleLabel.style.display = "";
        } else {
            publicStyleLabel.style.display = "none";
        }

        var games = DB.GameDB.getOrderedGameList();
        if (games.length < 1) {
            emptyGameSelect();
            var option = <HTMLOptionElement> document.createElement("option");
            option.value = "0";
            gameSelect.appendChild(option);
            gameSelect.value = "0";

            gameLabel.style.display = "none";
        } else {
            gameLabel.style.display = "";
            emptyGameSelect();
            for (var i = 0; i < games.length; i++ ){
                var game : Game = games[i];
                var option = <HTMLOptionElement> document.createElement("option");
                option.value = game.getId().toString();
                option.appendChild(document.createTextNode(game.getName()));
                gameSelect.appendChild(option);
            }
        }

        var styles = DB.StyleDB.getStyles();
        copyLabel.style.display = "none";
        while (copySelect.firstChild !== null) copySelect.removeChild(copySelect.firstChild);

        for (var i = 0; i < styles.length; i++ ){
            var style : StyleInstance = styles[i];
            if (id !== undefined && style.id.toString() === id.toString()) continue;
            copyLabel.style.display = "";
            var option = <HTMLOptionElement> document.createElement("option");
            option.value = style.id.toString();
            option.appendChild(document.createTextNode(style.name));
            copySelect.appendChild(option);
        }

        empty();
        currentStyle = null;
        if (id !== undefined) {
            var cbs = <EventListenerObject> {
                id : id,
                handleEvent : function () {
                    UI.Styles.StyleDesigner.loadStyle(this.id);
                }
            };

            var cbe = <EventListenerObject> {
                handleEvent : function () { UI.Styles.callSelf(); }
            };

            Server.Sheets.loadStyle(id, cbs, cbe);
        }

        if (id !== undefined) {
            remainLabel.style.display = "";
        } else {
            remainLabel.style.display = "none";
        }
    }

    export function copy () {
        fillWithStyle(DB.StyleDB.getStyle(parseInt(copySelect.value)), true);
    }

    export function loadStyle (id : number) {
        currentStyle = DB.StyleDB.getStyle(id);
        fillWithStyle(currentStyle);
    }

    export function fillWithStyle (style : StyleInstance, copy? :boolean) {
        if (copy !== true) {
            nameInput.value = style.name;
            publicStyleInput.checked = style.publicStyle;
            gameSelect.value = style.gameid.toString();
        }
        htmlInput.value = style.html;
        cssInput.value = style.css;
        jsInput.value = style.mainCode;
        publicCodeInput.value = style.publicCode;
    }

    export function submit () {
        var style : StyleInstance;
        if (currentStyle === null) {
            // CREATE
            style = new StyleInstance();
        } else {
            style = currentStyle;
        }
        style.name = nameInput.value;
        style.mainCode = jsInput.value;
        style.css = cssInput.value;
        style.publicCode = publicCodeInput.value;
        style.html = htmlInput.value;
        style.publicStyle = publicStyleInput.checked;
        style.gameid = parseInt(gameSelect.value);

        var cbs = function () { UI.Styles.StyleDesigner.finish(); };
        var cbe = function () {};
        console.log(style);
        Server.Sheets.sendStyle(style, cbs, cbe);
    }

    export function finish () {
        if (!remainInput.checked || currentStyle === null) {
            UI.Styles.callSelf();
        }
    }
}