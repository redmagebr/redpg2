class PicaToolScaling extends PicaTool {
    protected scaling : number = -1;

    constructor () {
        super();

        UI.Pica.Board.addResizeListener(<EventListenerObject> {
            scaler : this,
            handleEvent : function () {
                this.scaler.updateEquality();
            }
        });
    }

    public onClick () {
        UI.Pica.Board.setImageScaling(this.scaling);
    }

    public updateEquality () {
        var cS = UI.Pica.Board.getScaling();
        this.setSelected(cS == this.scaling);
    }
}