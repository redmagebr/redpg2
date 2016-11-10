module UI.Chat.Combat {
    var floater = document.getElementById("combatFloater");
    var $floater = $(floater).draggable({
        containment : '#chatSideWindow',
        handle : '#combatHandle'
    }).hide();

    document.getElementById("combatMinus").addEventListener("click", function () { UI.Chat.Combat.hide(); });
    document.getElementById("chatCombatButton").addEventListener("click", function () { UI.Chat.Combat.open(); });
    document.getElementById("combatAddSheet").addEventListener("click", function () { UI.Chat.Combat.addSheet(); });
    document.getElementById("combatNewRound").addEventListener("click", function () { UI.Chat.Combat.newRound(); });
    document.getElementById("combatNextTurn").addEventListener("click", function () { UI.Chat.Combat.nextTurn(); });
    document.getElementById("combatEndCombat").addEventListener("click", function () { UI.Chat.Combat.endCombat(); });

    var memory = <MemoryCombat> Server.Chat.Memory.getConfiguration("Combat");
    var updFunction = function () { UI.Chat.Combat.update(); };

    memory.addTargetListener(updFunction);

    Server.Chat.Memory.registerChangeListener("Combat", updFunction);

    Server.Chat.addRoomListener(updFunction);

    DB.SheetDB.addChangeListener(function () {
        UI.Chat.Combat.updateSelects();
    });

    var content = document.getElementById("combatContent");

    var storyButtons : HTMLElement = document.getElementById("combatStoryButtons");
    var userSelect = <HTMLSelectElement> document.getElementById("combatSelectUser");
    var sheetSelect = <HTMLSelectElement> document.getElementById("combatSelectSheet");

    export function hide() {
        $floater.stop(true).fadeOut(Application.Config.getConfig("animTime").getValue());
    }

    export function open() {
        if (floater.style.display !== "none") {
            hide();
            return;
        }
        floater.style.left = "0px";
        floater.style.top = "0px";
        $floater.stop(true).fadeIn(Application.Config.getConfig("animTime").getValue());
        update();
    }

    function empty () {
        while (content.firstChild !== null) content.removeChild(content.firstChild);
    }

    export function updateSelects () {
        if (storyButtons.style.display !== "none") {
            var room = Server.Chat.getRoom();

            while (userSelect.firstChild !== null) userSelect.removeChild(userSelect.firstChild);
            while (sheetSelect.firstChild !== null) sheetSelect.removeChild(sheetSelect.firstChild);

            var option = document.createElement("option");
            option.value = "0";
            option.appendChild(document.createTextNode("NPC"));

            userSelect.appendChild(option);

            if (room !== null) {
                var users = room.getOrderedUserContexts();
                for (var i = 0; i < users.length; i++) {
                    if (!users[i].isStoryteller()) {
                        option = document.createElement("option");
                        option.value = users[i].getUser().id.toString();
                        option.appendChild(document.createTextNode(users[i].getUniqueNickname()));

                        userSelect.appendChild(option);
                    }
                }

                var sheets = DB.SheetDB.getSheetsByGame(room.getGame());

                if (sheets.length === 0) {
                    option = document.createElement("option");
                    option.value = "0";
                    option.appendChild(document.createTextNode("_COMBATTRACKERNOSHEETS_"));
                    UI.Language.markLanguage(option);
                    sheetSelect.appendChild(option);
                } else {
                    for (var i = 0; i < sheets.length; i++) {
                        option = document.createElement("option");
                        option.value = sheets[i].getId();
                        option.appendChild(document.createTextNode(sheets[i].getName()));

                        sheetSelect.appendChild(option);
                    }
                }
            }
        }
    }

    export function update() {
        if (floater.style.display !== "none") {
            if (Server.Chat.getRoom() === null) {
                hide();
            } else {
                var me = Server.Chat.getRoom().getMe();
                storyButtons.style.display = me.isStoryteller() ? "" : "none";

                if (me.isStoryteller()) {
                    updateSelects();
                }

                empty();

                var combatants = memory.getCombatants();
                var turn = memory.getTurn();

                if (combatants.length === 0) {
                    var div = document.createElement("div");
                    div.classList.add("combatRow");

                    var span = document.createElement("span");
                    span.classList.add("combatName", "language");
                    span.appendChild(document.createTextNode("_COMBATTRACKERNOCOMBATANTS_"));
                    div.appendChild(span);

                    UI.Language.updateElement(span);

                    content.appendChild(div);
                } else {
                    for (var i = 0; i < combatants.length; i++) {
                        var combatant = new ChatCombatRow(combatants[i], turn === i, memory.isTarget(combatants[i].id), me.isStoryteller());
                        content.appendChild(combatant.getHTML());
                    }
                }
            }
        }
    }

    export function addSheet () {
        var user = Number(userSelect.value);
        var sheet = Number(sheetSelect.value);

        if (sheet !== 0) {
            memory.addParticipant(DB.SheetDB.getSheet(sheet), user === 0 ? undefined : Server.Chat.getRoom().getUser(user).getUser());
        }
    }

    export function announceTurn () {
        var turner = memory.getCurrentTurnOwner();

        var msg = new MessageSheetturn();
        msg.setSheetName(turner.name);
        msg.setOwnerId(turner.owner);
        msg.setSheetId(turner.id);
        UI.Chat.sendMessage(msg);
    }

    export function newRound () {
        memory.incrementRound();
        announceTurn();
    }

    export function nextTurn () {
        memory.incrementTurn();
        announceTurn();
    }

    export function endCombat () {
        memory.endCombat();
        var msg = new ChatSystemMessage(true);
        msg.addText("_CHATCOMBATENDEDCOMBAT_");
        UI.Chat.printElement(msg.getElement());
    }
}