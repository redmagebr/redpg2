module UI.Chat.Forms {
    var formState = new ChatFormState(document.getElementById("chatMessageStateIcon"));
    var formInput : HTMLInputElement = <HTMLInputElement> document.getElementById("chatMessageInput");

    var diceTower : HTMLElement = document.getElementById("chatDiceTower");
    diceTower.addEventListener("click", function () {
        if (this.classList.contains("icons-chatDiceTowerOn")) {
            this.classList.remove("icons-chatDiceTowerOn");
            this.classList.add("icons-chatDiceTower");
        } else {
            this.classList.add("icons-chatDiceTowerOn");
            this.classList.remove("icons-chatDiceTower");
        }
    });

    var diceForm = document.getElementById("diceFormBox");
    diceForm.addEventListener("submit", function (e) {
        UI.Chat.Forms.rollDice();
        e.preventDefault();
    });

    var diceAmount : HTMLInputElement = <HTMLInputElement> document.getElementById("chatDiceAmount");
    var diceFaces : HTMLInputElement = <HTMLInputElement> document.getElementById("chatDiceFaces");
    var diceMod : HTMLInputElement = <HTMLInputElement> document.getElementById("chatDiceMod");
    var diceReason : HTMLInputElement = <HTMLInputElement> document.getElementById("chatDiceReason");

    document.getElementById("chatMessageSendButton");

    var typing = false;
    var afk = false;
    var focused = true;

    var inputKeyHandler = function (e : KeyboardEvent) { UI.Chat.Forms.handleInputKeyboard(e); };
    formInput.addEventListener("keyup", inputKeyHandler);
    formInput.addEventListener("keydown", inputKeyHandler);
    formInput.addEventListener("keydown", function (e : KeyboardEvent) { UI.Chat.Forms.handleInputKeypress(e)});
    delete (inputKeyHandler);

    var lastWhisperFrom : UserRoomContext = null;

    addOnReady("ChatForms", "Dependency to same-level Module (UI.Chat.PersonaManager)", <Listener> {
        handleEvent : function () {
            UI.Chat.PersonaManager.addListener(<Listener> {
                handleEvent : function (name : String, avatar : String) {
                    UI.Chat.Forms.updateFormState(name !== null);
                }
            })
        }
    });

    var olderTexts : Array<string> = [];
    var oldTextPosition : number = -1;

    export function addOlderText () {
        var trimmed = formInput.value.trim();
        if (trimmed !== "") {
            oldTextPosition =  olderTexts.push(trimmed);
        }
    }

    export function moveOlderText (direction : number) {
        if (oldTextPosition === olderTexts.length) {
            var oldPos = oldTextPosition;
            addOlderText();
            oldTextPosition = oldPos;
        }
        oldTextPosition += direction;
        if (oldTextPosition < 0) {
            oldTextPosition = 0;
            if (olderTexts.length > 0) formInput.value = olderTexts[oldTextPosition];
        } else if (oldTextPosition >= olderTexts.length) {
            oldTextPosition = olderTexts.length;
            formInput.value = "";
        } else {
            formInput.value = olderTexts[oldTextPosition];
        }
    }

    export function updateFormState (hasPersona) {
        if (hasPersona) {
            formState.setState(ChatFormState.STATE_NORMAL);
        } else {
            var room = UI.Chat.getRoom();
            if (room !== null && room.getMe().isStoryteller()) {
                formState.setState(ChatFormState.STATE_STORY);
            } else {
                formState.setState(ChatFormState.STATE_OFF);
            }
        }
    }

    export function handleInputKeyboard (e : KeyboardEvent) {
        setTyping(formInput.value !== "");

        if (e.shiftKey) {
            formState.setState(ChatFormState.STATE_STORY);
        } else if (e.ctrlKey) {
            if (UI.Chat.PersonaManager.getPersonaName() !== null) {
                formState.setState(ChatFormState.STATE_ACTION);
            } else {
                var room = UI.Chat.getRoom();
                if (room !== null && room.getMe().isStoryteller()) {
                    formState.setState(ChatFormState.STATE_STORY);
                } else {
                    formState.setState(ChatFormState.STATE_OFF);
                }
            }
        } else if (e.altKey) {
            formState.setState(ChatFormState.STATE_OFF);
        } else {
            if (UI.Chat.PersonaManager.getPersonaName() !== null) {
                formState.setState(ChatFormState.STATE_NORMAL);
            } else {
                var room = UI.Chat.getRoom();
                if (room !== null && room.getMe().isStoryteller()) {
                    formState.setState(ChatFormState.STATE_STORY);
                } else {
                    formState.setState(ChatFormState.STATE_OFF);
                }
            }
        }

        // Prevent alt from going to the browser
        if (e.keyCode === 18) {
            e.preventDefault();
        }
    }

    export function handleInputKeypress (e : KeyboardEvent) {
        if (e.keyCode === 9) {
            if (formInput.value === "") {
                if (e.shiftKey) {
                    diceReason.focus();
                } else {
                    diceAmount.focus();
                }
            }
            e.preventDefault();
        }

        // ENTER
        if (e.keyCode === 10 || e.keyCode === 13) {
            UI.Chat.Forms.sendMessage();
            e.preventDefault();
            return;
        }

        // UP
        if (e.keyCode === 38) {
            UI.Chat.Forms.moveOlderText(-1);
            e.preventDefault();
            return;
        }

        // DOWN
        if (e.keyCode === 40) {
            UI.Chat.Forms.moveOlderText(1);
            e.preventDefault();
            return;
        }

        // ESC
        if (e.keyCode === 27) {
            e.preventDefault();
            return;
        }

        var trimmed = formInput.value.trim();

        // TAB to complete Whisper
        if (e.keyCode === 9) {
            if (MessageFactory.getConstructorFromText(trimmed) === MessageWhisper) {
                var room = UI.Chat.getRoom();
                if (room !== null) {
                    var index = trimmed.indexOf(',');
                    var index2 = trimmed.indexOf(" ");
                    if (index2 === -1) {
                        var target = "";
                        var message = "";
                    } else {
                        if (index !== -1) {
                            var target = trimmed.substr(index2 + 1, (index - index2 - 1)).trim();
                            var message = trimmed.substr(index + 1).trim();
                        } else {
                            var target = trimmed.substr(index2 + 1).trim();
                            var message = "";
                        }
                    }

                    var users = room.getUsersByName(target);
                    if (users.length === 1) {
                        setInput("/whisper " + users[0].getUniqueNickname() + ", " + message);
                    } else {
                        var error = new ChatSystemMessage(true);
                        if (users.length === 0) {
                            error.addText("_CHATWHISPERNOTARGETSFOUND_");
                            error.addLangVar("a", target);
                        } else {
                            var clickF = function () {
                                UI.Chat.Forms.setInput("/whisper " + this.target + ", " + this.message);
                            };

                            error.addText("_CHATMULTIPLETARGETSFOUND_");
                            error.addText(": ");
                            for (var i = 0; i < users.length; i++) {
                                var listener = {
                                    target : users[i].getUniqueNickname(),
                                    message : message,
                                    handleEvent : clickF
                                };
                                error.addTextLink(users[i].getUniqueNickname(), false, listener);

                                if ((i + 1) < users.length) {
                                    error.addText(", ");
                                } else {
                                    error.addText(".");
                                }
                            }
                        }
                        UI.Chat.printElement(error.getElement());
                    }
                }
            }
        }

        // Space and tab, for Reply
        if (e.keyCode === 9 || e.keyCode === 32) {
            if (lastWhisperFrom !== null && MessageFactory.getConstructorFromText(trimmed) === SlashReply) {
                setInput("/whisper " + lastWhisperFrom.getUniqueNickname() + ", ");
            }
        }
    }

    export function sendMessage () {
        var trimmed = formInput.value.trim();
        if (trimmed === "") {
            var emptyMessage = new ChatSystemMessage(true);
            emptyMessage.addText("_CHATEMPTYNOTALLOWED_");

            UI.Chat.printElement(emptyMessage.getElement(), true);
        } else {
            addOlderText();
            var message : Message = null;
            if (trimmed.charAt(0) === "/") {
                message = MessageFactory.createFromText(trimmed);
            } else {
                if (formState.isNormal()) {
                    message = new MessageRoleplay();
                    message.receiveCommand("", trimmed);
                } else if (formState.isStory()) {
                    message = new MessageStory();
                    message.receiveCommand("/story", trimmed);
                } else if (formState.isAction()) {
                    message = new MessageAction();
                    message.receiveCommand("/me", trimmed);
                } else if (formState.isOff()) {
                    message = new MessageOff();
                    message.receiveCommand("/off", trimmed);
                }
            }

            if (message !== null) {
                message.findPersona();
                UI.Chat.sendMessage(message);
            }

            formInput.value = "";
        }
    }

    export function isTyping () {
        return typing;
    }

    export function isFocused () {
        return focused;
    }

    export function isAfk () {
        return afk;
    }

    export function setTyping (newTyping : boolean) {
        if (typing !== newTyping) {
            typing = newTyping;
            sendStatus();
        }
    }

    export function setFocused (newFocused : boolean) {
        if (focused !== newFocused) {
            focused = newFocused;
            sendStatus();
        }
    }

    export function setAfk (newAfk : boolean) {
        if (afk !== newAfk) {
            afk = newAfk;
            sendStatus();
        }
    }

    function sendStatus () {
        Server.Chat.sendStatus(<PersonaInfo> {
            afk : afk,
            focused : focused,
            typing : typing,
            avatar : null,
            persona : null
        });
    }

    export function considerRedirecting (event : KeyboardEvent) {
        if ((!event.ctrlKey && !event.altKey) || (event.ctrlKey && event.keyCode === 86)) {
            if (UI.PageManager.getCurrentLeft() === UI.idChat) {
                var focus = document.activeElement;
                var focusTag = focus.tagName.toLowerCase();
                if (focusTag !== "input"  && focusTag !== "textarea" && focusTag !== "select") {
                    formInput.focus();
                }
            }
        }
    }

    export function rollDice (faces? : number) {
        var amount = parseInt(diceAmount.value);
        faces = faces === undefined ? parseInt(diceFaces.value) : faces;
        var mod = parseInt(diceMod.value);
        var reason = diceReason.value.trim();

        if (isNaN(amount)) amount = 1;
        if (isNaN(faces)) faces = 6;
        if (isNaN(mod)) mod = 0;

        var dice = new MessageDice();
        dice.findPersona();
        dice.setMsg(reason);
        dice.setMod(mod);
        dice.addDice(amount, faces);

        if (diceTower.classList.contains("icons-chatDiceTowerOn")) {
            dice.addDestinationStorytellers(UI.Chat.getRoom());
        }

        UI.Chat.sendMessage(dice);

        diceReason.value = "";
    }

    export function setInput (str : string) {
        formInput.value = str;
        formInput.focus();
    }

    export function setLastWhisperFrom (user : UserRoomContext) {
        lastWhisperFrom = user;
    }

    // Redirect on keypress
    document.addEventListener("keypress", function (e : KeyboardEvent) {
        UI.Chat.Forms.considerRedirecting(e);
    });

    // Redirect on Control + V
    document.addEventListener("keydown", function (e : KeyboardEvent) {
        if (e.ctrlKey && e.keyCode === 86) {
            UI.Chat.Forms.considerRedirecting(e);
        }
    });

    // Please don't go BACK on backspace, this is an application so this only happens on accident.
    document.addEventListener("keydown", function (e : KeyboardEvent) {
        if (e.which === 8 && !$(e.target).is("input, textarea")) {
            e.preventDefault();
        }
    })

    // Focused?
    window.addEventListener("focus", function () { UI.Chat.Forms.setFocused(true); });
    window.addEventListener("blur", function () { UI.Chat.Forms.setFocused(false); });

    // AFK?
    $(window).idle({
        onIdle : function () {
            UI.Chat.Forms.setAfk(true);
        },
        onActive : function () {
            UI.Chat.Forms.setAfk(false);
        },
        events : "mouseover mouseout click keypress mousedown mousemove blur focus",
        idle: 30000
    });

    // Bind dices
    var dices = [4,6,8,10,12,20,100];
    for (var i = 0; i < dices.length; i++) {
        document.getElementById("chatDiceD" + dices[i]).addEventListener("click", {
            dice : dices[i],
            handleEvent : function () {
                UI.Chat.Forms.rollDice(this.dice);
            }
        });
    }
    delete(dices, i);
}