/// <reference path='References.ts' />

// Set up language
UI.Language.searchLanguage();

// Read and detach pages
UI.PageManager.readWindows();

// Update window sizes
UI.WindowManager.updateWindowSizes();

// Return to loginWindow on logout, return to mainWindow on login
Application.Login.addListener({
    handleEvent: function () {
        if (Application.Login.isLogged()) {
            UI.WindowManager.callWindow(('mainWindow'));

            // Set up initial pages of main window
            UI.PageManager.callPage(UI.idChangelog);
            UI.PageManager.callPage(UI.idHome);
        } else {
            UI.WindowManager.callWindow("loginWindow");
            UI.Login.resetState();
            UI.Login.resetFocus();
        }
    }
});

// Search for old logins and fill out remembered inputs
Application.Login.searchLogin();
UI.Login.resetState();

// Do we have a session we can use or do we go straight to login screen?
UI.WindowManager.callWindow("loginWindow");
if (Application.Login.hasSession()) {
    Server.Login.requestSession(false);
} else {
    UI.Login.resetFocus();
}

// Call any onReady listeners
allReady();