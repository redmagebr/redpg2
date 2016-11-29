module UI.Chat.Filters {
    var filterWindow = document.getElementById("moodWindow");

    var moodButton = document.getElementById("chatMoodButton");

    moodButton.addEventListener("click", function () {
        UI.Chat.Filters.toggle();
    });

    Server.Chat.addRoomListener(function () {
        UI.Chat.Filters.updateButton();
    });

    var mem = <MemoryFilter> Server.Chat.Memory.getConfiguration("Mood");

    mem.addChangeListener(function () {
        UI.Chat.Filters.updateEffects();
    });

    var cfg = <BooleanConfiguration> Application.Config.getConfig("screeneffects");

    cfg.addChangeListener(function () {
        UI.Chat.Filters.updateEffects();
    });

    export function toggle () {
        filterWindow.style.display = filterWindow.style.display === "" ? "none" : "";
    }

    export function close () {
        filterWindow.style.display = "none";
    }

    export function updateButton () {
        var room = Server.Chat.getRoom();
        if (room !== null) {
            var me = room.getMe();
            if (me.isStoryteller()) {
                moodButton.style.display = "";
                return;
            }
        }
        moodButton.style.display = "none";
        UI.Chat.Filters.close();
    }

    export function applyFilter (name : string) {
        var mem = <MemoryFilter> Server.Chat.Memory.getConfiguration("Mood");
        mem.storeName(name);
        UI.Chat.Filters.close();
    }

    function removeEffects () {
        var w = UI.WindowManager.getWindow(UI.idMainWindow);
        for (var i = 0; i < MemoryFilter.names.length; i++) {
            w.classList.remove(MemoryFilter.names[i]);
        }
    }

    export function updateEffects () {
        removeEffects();
        if (cfg.getValue() && mem.getValue() !== "none") {
            var w = UI.WindowManager.getWindow(UI.idMainWindow);
            w.classList.add(mem.getValue());
        }
    }

    close();
    updateButton();
}