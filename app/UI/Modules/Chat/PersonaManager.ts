module UI.Chat.PersonaManager {
    var personaBox = document.getElementById("personaContainer");

    while (personaBox.firstChild !== null) personaBox.removeChild(personaBox.lastChild);

    var currentElement : HTMLElement = null;
    var currentPersonaName : String = null;
    var currentPersonaAvatar : String = null;

    var changeTrigger = new Trigger();

    var personaShortcuts : { [id : string] : HTMLElement} = {};
    var personaShortcutLastUsage : Array<HTMLElement> = [];

    var currentRoom : Room = null;
    UI.Chat.addRoomChangedListener(<Listener> {
        handleEvent : function (e : Room) {
            UI.Chat.PersonaManager.setRoom(e);
        }
    });

    export function setRoom (room : Room) {
        currentRoom = room;
        clearPersonas();
    }

    function clearPersonas () {
        while (personaBox.firstChild !== null) personaBox.removeChild(personaBox.firstChild);

        currentPersonaAvatar = null;
        currentPersonaName = null;
        currentElement = null;
        personaShortcutLastUsage = [];
        personaShortcuts = {};
    }

    export function clearPersona (name : String, avatar : String) {
        if (personaShortcuts[name + ";" + avatar] !== undefined) {
            personaShortcutLastUsage.splice(personaShortcutLastUsage.indexOf(personaShortcuts[name + ";" + avatar]), 1);

            personaBox.removeChild(personaShortcuts[name + ";" + avatar]);

            if (currentElement === personaShortcuts[name + ";" + avatar]) {
                unsetPersona();
            }

            delete (personaShortcuts[name + ";" + avatar]);
        } else {
            console.debug("[PERSONAMANAGER] Attempt to remove unknown persona: " + name + ";" + avatar);
        }
    }

    export function getRoom () {
        return currentRoom;
    }

    function createPersonaButton (name : string, avatar : String) {
        var ele = document.createElement("div");
        ele.classList.add("personaButton");

        name = name.trim();
        avatar = avatar === null ? null : avatar.trim();

        var handler = <EventListenerObject> {
            name : name,
            avatar : avatar,
            element : ele,
            handleEvent : function (e : MouseEvent) {
                UI.Chat.PersonaManager.setPersona(this.name, this.avatar, this.element);
            }
        }

        ele.addEventListener("click", handler);

        var shortName = name.split(" ");
        var finalName = "";
        var i = 0;
        while (finalName.length <= 6 && i < shortName.length) {
            finalName += " " + shortName[i];
            i++;
        }

        ele.appendChild(document.createTextNode(finalName.trim()));

        return ele;
    }

    export function createAndUsePersona (name : string, avatar : String) {
        if (personaShortcuts[name + ";" + avatar] === undefined) {
            personaShortcuts[name + ";" + avatar] = createPersonaButton(name, avatar);
        }

        if (personaShortcuts[name + ";" + avatar].parentElement === null) {
            personaBox.appendChild(personaShortcuts[name + ";" + avatar]);
        }

        setPersona(name, avatar, personaShortcuts[name + ";" + avatar]);

        while (personaBox.scrollHeight > personaBox.clientHeight) {
            personaBox.removeChild(personaShortcutLastUsage.shift());
        }
    }

    export function addListener (listener : Listener) {
        changeTrigger.addListener(listener);
    }

    function triggerListeners () {
        changeTrigger.trigger(currentPersonaName, currentPersonaAvatar);

        if (Server.Chat.isConnected()) {
            Server.Chat.sendPersona(<PersonaInfo> {
                persona : currentPersonaName,
                avatar : currentPersonaAvatar
            });
        }
    }

    export function setPersona (name : String, avatar : String, element : HTMLElement) {
        if (currentElement !== null) currentElement.classList.remove("active");
        var oldName = currentPersonaName;
        var oldAvatar = currentPersonaAvatar;

        if (currentElement === element) {
            currentElement = null;
            currentPersonaAvatar = null;
            currentPersonaName = null;
        } else {
            currentElement = element;
            currentPersonaAvatar = avatar;
            currentPersonaName = name;
            currentElement.classList.add("active");

            var index = personaShortcutLastUsage.indexOf(currentElement);
            if (index !== -1) {
                personaShortcutLastUsage.splice(index, 1);
            }
            personaShortcutLastUsage.push(currentElement);
        }


        if (oldName !== currentPersonaName || oldAvatar !== currentPersonaAvatar) {
            triggerListeners();
        }
    }

    export function getPersonaName () : String {
        return currentPersonaName;
    }

    export function getPersonaAvatar () : String {
        return currentPersonaAvatar;
    }

    export function unsetPersona () {
        setPersona(null, null, currentElement);
    }
}