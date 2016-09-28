class ChatSystemMessage {
    private element : HTMLElement = document.createElement("p");

    private hasLanguage : boolean;

    constructor (hasLanguage : boolean) {
        this.element.classList.add("chatMessageNotification");
        this.hasLanguage = hasLanguage;
    }

    public addLangVar (id : string, value : string) {
        UI.Language.addLanguageVariable(this.element, id, value);
    }

    public addTextLink (text : string, hasLanguage : boolean, click : Listener | Function) {
        var a = document.createElement("a");
        a.classList.add("textLink");

        a.appendChild(document.createTextNode(text));

        if (hasLanguage) {
            UI.Language.markLanguage(a);
        }

        a.addEventListener("click", <EventListenerObject> click);

        this.element.appendChild(a);
    }

    public addText (text : string) {
        this.element.appendChild(document.createTextNode(text));
    }

    public addElement (ele : HTMLElement) {
        this.element.appendChild(ele);
    }

    public getElement () : HTMLElement {
        if (this.hasLanguage) {
            UI.Language.markLanguage(this.element);
        }
        return this.element;
    }
}