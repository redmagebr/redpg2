/// <reference path='Toolbar.ts' />
class PicaTool {
    protected a = document.createElement("a");
    protected selected = false;
    protected icon = "picaToolNone";

    constructor () {
        this.a.classList.add("picaToolButton");

        this.a.addEventListener("click", <EventListenerObject> {
            tool : this,
            handleEvent : function () {
                this.tool.onClick();
            }
        });
    }

    protected setIcon (icon : string) {
        this.icon = icon;
        this.updateIcon();
    }

    public setSelected (selected: boolean) {
        this.selected = selected;
        this.updateIcon();
    }

    protected updateIcon () {
        if (this.selected) {
            this.a.classList.remove(this.icon);
            this.a.classList.add(this.icon + "Active");
        } else {
            this.a.classList.add(this.icon)
            this.a.classList.remove(this.icon + "Active");
        }
    }

    protected setLeftSide () {
        this.a.classList.remove("picaToolButton");
        this.a.classList.remove("rightPicaToolButton");
        this.a.classList.add("leftPicaToolButton");
    }

    protected setRightSide () {
        this.a.classList.remove("picaToolButton");
        this.a.classList.remove("leftPicaToolButton");
        this.a.classList.add("rightPicaToolButton");
    }

    protected setTitleLingo (str : string) {
        UI.Language.addLanguageTitle(this.a, str);
        UI.Language.markLanguage(this.a);
    }

    public onClick () {

    }

    public getHTML () {
        return this.a;
    }
}