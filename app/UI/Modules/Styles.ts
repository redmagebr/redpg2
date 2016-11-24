module UI.Styles {
    document.getElementById("sheetsStyleButton").addEventListener("click", function () { UI.Styles.callSelf(); });

    var target = document.getElementById("styleListTarget");

    export function callSelf () {
        UI.PageManager.callPage(UI.idStyles);

        var cbs = {
            handleEvent : function (styles) {
                UI.Styles.printStyles(styles);
            }
        };

        Server.Sheets.updateStyles(cbs);
    }

    export function emptyTarget() {
        while (target.firstChild) target.removeChild(target.firstChild);
    }

    export function printStyles (styles : Array<StyleInfo>) {
        emptyTarget();

        // %p.mainWindowParagraph.language.textLink.hoverable

        for (var i = 0; i < styles.length; i++) {
            if (styles[i].name.indexOf("RedPG1") !== -1) {
                continue;
            }
            var p = document.createElement("p");
            p.classList.add("mainWindowParagraph");
            p.classList.add("hoverable");
            p.classList.add("textLink");

            p.appendChild(document.createTextNode(styles[i].name));

            p.addEventListener("click", <EventListenerObject> {
                id : styles[i].id,
                handleEvent : function () {
                    UI.Styles.StyleDesigner.callSelf(this.id);
                }
            });

            target.appendChild(p);
        }
    }
}