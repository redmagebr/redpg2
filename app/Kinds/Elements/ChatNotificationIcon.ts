class ChatNotificationIcon {
    private element : HTMLElement = document.createElement("div");
    private hoverInfo : HTMLElement = document.createElement("div");
    private language : boolean;

    constructor (icon : string, hasLanguage? : boolean) {
        this.language = hasLanguage === undefined ? true : hasLanguage;

        this.element.classList.add("chatNotificationIcon");
        this.element.classList.add(icon);
        this.hoverInfo.classList.add("chatNotificationHover");

        if (this.language) {
            this.element.appendChild(this.hoverInfo);
        }

        this.element.style.display = "none";
    }

    public addText (text : string) {
        this.hoverInfo.appendChild(document.createTextNode(text));
    }

    public getElement () {
        if (this.language) {
            UI.Language.markLanguage(this.hoverInfo);
        }
        return this.element;
    }

    public show () {
        if (this.element.style.display === "") {
            return false;
        }
        this.element.style.display = "";
        return true;
    }

    public hide () {
        if (this.element.style.display === "none") {
            return false;
        }
        this.element.style.display = "none";
        return true;
    }
}