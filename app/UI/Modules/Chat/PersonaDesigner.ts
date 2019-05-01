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
    var savingTimeout;

    UI.Chat.addRoomChangedListener(<Listener> {
        handleEvent : function (e : Room) {
            UI.Chat.PersonaDesigner.setRoom(e);
            UI.Chat.PersonaDesigner.loadMemory(() => {});
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

    export function fillOut(done = false) {
        if (savingTimeout != undefined) {
            saveMemory(() => {
                fillOut(done);
            });
            savingTimeout = undefined;
        }
        if (done == false) {
            emptyOut();
            loadMemory(() => {
                fillOut(true);
            });
        }

        if (done) {
            for (var i = 0; i < lastMemory.length; i++) {
                createPersona(lastMemory[i].name, lastMemory[i].avatar, false);
            }
        }
    }

    export function emptyOut() {
        while (target.firstChild !== null) target.removeChild(target.firstChild);
        personaChoices = {};
    }

    export function createPersona (name? : string, avatar? : String, savePersona? : boolean) {
        name = name === undefined ? personaName.value.trim() : name;
        avatar = avatar === undefined ? personaAvatar.value.trim() : avatar;
        savePersona = savePersona === undefined ? true : savePersona == true;
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
            if (savePersona) {
                //saveMemory();
                considerSaving();
            }
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
            //saveMemory();
            considerSaving();

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

    export function loadMemory (done : () => void) {
        if (currentRoom == undefined) {
            // empty room
            lastMemory = [];
            return;
        }
        //lastMemory = Application.LocalMemory.getMemory(getMemoryString(), []);
        let roomid = currentRoom.id;
        Server.Storage.requestPersonas(
            true,
            {
                handleEvent : (data) => {
                    if (data != undefined && data[roomid] != undefined) {
                        lastMemory = data[roomid]; // array of {name : string, avatar : string}
                    } else {
                        lastMemory = [];
                    }
                    done();
                }
            },
            {
                handleEvent : () => {
                    printError(true);
                }
            }
        );
    }

    export function printError (load = true) {
        close();
        let msg = new ChatSystemMessage(true);
        if (load !== false) {
            msg.addText("_CHATPERSONAFAILEDLOAD_");
        } else {
            msg.addText("_CHATPERSONAFAILEDSAVE_");
        }
        UI.Chat.printElement(msg.getElement());
    }

    function saveMemory (done : () => void) {
        lastMemory.sort(function (a, b) {
            var na : string = a.name.toLowerCase().latinise();
            var nb : string = b.name.toLowerCase().latinise();
            if (na < nb) return -1;
            if (nb < na) return 1;
            na = (<Latinisable> (<String> (String(a.avatar).toLowerCase()))).latinise();
            nb = (<Latinisable> (<String> (String(b.avatar).toLowerCase()))).latinise();
            if (na < nb) return -1;
            if (nb < na) return 1;
            return 0;
        });
        //Application.LocalMemory.setMemory(getMemoryString(), lastMemory);
        let roomid = currentRoom.id;
        Server.Storage.requestPersonas(
            false,
            {
                handleEvent : (data) => {
                    let oldStr = JSON.stringify(data);
                    if (data == undefined) {
                        data = {};
                    }
                    data[roomid] = lastMemory;
                    let newStr = JSON.stringify(data);
                    if (oldStr != newStr) {
                        Server.Storage.sendPersonas(
                            data,
                            {
                                handleEvent: () => {
                                    done();
                                }
                            },
                            {
                                handleEvent: () => {
                                    printError(false);
                                }
                            }
                        );
                    } else {
                        done();
                    }
                }
            },
            {
                handleEvent : () => {
                    printError(true);
                }
            }
        );
    }

    function considerSaving () {
        if (savingTimeout != undefined) {
            clearTimeout(savingTimeout);
        }
        savingTimeout = setTimeout(
                () => {
                saveMemory(() => {});
                savingTimeout = undefined;
            },
            10 * 1000 // 10 seconds
        );
    }
}