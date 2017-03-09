abstract class PicaTool {
    public abstract getHTML () : HTMLElement;
    public abstract onHover () : void; // On hover is optional
    public abstract onClick () : void;
    public abstract updateVisibility (isStoryteller : boolean, isPicaDraw : boolean) : void;
}

// %a.leftPicaToolButton.language.icons-picaShare{:data=>{:titlelingo=>"_PICASHARE_"}}
// %a.rightPicaToolButton
// %a.picaTool="Compartilhar"
// %a.picaToolButton
// %a.picaToolButton
// %a.picaToolButton
// %a.picaToolButton