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
    Application.Config.registerConfiguration("chatAutoRolls", new NumberConfiguration(0, 0, 1)); // Open up message prompt on mobile
    Application.Config.registerConfiguration("autoImage", new NumberConfiguration(1, 0, 2)); // Automatically open shared Images
    Application.Config.registerConfiguration("autoBGM", new NumberConfiguration(1, 0, 2)); // Automatically open shared BGMs
    Application.Config.registerConfiguration("autoSE", new NumberConfiguration(1, 0, 2)); // Automatically open shared Sound Effects
    Application.Config.registerConfiguration("autoVIDEO", new NumberConfiguration(1, 0, 2)); // Automatically open shared Videos
    Application.Config.registerConfiguration("bgmVolume", new NumberConfiguration(50, 0, 100)); // Volume for BGM
    Application.Config.registerConfiguration("seVolume", new NumberConfiguration(50, 0, 100)); // Volume for Sound Effect
    Application.Config.registerConfiguration("bgmLoop", new BooleanConfiguration(true)); // Whether BGMs loop or not
    Application.Config.registerConfiguration("hqRainbow", new NumberConfiguration(1, 0, 2)); // Automatically open shared Videos
    Application.Config.registerConfiguration("screeneffects", new BooleanConfiguration(true));
    Application.Config.registerConfiguration("hideMessages", new BooleanConfiguration(false));
}