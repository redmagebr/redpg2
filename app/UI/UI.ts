module UI {
    /**
     * Window IDs for Page Calling
     */
    export var idMainWindow = "mainWindow";
    export var idLoginWindow = "loginWindow";
    export var idAccountCreationWindow = "createAccountWindow";

    // Left side windows
    export var idChangelog = "changelogSideWindow";
    export var idGames = "gamesSideWindow";
    export var idChat = "chatSideWindow";
    export var idConfig = "configSideWindow";
    export var idGameInvites = "gameInvitesSideWindow";
    export var idStyles = "stylesSideWindow";
    export var idStyleDesigner = "styleEditorSideWindow";
    export var idInviteDesigner = "gameInviteFormSideWindow";
    export var idGameDesigner = "gameDesignerFormSideWindow";
    export var idRoomDesigner = "roomDesignerFormSideWindow";
    export var idSheetViewer = "sheetViewerSideWindow";
    export var idSheetDesigner = "sheetDesignerFormSideWindow";

    // Right side windows
    export var idHome = "homeSideWindow";
    export var idSheets = "sheetsSideWindow";
    export var idImages = "imagesSideWindow";
    export var idSounds = "soundsSideWindow";
    export var idSheetPerm = "sheetPermSideWindow";

    /**
     * Registered UI Configurations
     */
    Application.Config.registerConfiguration("chatMaxMessages", new NumberConfiguration(120, 60, 10000)); // Chat Font Size
    Application.Config.registerConfiguration("chatshowhelp", new BooleanConfiguration(true)); // Show help messages on top of chat
    Application.Config.registerConfiguration("chatfontsize", new NumberConfiguration(16, 12, 32)); // Chat Font Size
    Application.Config.registerConfiguration("chatfontfamily", new Configuration("caudex")); // Chat Font Family

    Application.Config.registerConfiguration("animTime", new NumberConfiguration(150, 0, 300)); // Animation Time
    Application.Config.registerConfiguration("language", new LanguageConfiguration()); // Current Language
    Application.Config.registerConfiguration("fsmode", new BooleanConfiguration(false)); // Full Screen Mode (forced)
    Application.Config.registerConfiguration("chatuseprompt", new BooleanConfiguration(true)); // Open up message prompt on mobile
    Application.Config.registerConfiguration("autoImage", new NumberConfiguration(1, 0, 2)); // Automatically open shared Images
    Application.Config.registerConfiguration("autoBGM", new NumberConfiguration(1, 0, 2)); // Automatically open shared BGMs
    Application.Config.registerConfiguration("autoSE", new NumberConfiguration(1, 0, 2)); // Automatically open shared Sound Effects
    Application.Config.registerConfiguration("autoVIDEO", new NumberConfiguration(1, 0, 2)); // Automatically open shared Videos
    Application.Config.registerConfiguration("bgmVolume", new NumberConfiguration(50, 0, 100)); // Volume for BGM
    Application.Config.registerConfiguration("seVolume", new NumberConfiguration(50, 0, 100)); // Volume for Sound Effect
    Application.Config.registerConfiguration("bgmLoop", new BooleanConfiguration(true)); // Whether BGMs loop or not

    var cleanPersonaCSS = document.createElement("style");
    cleanPersonaCSS.type = "text/css";
    cleanPersonaCSS.innerHTML = ".avatarContainer { border-color: rgba(0,0,0,0); background-color: initial; } .avatarName { background-color: initial; }";

    var cleanPersonaTotallyCSS = document.createElement("style");
    cleanPersonaTotallyCSS.type = "text/css";
    cleanPersonaTotallyCSS.innerHTML = ".avatarContainer { border-color: rgba(0,0,0,0); background-color: initial; } .avatarName { opacity: 0; }";

    export function cleanPersona (cfg : NumberConfiguration) {
        if (cfg.getValue() === 1) {
            document.head.appendChild(cleanPersonaCSS);
            if (cleanPersonaTotallyCSS.parentElement !== null) {
                cleanPersonaTotallyCSS.parentElement.removeChild(cleanPersonaTotallyCSS);
            }
        } else if (cfg.getValue() === 2) {
            document.head.appendChild(cleanPersonaTotallyCSS);
            if (cleanPersonaCSS.parentElement !== null) {
                cleanPersonaCSS.parentElement.removeChild(cleanPersonaCSS);
            }
        } else {
            if (cleanPersonaTotallyCSS.parentElement !== null) {
                cleanPersonaTotallyCSS.parentElement.removeChild(cleanPersonaTotallyCSS);
            }
            if (cleanPersonaCSS.parentElement !== null) {
                cleanPersonaCSS.parentElement.removeChild(cleanPersonaCSS);
            }
        }
    }

    Application.Config.registerConfiguration("cleanPersonas", new NumberConfiguration(0, 0, 2));
    Application.Config.getConfig("cleanPersonas").addChangeListener(function (cfg : NumberConfiguration) {
        UI.cleanPersona(cfg);
    });
}