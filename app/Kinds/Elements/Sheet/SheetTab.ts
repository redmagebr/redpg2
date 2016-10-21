class SheetTab {
    private sheet : SheetInstance;

    private div : HTMLElement = document.createElement("div");
    private text : Text = document.createTextNode("");

    constructor (sheet : SheetInstance) {
        this.sheet = sheet;
        this.div.classList.add("sheetTab");
        this.div.appendChild(this.text);

        this.div.addEventListener("click", <EventListenerObject> {
            tab : this,
            handleEvent : function (e) {
                e.preventDefault();
                this.tab.click();
            }
        });

        sheet.addChangeListener(<Listener> {
            tab :this,
            handleEvent : function () {
                this.tab.checkNPCStatus();
                this.tab.updateName();
            }
        });

        this.checkNPCStatus();
        this.updateName();
    }

    public updateName () {
        this.text.nodeValue = this.sheet.getName();
    }

    public checkNPCStatus () {
        var player = this.sheet.getValue("Player") !== undefined ? this.sheet.getValue("Player") :
                        this.sheet.getValue("Jogador") !== undefined ? this.sheet.getValue("Jogador") :
                            this.sheet.getValue("Owner") !== undefined ? this.sheet.getValue("Owner") :
                                this.sheet.getValue("Dono") !== undefined ? this.sheet.getValue("Dono") :
                                    undefined;

        if (player !== undefined && player.toUpperCase() === "NPC") {
            this.toggleNpc();
        } else {
            this.toggleCharacter();
        }
    }

    public getHTML () {
        return this.div;
    }

    public toggleNpc () {
        this.div.classList.remove("character");
    }

    public toggleCharacter () {
        this.div.classList.add("character");
    }

    public toggleOn () {
        this.div.classList.add("toggled");
    }

    public toggleOff () {
        this.div.classList.remove("toggled");
    }

    public click () {
        UI.Sheets.SheetManager.openSheet(this.sheet);
    }
}