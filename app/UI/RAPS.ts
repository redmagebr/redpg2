function RedPGAccidentPreventionSystem (e : Event) {
    if (UI.Chat.inRoom()) {
        return UI.Language.getLanguage().getLingo("_RAPSCHATOPEN_");
    } else if (UI.Sheets.SheetManager.hasSheet()) {
        return UI.Language.getLanguage().getLingo("_RAPSSHEETOPEN_");
    }
}

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    var confirmationMessage = RedPGAccidentPreventionSystem(e);

    if (confirmationMessage != undefined) {
        (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
        return confirmationMessage;                                //Webkit, Safari, Chrome etc.
    }
});