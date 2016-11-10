module UI.Chat.Lingo {
    var floater = document.getElementById("lingoFloater");
    var $floater = $(floater).draggable({
        containment : '#chatSideWindow',
        handle : '#lingoHandle'
    }).hide();

    document.getElementById("lingoMinus").addEventListener("click", function () { UI.Chat.Lingo.hide(); });
    document.getElementById("chatLingoButton").addEventListener("click", function () { UI.Chat.Lingo.open(); });

    var content = document.getElementById("lingoContent");

    export function hide() {
        $floater.stop(true).fadeOut(Application.Config.getConfig("animTime").getValue());
    }

    Server.Chat.Memory.registerChangeListener("Lingo", function () {
        UI.Chat.Lingo.update();
    });

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

    export function update () {
        if (floater.style.display === "none") {
            return;
        }
        empty();
        if (Server.Chat.getRoom() === null) {
            return;
        }
        var mem = <MemoryLingo> Server.Chat.Memory.getConfiguration("Lingo");
        var users = mem.getUsers();
        var usersOrdered = Server.Chat.getRoom().getOrderedUserContexts();
        var languageNames = PseudoLanguage.getLanguageNames();

        for (var i = 0; i < usersOrdered.length; i++) {
            if (usersOrdered[i].isStoryteller()) {
                continue; // Storytellers have all languages
            }

            var row = document.createElement("div");
            row.classList.add("lingoRow");

            var b = document.createElement("b");
            b.classList.add("lingoName");
            row.appendChild(b);
            b.appendChild(document.createTextNode(usersOrdered[i].getUniqueNickname() + ":"));

            var lingos = users[usersOrdered[i].getUser().id];

            if (lingos !== undefined) {
                // Print current languages
                for (var k = 0; k < lingos.length; k++) {
                    var a = document.createElement("a");
                    a.classList.add("lingoButton");

                    if (Server.Chat.getRoom().getMe().isStoryteller()) {
                        var span = document.createElement("span");
                        span.classList.add("textLink");
                        span.appendChild(document.createTextNode("(X)"));

                        span.addEventListener("click", <EventListenerObject> {
                            user : usersOrdered[i].getUser().id,
                            lingo : lingos[k],
                            handleEvent: function (e) {
                                var mem = <MemoryLingo> Server.Chat.Memory.getConfiguration("Lingo");
                                mem.removeUserLingo(this.user, this.lingo);
                            }
                        });

                        a.appendChild(span);
                    } else if (Server.Chat.getRoom().getMe() === usersOrdered[i]) {
                        a.classList.add("clickable");

                        a.addEventListener("click", <EventListenerObject> {
                            lingo : lingos[k],
                            handleEvent : function (e) {
                                e.preventDefault();
                                UI.Chat.Lingo.speakInTongues(this.lingo);
                            }
                        });
                    }

                    a.appendChild(document.createTextNode(lingos[k]));

                    row.appendChild(a);
                }
                usersOrdered[i].getUser().isMe();
            } else {
                row.appendChild(document.createTextNode("_CHATLINGONOLINGO_"));
                row.classList.add("language");
                UI.Language.updateElement(row);
            }

            if (Server.Chat.getRoom().getMe().isStoryteller()) {
                // Print adder
                var adder = document.createElement("div");
                adder.classList.add("lingoAdder");

                var select = document.createElement("select");
                var lingoNames = PseudoLanguage.getLanguageNames();
                for (var k = 0; k < lingoNames.length; k++) {
                    var option = document.createElement("option");
                    option.value = lingoNames[k];
                    option.appendChild(document.createTextNode(lingoNames[k]));

                    select.appendChild(option);
                }

                var a = document.createElement("a");
                a.classList.add("textLink", "language");
                a.appendChild(document.createTextNode("_LINGOADD_"));
                UI.Language.updateElement(a);

                adder.appendChild(select);
                adder.appendChild(a);
                row.appendChild(adder);

                a.addEventListener("click", <EventListenerObject> {
                    select : select,
                    user : usersOrdered[i].getUser().id,
                    handleEvent : function () {
                        var mem = <MemoryLingo> Server.Chat.Memory.getConfiguration("Lingo");
                        mem.addUserLingo(this.user, this.select.value);
                    }
                });
            }

            content.appendChild(row);
        }

        if (Server.Chat.getRoom().getMe().isStoryteller()) {
            var lingos = PseudoLanguage.getLanguageNames();

            var row = document.createElement("div");
            row.classList.add("lingoRow");

            var b = document.createElement("b");
            b.classList.add("lingoName");
            row.appendChild(b);
            b.appendChild(document.createTextNode(Server.Chat.getRoom().getMe().getUniqueNickname() + ":"));

            for (var k = 0; k < lingos.length; k++) {
                var a = document.createElement("a");
                a.classList.add("lingoButton");
                a.classList.add("clickable");
                a.appendChild(document.createTextNode(lingos[k]));

                a.addEventListener("click", <EventListenerObject> {
                    lingo: lingos[k],
                    handleEvent: function (e) {
                        e.preventDefault();
                        UI.Chat.Lingo.speakInTongues(this.lingo);
                    }
                });
                row.appendChild(a);
            }

            content.appendChild(row);
        }
    }

    export function speakInTongues (language : string) {
        UI.Chat.Forms.prependChatInput("/lingo " + language + ", ");
    }
}