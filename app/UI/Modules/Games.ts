module UI.Games {
    var gameListTarget = document.getElementById("gameListTarget");

    var nickTarget = document.getElementById("gamesNickTarget");
    Application.Login.addListener(<Listener> {
        handleEvent : function (isLogged : boolean) {
            UI.Games.updateNick(isLogged);
        }
    })

    document.getElementById("gamesButton").addEventListener("click", function () {
        UI.Games.callSelf();
    });

    export function callSelf (ready? : boolean) {
        UI.PageManager.callPage(UI.idGames);

        if (ready !== true) {
            Server.Games.updateLists(<Listener> {
                handleEvent : function () {
                    UI.Games.callSelf(true);
                }
            });
            return;
        }

        var games = DB.GameDB.getOrderedGameList();

        while (gameListTarget.lastChild !== null) gameListTarget.removeChild(gameListTarget.lastChild);

        if (games.length === 0) {
            var p = document.createElement("p");
            p.classList.add("mainWindowParagraph");
            p.appendChild(document.createTextNode("_GAMESNOGAMES_"));
            gameListTarget.appendChild(p);
            UI.Language.markLanguage(p);
            return;
        }

        for (var i = 0; i < games.length; i++) {
            var game = games[i];
            var div = <HTMLElement> document.createElement("div");
            div.classList.add("mainWindowParagraph");
            div.classList.add("gamesMainDiv");

            var b =<HTMLElement> document.createElement("b");
            b.appendChild(document.createTextNode(<string> games[i].name));
            b.classList.add("gamesName");

            div.appendChild(b);

            if (games[i].isMyCreation()) {
                var perm = document.createElement("a");
                perm.classList.add("gamesOwnerButton");
                perm.classList.add("textLink");
                perm.appendChild(document.createTextNode("_GAMESPERMISSIONS_"));
                perm.style.display="none"; // TODO: Display once implemented

                perm.addEventListener("click", <EventListenerObject> {
                    game : games[i],
                    handleEvent : function () {
                        // TODO: UI.Games.editGamePermissions(this.game);
                    }
                });

                var edit = document.createElement("a");
                edit.classList.add("gamesOwnerButton");
                edit.classList.add("textLink");
                edit.appendChild(document.createTextNode("_GAMESEDIT_"));

                edit.addEventListener("click", <EventListenerObject> {
                    game : games[i],
                    handleEvent : function () {
                        // TODO: UI.Games.editGame(this.game);
                    }
                });

                edit.style.display = "none"; // TODO: Display once server-side issue resolved

                var deleteGame = document.createElement("a");
                deleteGame.classList.add("gamesOwnerButton");
                deleteGame.classList.add("textLink");
                deleteGame.appendChild(document.createTextNode("_GAMESDELETE_"));

                deleteGame.addEventListener("click", <EventListenerObject> {
                    game : games[i],
                    handleEvent : function () {
                        if (confirm(UI.Language.getLanguage().getLingo("_RAPSDELETE_", {languagea : this.game.name}))) {
                            UI.Games.deleteGame(this.game);
                        }
                    }
                });

                UI.Language.markLanguage(edit, deleteGame, perm);

                div.appendChild(deleteGame);
                div.appendChild(edit);
                div.appendChild(perm);
            } else {
                var leave = document.createElement("a");
                leave.classList.add("gamesOwnerButton");
                leave.classList.add("textLink");
                leave.appendChild(document.createTextNode("_GAMESLEAVE_"));

                leave.addEventListener("click", <EventListenerObject> {
                    game : games[i],
                    handleEvent : function () {
                        UI.Games.leaveGame(this.game);
                    }
                });

                UI.Language.markLanguage(leave);
                div.appendChild(leave);
            }

            var creatorDiv = document.createElement("div");
            creatorDiv.classList.add("gameCreatorDiv");

            var creatorTitle = document.createElement("b");
            creatorTitle.appendChild(document.createTextNode("_GAMECREATORTITLE_"))
            creatorTitle.appendChild(document.createTextNode(": "));
            UI.Language.markLanguage(creatorTitle);

            creatorDiv.appendChild(creatorTitle);
            creatorDiv.appendChild(document.createTextNode(games[i].getCreatorFullNickname()));

            div.appendChild(creatorDiv);


            var roomList = games[i].getOrderedRoomList();

            if (roomList.length === 0) {
                var p = document.createElement("p");
                p.classList.add("gamesNoRooms");
                p.appendChild(document.createTextNode("_GAMESNOROOMS_"));
                UI.Language.markLanguage(p);
                div.appendChild(p);
            } else {
                for (var k = 0; k < roomList.length; k++) {
                    var user = roomList[k].getMe();
                    var room = roomList[k];

                    var p = document.createElement("p");
                    p.classList.add("gamesRoomP");

                    var a = document.createElement("a");
                    a.classList.add("textLink");
                    a.classList.add("gameRoomLink");
                    a.addEventListener('click', <EventListenerObject> {
                        roomid : roomList[k].id,
                        handleEvent : function () {
                            UI.Chat.callSelf(this.roomid);
                        }
                    });
                    a.appendChild(document.createTextNode(roomList[k].name));
                    p.appendChild(a);

                    if (game.isMyCreation()) {
                        var rDelete = document.createElement("a");
                        rDelete.classList.add("textLink");
                        rDelete.classList.add("roomExtraButton");
                        rDelete.appendChild(document.createTextNode("_GAMESROOMDELETE_"));
                        rDelete.addEventListener("click", <EventListenerObject> {
                            room : room,
                            handleEvent : function () {
                                if (confirm(UI.Language.getLanguage().getLingo("_RAPSDELETE_", {languagea : this.room.name}))) {
                                    UI.Rooms.deleteRoom(this.room);
                                }
                            }
                        });
                        p.appendChild(rDelete);

                        var rPerm = document.createElement("a");
                        rPerm.classList.add("textLink");
                        rPerm.classList.add("roomExtraButton");
                        rPerm.appendChild(document.createTextNode("_GAMESROOMPERMISSIONS_"));
                        rPerm.addEventListener("click", <EventListenerObject> {
                            room : room,
                            handleEvent : function () {
                                // TODO: UI.Rooms.setPermissions(this.room);
                            }
                        });
                        rPerm.style.display = "none"; // TODO: Display once implemented
                        p.appendChild(rPerm);

                        UI.Language.markLanguage(rPerm, rDelete);

                    }

                    div.appendChild(p);
                }
            }

            if (game.isMyCreation() || game.getMe().invite) {
                var hr = document.createElement("hr");
                hr.classList.add("gamesHR");
                div.appendChild(hr);
            }

            if (game.isMyCreation() || game.getMe().isCreateRoom()) {
                var p = document.createElement("p");
                p.className = "textLink gamesAdminButton";
                p.appendChild(document.createTextNode("_GAMESCREATEROOM_"));
                UI.Language.markLanguage(p);
                div.appendChild(p);

                p.addEventListener("click", <EventListenerObject> {
                    game : game,
                    handleEvent : function () {
                        UI.Games.RoomDesigner.callSelf(this.game);
                    }
                });
            }

            var gameContext = game.getMe();
            if (game.isMyCreation() || gameContext.invite) {
                var p = document.createElement("p");
                p.className = "textLink gamesAdminButton";
                p.appendChild(document.createTextNode("_GAMESSENDINVITES_"));
                UI.Language.markLanguage(p);
                div.appendChild(p);

                p.addEventListener("click", <EventListenerObject> {
                    game : game,
                    handleEvent : function () {
                        UI.Games.InviteDesigner.callSelf(this.game);
                    }
                });
            }

            gameListTarget.appendChild(div);
        }
    };

    export function deleteGame (game : Game) {
        var cbs = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.callSelf(false);
            }
        }

        Server.Games.deleteGame(<number> game.id, cbs, cbs);
    }

    export function leaveGame (game : Game) {
        var cbs = <EventListenerObject> {
            handleEvent : function () {
                UI.Games.callSelf(false);
            }
        }

        Server.Games.leaveGame(<number> game.id, cbs, cbs);
    }

    export function updateNick (isLogged : boolean) {
        if (!isLogged) {
            UI.Language.addLanguageVariable(nickTarget, "a", "Logged out");
        } else {
            UI.Language.addLanguageVariable(nickTarget, "a", Application.Login.getUser().getFullNickname());
        }
        UI.Language.updateText(nickTarget);
    };
}