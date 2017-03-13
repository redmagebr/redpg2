class PicaToolColor extends PicaTool {
    constructor () {
        super();

        this.a = document.createElement("input");
        this.a.id= "colopica";
        this.a.type = "color";

        this.a.addEventListener("change", function () {
            UI.Pica.Board.Canvas.setPenColor(this.value.substr(1));
        });

        UI.Pica.Board.Canvas.addPenListener(<EventListenerObject> {
            a : this.a,
            handleEvent : function () {
                this.a.value = "#" + UI.Pica.Board.Canvas.getPenColor();
            }
        });
    }
}

var tool = new PicaToolColor();
UI.Pica.Toolbar.registerTool(tool);
delete(tool);