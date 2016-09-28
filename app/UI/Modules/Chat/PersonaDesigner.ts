module UI.Chat.PersonaDesigner {

    var $designerBox = $(document.getElementById("personaDesignerBox")).hide();
    var target = document.getElementById("personaDesignerHolder");

    document.getElementById("personaAddButton").addEventListener("click", function () { UI.Chat.PersonaDesigner.callSelf(); });
    document.getElementById("personaDesignerCloseButton").addEventListener("click", function () { UI.Chat.PersonaDesigner.close(); });

    var open = false;
    var currentRoom : Room = null;

    var personaName : HTMLInputElement = <HTMLInputElement> document.getElementById("personaDesignerNameInput");
    var personaAvatar : HTMLInputElement = <HTMLInputElement> document.getElementById("personaDesignerAvatarInput");

    var personaChoices : { [id : string] : ChatAvatarChoice } = {};

    var lastMemory = [];

    UI.Chat.addRoomChangedListener(<Listener> {
        handleEvent : function (e : Room) {
            UI.Chat.PersonaDesigner.setRoom(e);
        }
    });

    document.getElementById("personaDesignerForm").addEventListener("submit", function (e : Event) {
        UI.Chat.PersonaDesigner.createPersona();
        e.preventDefault();
    });

    export function callSelf () {
        $designerBox.fadeIn(Application.Config.getConfig("animTime").getValue());
        open = true;
        setRoom(UI.Chat.getRoom());
    }

    export function close () {
        $designerBox.fadeOut(Application.Config.getConfig("animTime").getValue(), function () {
            UI.Chat.PersonaDesigner.emptyOut();
        });
        open = false;
    }

    export function setRoom (room : Room) {
        currentRoom = room;
        if (open) {
            fillOut();
        }
    }

    export function fillOut() {
        emptyOut();
        loadMemory();

        for (var i = 0; i < lastMemory.length; i++) {
            createPersona(lastMemory[i].name, lastMemory[i].avatar);
        }
    }

    export function emptyOut() {
        while (target.firstChild !== null) target.removeChild(target.firstChild);
        personaChoices = {};
    }

    export function createPersona (name? : string, avatar? : String) {
        var name = name === undefined ? personaName.value.trim() : name;
        var avatar = avatar === undefined ? personaAvatar.value.trim() : avatar;
        personaName.value =  "";
        personaAvatar.value = "";
        personaName.focus();

        if (name === "") {
            return;
        }

        if (avatar === "") {
            avatar = null;
        }

        var choice = new ChatAvatarChoice(name, avatar);

        if (personaChoices[choice.id] === undefined) {
            target.appendChild(choice.getHTML());
            personaChoices[choice.id] = choice;
            lastMemory.push({
                name : choice.nameStr,
                avatar : choice.avatarStr
            });
            saveMemory();
        }
    }

    export function removeChoice (choice : ChatAvatarChoice) {
        if (personaChoices[choice.id] !== undefined) {
            target.removeChild(personaChoices[choice.id].getHTML());
            delete(personaChoices[choice.id]);

            lastMemory = [];
            for (var id in personaChoices) {
                lastMemory.push({
                    name : personaChoices[id].nameStr,
                    avatar : personaChoices[id].avatarStr
                });
            }
            saveMemory();

            UI.Chat.PersonaManager.clearPersona(choice.nameStr, choice.avatarStr);
        }
    }

    export function usePersona(name : string, avatar : String) {
        close();
        UI.Chat.PersonaManager.createAndUsePersona(name, avatar);
    }

    function getMemoryString () {
        if (currentRoom === null) {
            console.warn("[PERSONADESIGNER] Attempt to get memory string for null room.")
            return "personaDesigner_0";
        } else {
            return "personaDesigner_" + currentRoom.id;
        }
    }

    function loadMemory () {
        lastMemory = Application.LocalMemory.getMemory(getMemoryString(), []);
    }

    function saveMemory () {
        lastMemory.sort(function (a, b) {
            var na = a.name.toLowerCase().latinise();
            var nb = b.name.toLowerCase().latinise();
            if (na < nb) return -1;
            if (nb < na) return 1;
            return 0;
        });
        Application.LocalMemory.setMemory(getMemoryString(), lastMemory);
    }
}