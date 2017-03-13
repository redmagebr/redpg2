class PicaToolLock extends PicaTool {
    private lockedIcon = "icons-picaToolLockLocked";
    private unlockedIcon = "icons-picaToolLockUnlocked";

    constructor () {
        super();

        this.setIcon(this.lockedIcon);
        this.setRightSide();
    }

    public updateVisibility () {
        var m = <MemoryPica> Server.Chat.Memory.getConfiguration("Pica");
        if (m.isPicaAllowed()) {
            this.a.classList.add(this.unlockedIcon);
            this.a.classList.remove(this.lockedIcon);
        } else {
            this.a.classList.add(this.lockedIcon);
            this.a.classList.remove(this.unlockedIcon);
        }
    }

    public onClick () {
        var room = Server.Chat.getRoom();
        if (room != null) {
            var me = room.getMe();
            if (me.isStoryteller()) {
                var m = <MemoryPica> Server.Chat.Memory.getConfiguration("Pica");
                m.picaAllowedStore(!m.isPicaAllowed());
            }
        }
    }
}

var tool = new PicaToolLock();
UI.Pica.Toolbar.registerTool(tool);
delete(tool);