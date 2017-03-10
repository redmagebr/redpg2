class PicaTool {
    protected a = document.createElement("a");
    protected storytellerOnly : boolean = false;
    protected requiresArtPermission : boolean = false;

    constructor () {
        this.a.addEventListener("click", <EventListenerObject> {
            tool : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.tool.onClick();
            }
        });

        this.a.addEventListener("mousein", <EventListenerObject> {
            tool : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.tool.onMouseIn();
            }
        });

        this.a.addEventListener("mouseout", <EventListenerObject> {
            tool : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.tool.onMouseOut();
            }
        });
    }

    public getHTML () : HTMLElement {
        return this.a;
    }

    public onMouseIn () : void {}

    public onMouseOut () : void {}

    public onClick () : void {}

    public updateVisibility (isStoryteller : boolean, isPicaDraw : boolean) : void {
        var visible = (isStoryteller || !this.storytellerOnly) && (!this.requiresArtPermission || isPicaDraw);
        this.a.style.display = visible ? "" : "none";
    }
}

// %a.leftPicaToolButton.language.icons-picaShare{:data=>{:titlelingo=>"_PICASHARE_"}}
// %a.rightPicaToolButton
// %a.picaTool="Compartilhar"
// %a.picaToolButton
// %a.picaToolButton
// %a.picaToolButton
// %a.picaToolButton