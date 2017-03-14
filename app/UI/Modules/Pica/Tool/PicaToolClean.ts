class PicaToolClean extends PicaTool {

    constructor () {
        super();

        this.setIcon("icons-picaToolClean");
        this.setRightSide();
        this.setTitleLingo("_PICACLEAN_");
    }

    public onClick () {
        var msg = new MessagePica();
        var url = UI.Pica.Board.getUrl();
        msg.setUrl(url);
        msg.setCleanArts(true);
        UI.Chat.sendMessage(msg);
    }
}

var tool = new PicaToolClean();
UI.Pica.Toolbar.registerTool(tool);
delete(tool);