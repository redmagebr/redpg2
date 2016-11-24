/// <reference path='../../Changelog.ts' />
module UI.ChangelogManager {
    var currentVersionNode : Text = <Text> document.getElementById("changelogCurrentVersion").childNodes[0];
    var externalVersionNode : Text = <Text> document.getElementById("changelogActualVersion").childNodes[0];
    var warning = document.getElementById("changelogWarning");
    var target = document.getElementById("changelogTarget");

    export function print () {
        empty();

        var localVersion = Changelog.getLocalVersion();
        var externalVersion = Changelog.getExternalVersion();
        if (externalVersion !== null) {
            if (localVersion.toString() === externalVersion.toString()) {
                warning.style.display = "none";
            } else {
                warning.style.display = "";
            }
            currentVersionNode.nodeValue = localVersion[0] + "." + localVersion[1] + "." + localVersion[2];
            externalVersionNode.nodeValue = externalVersion[0] + "." + externalVersion[1] + "." + externalVersion[2];
        } else {
            warning.style.display = "";
            currentVersionNode.nodeValue = localVersion[0] + "." + localVersion[1] + "." + localVersion[2];
            externalVersionNode.nodeValue = "?.?.?";
        }

        var updates = Changelog.getUpdates();
        for (var i = 0; i < updates.length; i++) {
            addOnTop(updates[i].getHTML(false));
        }

        updates = Changelog.getMissingUpdates();
        for (var i = 0; i < updates.length; i++) {
            addOnTop(updates[i].getHTML(true))
        }
    }

    function empty () {
        while (target.firstChild !== null) {
            target.removeChild(target.firstChild);
        }
    }

    function addOnTop (ele : HTMLElement) {
        if (target.firstChild !== null) {
            target.insertBefore(ele, target.firstChild);
        } else {
            target.appendChild(ele);
        }
    }

    addOnReady("UI.ChangelogManager", "Printing initial Changelog", <Listener> {
        handleEvent : function () {
            UI.ChangelogManager.print();
        }
    });
}