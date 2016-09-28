module UI.Games.Invites {
    var target = document.getElementById("inviteTarget");

    var $error = $(document.getElementById("gameInvitesError")).css("opacity", 0);
    $error[0].appendChild(document.createTextNode("_GAMEINVITESERROR_"));
    $error[0].appendChild(document.createTextNode(" "));
    var a = document.createElement("a");
    a.classList.add("textLink");
    a.addEventListener("click", function () { UI.Games.Invites.callSelf(); });
    a.appendChild(document.createTextNode("_GAMEINVITESERRORTRYAGAIN_"));
    $error[0].appendChild(a);
    UI.Language.markLanguage(a);
    delete(a);

    document.getElementById("gameInvitesButton").addEventListener("click", function () { UI.Games.Invites.callSelf(); });

    Application.Login.addListener(<Listener> {
        element : document.getElementById("gameInvitesNickTarget"),
        handleEvent : function (isLogged : boolean) {
            if (isLogged) {
                UI.Language.addLanguageVariable(this.element, "a", Application.Login.getUser().getFullNickname());
                UI.Language.updateElement(this.element);
            }
        }
    });

    export function callSelf () {
        UI.PageManager.callPage(UI.idGameInvites);

        var cbs = {
            handleEvent : function (data) {
                UI.Games.Invites.printInfo(data);
            }
        };

        var cbe = {
            handleEvent : function () {
                UI.Games.Invites.printError();
            }
        };

        $error.finish().css("opacity", "0");
        Server.Games.getInviteList(cbs, cbe);
    }

    function empty () {
        while (target.firstChild !== null) {
            target.removeChild(target.firstChild);
        }
    }

    export function printInfo (data) {
        data = <Array<Object>> data;

        empty();
        if (data.length === 0) {
            var p = document.createElement("p");
            p.classList.add("gameInvitesEmptyP");
            p.appendChild(document.createTextNode("_GAMEINVITESEMPTY_"));

            var a = document.createElement("a");
            a.classList.add("textLink");
            a.appendChild(document.createTextNode("_GAMEINVITESREFRESH_"));
            UI.Language.markLanguage(a);
            a.addEventListener("click", function () { UI.Games.Invites.callSelf(); });

            p.appendChild(document.createTextNode(" "));
            p.appendChild(a);

            UI.Language.markLanguage(p);
            target.appendChild(p);
        } else {
            for (var i = 0; i < data.length; i++) {
                //MensagemConvite: "Invite com mensagem"
                //id: 435
                var row = data[i];
                var div = document.createElement("div");
                div.classList.add("gameInvitesContainer");

                var firstP = document.createElement("p");
                div.appendChild(firstP);

                var gameTitle = document.createElement("b");
                gameTitle.appendChild(document.createTextNode("_GAMEINVITESGAMETITLE_"));
                gameTitle.appendChild(document.createTextNode(": "));
                UI.Language.markLanguage(gameTitle);
                firstP.appendChild(gameTitle);


                firstP.appendChild(document.createTextNode(row["name"]));

                var sender = document.createElement("b");
                sender.appendChild(document.createTextNode("_GAMEINVITESSTORYTELLER_"));
                sender.appendChild(document.createTextNode(": "));
                sender.classList.add("gameInvitesStoryteller");
                UI.Language.markLanguage(sender);
                firstP.appendChild(sender);

                firstP.appendChild(document.createTextNode(row['creatornick'] + "#" + row['creatorsufix']));

                var secondP = document.createElement("p");
                div.appendChild(secondP);

                if (row['MensagemConvite'] === undefined) {
                    secondP.appendChild(document.createTextNode("_GAMEINVITESNOMESSAGE_"));
                    UI.Language.markLanguage(secondP);
                } else {
                    var message = document.createElement("b");
                    message.appendChild(document.createTextNode("_GAMEINVITESMESSAGE_"));
                    message.appendChild(document.createTextNode(": "));
                    message.classList.add("gameInvitesMessage");
                    UI.Language.markLanguage(message);
                    secondP.appendChild(message);

                    secondP.appendChild(document.createTextNode(row['MensagemConvite']));
                }


                var thirdP = document.createElement("p");
                div.appendChild(thirdP);

                var accept = document.createElement("a");
                accept.classList.add("textLink");
                accept.appendChild(document.createTextNode("_GAMEINVITESACCEPT_"));
                UI.Language.markLanguage(accept);
                accept.addEventListener("click", {
                    id : row['id'],
                    handleEvent : function () {
                        UI.Games.Invites.accept(this.id);
                    }
                });

                var reject = document.createElement("a");
                reject.classList.add("textLink");
                reject.classList.add("gameInvitesReject");
                reject.appendChild(document.createTextNode("_GAMEINVITESREJECT_"));
                UI.Language.markLanguage(reject);
                reject.addEventListener("click", {
                    id : row['id'],
                    handleEvent : function () {
                        UI.Games.Invites.reject(this.id);
                    }
                });

                thirdP.appendChild(accept);
                thirdP.appendChild(reject);


                target.appendChild(div);
            }
        }
    }

    export function accept (id) {
        var onLoaded = <Listener> {
            handleEvent : function () {
                UI.Games.Invites.callSelf();
            }
        };

        Server.Games.acceptInvite(<number> id, onLoaded, onLoaded);
    }

    export function reject (id) {
        var onLoaded = <Listener> {
            handleEvent : function () {
                UI.Games.Invites.callSelf();
            }
        };

        Server.Games.rejectInvite(<number> id, onLoaded, onLoaded);
    }

    export function printError () {
        $error.finish().animate({opacity: 1}, Application.Config.getConfig("animTime").getValue() * 2);
    }
}