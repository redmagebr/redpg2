class PicaToolShare extends PicaTool {
    constructor () {
        super();

        this.setIcon("icons-picaToolShare");
        this.setLeftSide();
        this.setTitleLingo("_PICASHARE_");
    }

    public onClick () {
        var url = UI.Pica.Board.getUrl();
        var newImage = new MessageImage();
        newImage.findPersona();
        newImage.setName(name); // WE don't hold on to the name, so this is not possibru!
        newImage.setMsg(url);
        UI.Chat.sendMessage(newImage);
    }
}