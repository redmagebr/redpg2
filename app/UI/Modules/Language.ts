/**
 * Created by Reddo on 24/09/2015.
 */
module UI.Language {
    var currentLanguage : Lingo = null;
    var flagContainer = document.getElementById("loginFlagContainer");

    var list = LingoList.getLingos();
    var a : HTMLElement;
    var clickF = function () {
        localStorage.setItem("lastLanguage", this.ids[0]);
        Application.Config.getConfig("language").storeValue(this.ids[0]);
    };
    for (var i = 0; i < list.length; i++) {
        a = document.createElement("a");
        a.classList.add("flagIcon");
        a.classList.add("icons-flag" + list[i].flagIcon);
        a.classList.add("buttonBehavior");

        a.addEventListener("click", clickF.bind(list[i]));

        a.setAttribute("title", list[i].name);

        flagContainer.appendChild(a);
    }
    delete (list, i, a, clickF);

    Application.Config.registerChangeListener("language", <Listener> {
        handleEvent : function () {
            var oldLanguage = UI.Language.getLanguage();
            UI.Language.searchLanguage();
            var newLanguage = UI.Language.getLanguage();

            if (oldLanguage !== newLanguage) {
                UI.Language.updateScreen();
            }
        }
    });

    export function getLanguage () {
        return currentLanguage;
    }

    export function searchLanguage () {
        if (Application.Login.isLogged()) {
            var lingid = Application.Config.getConfig("language").getValue();
            currentLanguage = LingoList.getLingo(lingid);
        } else {
            if (localStorage.getItem("lastLanguage") !== null) {
                currentLanguage = LingoList.getLingo(localStorage.getItem("lastLanguage"));
            } else {
                currentLanguage = LingoList.getLingo(navigator.language);
            }
        }
        localStorage.setItem("lastLanguage", currentLanguage.ids[0]);
    }

    export function updateScreen (target? : HTMLElement | Document) {
        target = target === undefined ? document : target;
        var elements = target.getElementsByClassName("language");
        for (var i = 0; i < elements.length; i++) {
            updateElement(<HTMLElement> elements[i]);
        }
    }

    export function updateElement (element : HTMLElement) {
        if (element.dataset['languagenodes'] === undefined) {
            processElement(element);
        }

        if (currentLanguage === null) return;

        updateText(element);
    }

    export function updateText (element : HTMLElement) {
        if (currentLanguage === null) return;
        if (element.dataset['languagenodes'] !== "" && element.dataset['languagenodes'] !== undefined) {
            var nodes = element.dataset['languagenodes'].split(";");
            var ids = element.dataset['languagevalues'].split(";");

            for (var i = 0; i < nodes.length; i++) {
                element.childNodes[parseInt(nodes[i])].nodeValue = currentLanguage.getLingo(ids[i], element.dataset);
            }
        }

        if (element.dataset['valuelingo'] !== undefined) {
            updateInput (<HTMLInputElement> element);
        }

        if (element.dataset['placeholderlingo'] !== undefined) {
            updatePlaceholder (<HTMLInputElement> element);
        }

        if (element.dataset['titlelingo'] !== undefined) {
            updateTitle (element);
        }
    }

    function updatePlaceholder (element :HTMLInputElement) {
        element.placeholder = currentLanguage.getLingo(element.dataset['placeholderlingo'], element.dataset);
    }

    function updateInput (element : HTMLInputElement) {
        element.value = currentLanguage.getLingo(element.dataset['valuelingo'], element.dataset);
    }

    function updateTitle (element : HTMLElement) {
        element.setAttribute("title", currentLanguage.getLingo(element.dataset['titlelingo'], element.dataset));
    }

    function processElement (element : HTMLElement) {
        var ele : Node;
        var languageNodes = [];
        var languageValues = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            ele = element.childNodes[i];
            if (ele.nodeType === Node.TEXT_NODE) {
                var text = ele.nodeValue.trim();
                if (text.charAt(0) === "_") {
                    languageNodes.push(i.toString());
                    languageValues.push(text);
                }
            }
        }

        element.dataset['languagenodes'] = languageNodes.join(";");
        element.dataset['languagevalues'] = languageValues.join(";");

        //updateText(element);
    }

    export function addLanguageVariable (element : HTMLElement, id : string, value : string) {
        element.dataset['language' + id] = value;
    }

    export function addLanguageValue (element : HTMLElement, value : string) {
        element.dataset['valuelingo'] = value;
    }

    export function addLanguagePlaceholder (element : HTMLElement, value : string) {
        element.dataset['placeholderlingo'] = value;
    }

    export function addLanguageTitle (element : HTMLElement, value : string) {
        element.dataset['titlelingo'] = value;
    }

    export function markLanguage (...elements : HTMLElement[]) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.classList.add("language");
            processElement(element);
            updateText(element);
        }
    }
}