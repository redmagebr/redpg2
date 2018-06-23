function RedPGAccidentPreventionSystem (e : Event) {
    if (UI.Chat.inRoom()) {
        return UI.Language.getLanguage().getLingo("_RAPSCHATOPEN_");
    } else if (UI.Sheets.SheetManager.hasSheet()) {
        return UI.Language.getLanguage().getLingo("_RAPSSHEETOPEN_");
    }
}

window.onbeforeunload = RedPGAccidentPreventionSystem;