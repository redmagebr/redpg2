var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function startDebugging() {
    console.debug = console.log;
}
function stopDebugging() {
    console.debug = function () {
    };
}
if (window.location.hash.substr(1).toUpperCase().indexOf("DEBUG") !== -1) {
    startDebugging();
}
else {
    stopDebugging();
}
var onReady = [];
function addOnReady(caller, reason, listener) {
    console.debug("[ONREADY] Registered for " + caller + " because: " + reason + ". Listener:", listener);
    onReady.push(listener);
}
function allReady() {
    for (var i = 0; i < onReady.length; i++) {
        onReady[i].handleEvent();
    }
}
var Changelog = (function () {
    function Changelog(release, minor, major) {
        this.messages = {};
        this.release = release;
        this.minor = minor;
        this.major = major;
        Changelog.addToUpdates(this);
    }
    Changelog.addToUpdates = function (change) {
        if (Changelog.updatesExternal === null) {
            Changelog.updates.push(change);
        }
        else {
            Changelog.updatesExternal.push(change);
        }
    };
    Changelog.sort = function () {
        Changelog.updates.sort(function (a, b) {
            if (a.major !== b.major)
                return a.major - b.major;
            if (a.minor !== b.minor)
                return a.minor - b.minor;
            if (a.release !== b.release)
                return a.release - b.release;
            return 0;
        });
        if (Changelog.updatesExternal !== null) {
            Changelog.updatesExternal.sort(function (a, b) {
                if (a.major !== b.major)
                    return a.major - b.major;
                if (a.minor !== b.minor)
                    return a.minor - b.minor;
                if (a.release !== b.release)
                    return a.release - b.release;
                return 0;
            });
        }
    };
    Changelog.getMostRecentLocalUpdate = function () {
        return Changelog.updates[0];
    };
    Changelog.getMostRecentExternalUpdate = function () {
        if (Changelog.updatesExternal !== null) {
            return Changelog.updatesExternal[0];
        }
        return null;
    };
    Changelog.getUpdates = function () {
        return Changelog.updates;
    };
    Changelog.getMissingUpdates = function () {
        if (Changelog.updatesExternal === null)
            return [];
        var updates = [];
        for (var i = Changelog.updates.length; i < Changelog.updatesExternal.length; i++) {
            updates.push(Changelog.updatesExternal[i]);
        }
        return updates;
    };
    Changelog.finished = function () {
        if (Changelog.updatesExternal === null) {
            Changelog.sort();
            Changelog.updatesExternal = [];
        }
        else {
            Changelog.sort();
            UI.ChangelogManager.print();
        }
    };
    Changelog.getLocalVersion = function () {
        return Changelog.updates[Changelog.updates.length - 1].getVersion();
    };
    Changelog.getExternalVersion = function () {
        if (Changelog.updatesExternal === null) {
            return null;
        }
        return Changelog.updatesExternal[Changelog.updatesExternal.length - 1].getVersion();
    };
    Changelog.prototype.getVersion = function () {
        return [this.major, this.minor, this.release];
    };
    Changelog.prototype.addMessage = function (msg, lingo) {
        if (this.messages[lingo] === undefined) {
            this.messages[lingo] = [msg];
        }
        else {
            this.messages[lingo].push(msg);
        }
    };
    Changelog.prototype.getMessages = function () {
        var lingo = UI.Language.getLanguage();
        for (var i = 0; i < lingo.ids.length; i++) {
            if (this.messages[lingo.ids[i]] !== undefined) {
                return this.messages[lingo.ids[i]];
            }
        }
        if (this.messages['en'] !== undefined)
            return this.messages['en'];
        for (var key in this.messages) {
            return this.messages[key];
        }
        return ["Changelog contains no messages."];
    };
    Changelog.prototype.getHTML = function (missing) {
        var p = document.createElement("p");
        p.classList.add("mainWindowParagraph");
        if (missing) {
            p.classList.add("changelogMissing");
        }
        else {
            p.classList.add("changelogCurrent");
        }
        var versSpan = document.createElement("span");
        versSpan.classList.add("changelogChangeVersion");
        versSpan.appendChild(document.createTextNode(this.major + "." + this.minor + "." + this.release));
        p.appendChild(versSpan);
        var messages = this.getMessages();
        for (var i = 0; i < messages.length; i++) {
            var span = document.createElement("span");
            span.classList.add("changelogChange");
            span.appendChild(document.createTextNode(messages[i]));
            p.appendChild(span);
        }
        return p;
    };
    Changelog.updates = [];
    Changelog.updatesExternal = null;
    return Changelog;
}());
var ImageRed = (function () {
    function ImageRed() {
    }
    ImageRed.prototype.getLink = function () {
        var url = Server.IMAGE_URL + this.uploader + "_" + this.uuid;
        return url;
    };
    ImageRed.prototype.getName = function () {
        return this.name;
    };
    ImageRed.prototype.getId = function () {
        return this.uuid;
    };
    return ImageRed;
}());
var ImageLink = (function () {
    function ImageLink(name, url, folder) {
        this.name = name;
        this.url = url;
        this.folder = folder;
    }
    ImageLink.prototype.getFolder = function () {
        return this.folder;
    };
    ImageLink.prototype.setFolder = function (name) {
        UI.Images.stayInFolder(this.folder);
        this.folder = name;
        UI.Images.printImages();
        DB.ImageDB.considerSaving();
    };
    ImageLink.prototype.getLink = function () {
        return Server.URL.fixURL(this.url);
    };
    ImageLink.prototype.getName = function () {
        return this.name;
    };
    ImageLink.prototype.setName = function (name) {
        if (this.name !== name) {
            this.name = name;
            DB.ImageDB.triggerChange(this);
            DB.ImageDB.considerSaving();
        }
    };
    ImageLink.prototype.exportAsObject = function () {
        return {
            name: this.name,
            url: this.url,
            folder: this.folder
        };
    };
    return ImageLink;
}());
var User = (function () {
    function User() {
        this.nickname = "Undefined";
        this.nicknamesufix = "????";
        this.id = null;
        this.level = null;
        this.gameContexts = {};
        this.roomContexts = {};
        this.changedTrigger = new Trigger();
    }
    User.prototype.isMe = function () {
        return this.id === Application.getMyId();
    };
    User.prototype.exportAsLog = function () {
        var obj = {
            id: this.id,
            nickname: this.nickname,
            nicknamesufix: this.nicknamesufix,
            level: this.level,
            gameid: 0,
            roomid: 0
        };
        return obj;
    };
    User.prototype.getGameContext = function (id) {
        if (this.gameContexts[id] === undefined) {
            return null;
        }
        return this.gameContexts[id];
    };
    User.prototype.releaseGameContext = function (id) {
        delete (this.gameContexts[id]);
    };
    User.prototype.getRoomContext = function (id) {
        if (this.roomContexts[id] === undefined) {
            return null;
        }
        return this.roomContexts[id];
    };
    User.prototype.releaseRoomContext = function (id) {
        delete (this.roomContexts[id]);
    };
    User.prototype.getFullNickname = function () {
        return this.nickname + "#" + this.nicknamesufix;
    };
    User.prototype.getShortNickname = function () {
        return this.nickname;
    };
    User.prototype.updateFromObject = function (user) {
        if (typeof user['id'] === "string") {
            user['id'] = parseInt(user['id']);
        }
        for (var key in this) {
            if (user[key] === undefined)
                continue;
            this[key] = user[key];
        }
        var context;
        if (user['roomid'] !== undefined) {
            context = this.getRoomContext(user['roomid']);
            if (context === null) {
                context = new UserRoomContext(this);
                this.roomContexts[user['roomid']] = context;
            }
            context.updateFromObject(user);
        }
        if (user['gameid'] !== undefined) {
            context = this.getGameContext(user['roomid']);
            if (context === null) {
                context = new UserGameContext(this);
                this.gameContexts[user['gameid']] = context;
            }
            context.updateFromObject(user);
        }
        this.changedTrigger.trigger(this);
    };
    return User;
}());
var UserGameContext = (function () {
    function UserGameContext(user) {
        this.gameid = 0;
        this.createRoom = false;
        this.createSheet = false;
        this.editSheet = false;
        this.viewSheet = false;
        this.deleteSheet = false;
        this.invite = false;
        this.promote = false;
        this.user = user;
    }
    UserGameContext.prototype.getUser = function () {
        return this.user;
    };
    UserGameContext.prototype.updateFromObject = function (obj) {
        for (var id in this) {
            if (obj[id] !== undefined) {
                this[id] = obj[id];
            }
        }
    };
    UserGameContext.prototype.isCreateRoom = function () {
        return this.createRoom;
    };
    UserGameContext.prototype.isCreateSheet = function () {
        return this.createSheet;
    };
    return UserGameContext;
}());
var UserRoomContext = (function () {
    function UserRoomContext(user) {
        this.logger = false;
        this.cleaner = false;
        this.storyteller = false;
        this.user = user;
    }
    UserRoomContext.prototype.getRoom = function () {
        if (DB.RoomDB.hasRoom(this.roomid))
            return DB.RoomDB.getRoom(this.roomid);
        return new Room();
    };
    UserRoomContext.prototype.getUser = function () {
        return this.user;
    };
    UserRoomContext.prototype.isStoryteller = function () {
        return this.storyteller;
    };
    UserRoomContext.prototype.isCleaner = function () {
        return this.cleaner;
    };
    UserRoomContext.prototype.updateFromObject = function (user) {
        for (var id in this) {
            if (user[id] === undefined)
                continue;
            this[id] = user[id];
        }
    };
    UserRoomContext.prototype.getUniqueNickname = function () {
        var users = this.getRoom().getOrderedUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === this.getUser().id)
                continue;
            if (users[i].getShortNickname().toLowerCase() === this.user.getShortNickname().toLowerCase()) {
                return this.user.getFullNickname();
            }
        }
        return this.user.getShortNickname();
    };
    return UserRoomContext;
}());
var Room = (function () {
    function Room() {
        this.gameid = null;
        this.id = null;
        this.description = null;
        this.name = null;
        this.playByPost = false;
        this.privateRoom = false;
        this.publicRoom = false;
        this.creatorid = null;
        this.users = {};
        this.messages = {};
    }
    Room.prototype.exportAsLog = function (messages) {
        var obj = {
            gameid: this.gameid,
            id: 0,
            description: this.description,
            name: this.name,
            creatorid: this.creatorid
        };
        var users = [];
        for (var id in this.users) {
            users.push(this.users[id].exportAsLog());
        }
        obj['users'] = users;
        var msgObj = [];
        for (var i = 0; i < messages.length; i++) {
            msgObj.push(messages[i].exportAsLog());
        }
        obj['messages'] = msgObj;
        return obj;
    };
    Room.prototype.getMessages = function () {
        var list = [];
        for (var id in this.messages) {
            list.push(this.messages[id]);
        }
        return list;
    };
    Room.prototype.getOrderedMessages = function () {
        var list = [];
        for (var id in this.messages) {
            list.push(this.messages[id]);
        }
        list.sort(function (a, b) {
            return a.id - b.id;
        });
        return list;
    };
    Room.prototype.getOrderedUsers = function () {
        var list = [];
        for (var id in this.users) {
            list.push(this.users[id]);
        }
        list.sort(function (a, b) {
            var na = a.getShortNickname().toLowerCase();
            var nb = b.getShortNickname().toLowerCase();
            if (na < nb)
                return -1;
            if (nb < na)
                return 1;
            na = a.getFullNickname().toLowerCase();
            nb = b.getFullNickname().toLowerCase();
            if (na < nb)
                return -1;
            if (nb < na)
                return 1;
            return 0;
        });
        return list;
    };
    Room.prototype.getStorytellers = function () {
        var storytellers = [];
        for (var id in this.users) {
            var rc = this.users[id].getRoomContext(this.id);
            if (rc !== null && rc.isStoryteller()) {
                storytellers.push(rc);
            }
        }
        return storytellers;
    };
    Room.prototype.getMe = function () {
        return this.getUser(Application.getMyId());
    };
    Room.prototype.getUser = function (id) {
        if (this.users[id] === undefined) {
            return null;
        }
        return this.users[id].getRoomContext(this.id);
    };
    Room.prototype.getUsersByName = function (str) {
        var list = [];
        str = str.toLowerCase();
        for (var id in this.users) {
            if (this.users[id].getFullNickname().toLowerCase().indexOf(str) !== -1) {
                list.push(this.users[id].getRoomContext(this.id));
            }
        }
        return list;
    };
    Room.prototype.getGame = function () {
        return DB.GameDB.getGame(this.gameid);
    };
    Room.prototype.exportAsNewRoom = function () {
        var obj = {
            name: this.name,
            description: this.description,
            private: this.privateRoom,
            streamable: false,
            playbypost: this.playByPost,
            gameid: this.gameid
        };
        return obj;
    };
    Room.prototype.updateFromObject = function (room, cleanup) {
        for (var id in this) {
            if (room[id] === undefined || id === "users" || id === 'messages')
                continue;
            this[id] = room[id];
        }
        if (room["cleaner"] !== undefined) {
            this.users[Application.getMyId()] = DB.UserDB.getUser(Application.getMyId());
            var updateObj = {
                roomid: this.id,
                cleaner: room['cleaner'],
                logger: room['logger'],
                storyteller: room['storyteller']
            };
            this.users[Application.getMyId()].updateFromObject(updateObj);
        }
        if (room['users'] !== undefined) {
            var cleanedup = [];
            for (var i = 0; i < room['users'].length; i++) {
                room['users'][i]['roomid'] = this.id;
            }
            DB.UserDB.updateFromObject(room['users']);
            for (var i = 0; i < room['users'].length; i++) {
                this.users[room['users'][i]['id']] = DB.UserDB.getUser(room['users'][i]['id']);
                cleanedup.push(room['users'][i]['id']);
            }
            if (cleanup) {
                for (var id in this.users) {
                    if (cleanedup.indexOf(this.users[id].id) === -1) {
                        this.users[id].releaseGameContext(this.id);
                        delete (this.users[id]);
                    }
                }
            }
        }
        if (room['messages'] !== undefined) {
            var cleanedup = [];
            for (var i = 0; i < room['messages'].length; i++) {
                room['messages'][i]['roomid'] = this.id;
                cleanedup.push(room['messages'][i].id);
            }
            DB.MessageDB.updateFromObject(room['messages']);
            for (var i = 0; i < cleanedup.length; i++) {
                if (this.messages[cleanedup[i]] === undefined) {
                    this.messages[cleanedup[i]] = DB.MessageDB.getMessage(cleanedup[i]);
                }
            }
            if (cleanup) {
                for (id in this.messages) {
                    if (cleanedup.indexOf(this.messages[id].id) === -1) {
                        if (this.messages[id].localid !== null) {
                            DB.MessageDB.releaseLocalMessage(this.messages[id].localid);
                        }
                        DB.MessageDB.releaseMessage(this.messages[id].id);
                    }
                }
            }
        }
    };
    return Room;
}());
var Game = (function () {
    function Game() {
        this.users = {};
        this.rooms = {};
        this.sheets = {};
        this.description = null;
        this.name = null;
        this.id = null;
        this.freejoin = false;
        this.creatorid = null;
        this.creatornick = null;
        this.creatorsufix = null;
    }
    Game.prototype.exportAsLog = function (roomid, messages) {
        var obj = {
            description: this.description,
            name: this.name,
            id: 0,
            freejoin: this.freejoin,
            creatorid: this.creatorid,
            creatornick: this.creatornick,
            creatorsufix: this.creatorsufix
        };
        obj['rooms'] = [DB.RoomDB.getRoom(roomid).exportAsLog(messages)];
        return obj;
    };
    Game.prototype.getId = function () {
        return this.id;
    };
    Game.prototype.getName = function () {
        return this.name;
    };
    Game.prototype.getCreatorFullNickname = function () {
        return this.creatornick + "#" + this.creatorsufix;
    };
    Game.prototype.isMyCreation = function () {
        return Application.isMe(this.creatorid);
    };
    Game.prototype.getMe = function () {
        return this.getUser(Application.getMyId());
    };
    Game.prototype.getUser = function (id) {
        if (this.users[id] === undefined) {
            return null;
        }
        return this.users[id].getGameContext(this.id);
    };
    Game.prototype.getRoom = function (id) {
        if (this.rooms[id] === undefined) {
            return null;
        }
        return this.rooms[id];
    };
    Game.prototype.getSheet = function (id) {
        if (this.sheets[id] === undefined) {
            return null;
        }
        return this.sheets[id];
    };
    Game.prototype.getOrderedRoomList = function () {
        var list = [];
        for (var id in this.rooms) {
            list.push(this.rooms[id]);
        }
        list.sort(function (a, b) {
            var na = a.name.toLowerCase();
            var nb = b.name.toLowerCase();
            if (na < nb)
                return -1;
            if (nb < na)
                return 1;
            return 0;
        });
        return list;
    };
    Game.prototype.getOrderedSheetList = function () {
        var list = [];
        for (var id in this.sheets) {
            list.push(this.sheets[id]);
        }
        list.sort(function (a, b) {
            var fa = a.folder.toLowerCase();
            var fb = b.folder.toLowerCase();
            if (fa < fb)
                return -1;
            if (fb < fa)
                return 1;
            var na = a.getName().toLowerCase();
            var nb = b.getName().toLowerCase();
            if (na < nb)
                return -1;
            if (nb < na)
                return 1;
            return 0;
        });
        return list;
    };
    Game.prototype.exportAsObject = function () {
        var obj = {
            desc: this.description,
            name: this.name,
            freejoin: this.freejoin
        };
        if (this.id !== null) {
            obj['id'] = this.id;
        }
        return obj;
    };
    Game.prototype.updateFromObject = function (game, cleanup) {
        for (var id in this) {
            if (game[id] === undefined || id === "users" || id === "rooms" || id === "sheets")
                continue;
            this[id] = game[id];
        }
        if (game['users'] !== undefined) {
            var cleanedup = [];
            for (var i = 0; i < game['users'].length; i++) {
                game['users'][i]['gameid'] = this.id;
            }
            DB.UserDB.updateFromObject(game['users']);
            for (var i = 0; i < game['users'].length; i++) {
                this.users[game['users'][i]['id']] = DB.UserDB.getUser(game['users'][i]['id']);
                cleanedup.push(game['users'][i]['id']);
            }
            if (cleanup) {
                for (id in this.users) {
                    if (cleanedup.indexOf(this.users[id].id) === -1) {
                        this.users[id].releaseGameContext(this.id);
                        delete (this.users[id]);
                    }
                }
            }
        }
        if (game["createRoom"] !== undefined) {
            this.users[Application.getMyId()] = DB.UserDB.getUser(Application.getMyId());
            var updateObj = {
                gameid: this.id,
                createRoom: game["createRoom"],
                createSheet: game["createSheet"],
                deleteSheet: game["deleteSheet"],
                editSheet: game["editSheet"],
                invite: game["invite"],
                promote: game["promote"],
                viewSheet: game["viewSheet"]
            };
            this.users[Application.getMyId()].updateFromObject(updateObj);
        }
        if (game['rooms'] !== undefined) {
            var cleanedup = [];
            for (var i = 0; i < game['rooms'].length; i++) {
                game['rooms'][i]['gameid'] = this.id;
            }
            DB.RoomDB.updateFromObject(game['rooms'], false);
            for (var i = 0; i < game['rooms'].length; i++) {
                this.rooms[game['rooms'][i]['id']] = DB.RoomDB.getRoom(game['rooms'][i]['id']);
                cleanedup.push((game['rooms'][i]['id']));
            }
            if (cleanup) {
                for (id in this.rooms) {
                    if (cleanedup.indexOf(this.rooms[id].id) === -1) {
                        DB.RoomDB.releaseRoom(this.rooms[id].id);
                        delete (this.rooms[id]);
                    }
                }
            }
        }
        if (game['sheets'] !== undefined) {
            var cleanedup = [];
            for (var i = 0; i < game['sheets'].length; i++) {
                game['sheets'][i]['gameid'] = this.id;
            }
            DB.SheetDB.updateFromObject(game['sheets']);
            for (var i = 0; i < game['sheets'].length; i++) {
                this.sheets[game['sheets'][i]['id']] = DB.SheetDB.getSheet(game['sheets'][i]['id']);
                cleanedup.push(game['sheets'][i]['id']);
            }
            if (cleanup) {
                for (id in this.sheets) {
                    if (cleanedup.indexOf(this.sheets[id].id) === -1) {
                        DB.SheetDB.releaseSheet(this.sheets[id].id);
                        delete (this.sheets[id]);
                    }
                }
            }
        }
    };
    return Game;
}());
var SheetInstance = (function () {
    function SheetInstance() {
        this.id = 0;
        this.gameid = 0;
        this.folder = "";
        this.name = "";
        this.values = {};
        this.lastValues = "{}";
        this.creator = null;
        this.creatorNickname = "???#???";
        this.styleId = 0;
        this.styleName = "?";
        this.styleCreator = 0;
        this.styleCreatorNickname = "???#???";
        this.styleSafe = false;
        this.view = true;
        this.edit = false;
        this.delete = false;
        this.promote = false;
        this.isPublic = false;
        this.changed = false;
        this.changeTrigger = new Trigger();
    }
    SheetInstance.prototype.getGameid = function () {
        return this.gameid;
    };
    SheetInstance.prototype.getFolder = function () {
        return this.folder;
    };
    SheetInstance.prototype.getId = function () {
        return this.id;
    };
    SheetInstance.prototype.addChangeListener = function (list) {
        this.changeTrigger.addListener(list);
    };
    SheetInstance.prototype.triggerChanged = function () {
        this.changeTrigger.trigger(this);
        DB.SheetDB.triggerChanged(this);
    };
    SheetInstance.prototype.getMemoryId = function () {
        return "sheetBackup_" + this.id;
    };
    SheetInstance.prototype.setSaved = function () {
        this.changed = false;
        Application.LocalMemory.unsetMemory(this.getMemoryId());
    };
    SheetInstance.prototype.setName = function (name) {
        if (name !== this.name) {
            this.changed = true;
            this.name = name;
            this.triggerChanged();
        }
    };
    SheetInstance.prototype.getName = function () {
        return this.name;
    };
    SheetInstance.prototype.setValues = function (values, local) {
        var newJson = JSON.stringify(values);
        if (newJson !== this.lastValues) {
            this.values = values;
            this.lastValues = newJson;
            this.changed = true;
        }
        if (this.changed) {
            if (local) {
                Application.LocalMemory.setMemory(this.getMemoryId(), newJson);
            }
            else {
                this.changed = false;
            }
            this.triggerChanged();
        }
    };
    SheetInstance.prototype.updateFromObject = function (obj) {
        if (typeof obj['id'] !== 'undefined')
            this.id = obj['id'];
        if (typeof obj['gameid'] !== 'undefined')
            this.gameid = obj['gameid'];
        if (typeof obj['nome'] !== 'undefined')
            this.name = obj['nome'];
        if (typeof obj['criadorNick'] !== 'undefined' && typeof obj['criadorNickSufix'] !== 'undefined')
            this.creatorNickname = obj['criadorNick'] + "#" + obj['criadorNickSufix'];
        if (typeof obj['criador'] !== 'undefined')
            this.creator = obj['criador'];
        if (typeof obj['folder'] !== 'undefined')
            this.folder = obj['folder'];
        if (typeof obj['publica'] !== 'undefined')
            this.isPublic = obj['publica'];
        if (typeof obj['visualizar'] !== 'undefined')
            this.view = obj['visualizar'];
        if (typeof obj['deletar'] !== 'undefined')
            this.delete = obj['deletar'];
        if (typeof obj['editar'] !== 'undefined')
            this.edit = obj['editar'];
        if (typeof obj['promote'] !== 'undefined')
            this.promote = obj['promote'];
        if (typeof obj['nickStyleCreator'] !== 'undefined' && typeof obj['nicksufixStyleCreator'] !== 'undefined')
            this.styleCreatorNickname = obj['nickStyleCreator'] + "#" + obj['nicksufixStyleCreator'];
        if (typeof obj['idStyleCreator'] !== 'undefined')
            this.styleCreator = obj['idStyleCreator'];
        if (typeof obj['idstyle'] !== 'undefined')
            this.styleId = obj['idstyle'];
        if (typeof obj['styleName'] !== 'undefined')
            this.styleName = obj['styleName'];
        if (typeof obj['segura'] !== 'undefined')
            this.styleSafe = obj['segura'];
        if (typeof obj['values'] !== 'undefined')
            this.setValues(obj['values'], false);
    };
    SheetInstance.prototype.isEditable = function () {
        return this.edit;
    };
    SheetInstance.prototype.isPromotable = function () {
        return this.promote;
    };
    SheetInstance.prototype.isDeletable = function () {
        return this.delete;
    };
    return SheetInstance;
}());
var Trigger = (function () {
    function Trigger() {
        this.functions = [];
        this.objects = [];
    }
    Trigger.prototype.removeListener = function (f) {
        if (typeof f === "function") {
            var i = this.functions.indexOf(f);
            if (i !== -1) {
                this.functions.splice(i, 1);
            }
        }
        else {
            var i = this.objects.indexOf(f);
            if (i !== -1) {
                this.objects.splice(i, 1);
            }
        }
    };
    Trigger.prototype.addListener = function (f) {
        if (typeof f === "function") {
            this.functions.push(f);
        }
        else {
            this.objects.push(f);
        }
    };
    Trigger.prototype.trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < this.functions.length; i++) {
            this.functions[i].apply(null, args);
        }
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].handleEvent.apply(this.objects[i], args);
        }
    };
    return Trigger;
}());
var AJAXConfig = (function () {
    function AJAXConfig(url) {
        this._target = 0;
        this._url = "";
        this._timeout = 15000;
        this._responseType = "json";
        this._data = null;
        this.loadingTimeout = null;
        this.instantLoading = false;
        this._url = url;
    }
    AJAXConfig.prototype.forceLoading = function () {
        this.instantLoading = true;
    };
    AJAXConfig.prototype.startConditionalLoading = function () {
        if (this.target != AJAXConfig.TARGET_NONE) {
            if (this.target === AJAXConfig.TARGET_GLOBAL) {
                UI.Loading.startLoading();
            }
            else if (this.target === AJAXConfig.TARGET_LEFT) {
                UI.Loading.blockLeft();
            }
            else if (this.target === AJAXConfig.TARGET_RIGHT) {
                UI.Loading.blockRight();
            }
        }
    };
    AJAXConfig.prototype.finishConditionalLoading = function () {
        if (this.loadingTimeout !== null) {
            window.clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
        else if (this.target != AJAXConfig.TARGET_NONE) {
            if (this.target === AJAXConfig.TARGET_GLOBAL) {
                UI.Loading.stopLoading();
            }
            else if (this.target === AJAXConfig.TARGET_LEFT) {
                UI.Loading.unblockLeft();
            }
            else if (this.target === AJAXConfig.TARGET_RIGHT) {
                UI.Loading.unblockRight();
            }
        }
    };
    Object.defineProperty(AJAXConfig.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (value) {
            this._target = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AJAXConfig.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (value) {
            this._url = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AJAXConfig.prototype, "timeout", {
        get: function () {
            return this._timeout;
        },
        set: function (value) {
            this._timeout = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AJAXConfig.prototype, "responseType", {
        get: function () {
            return this._responseType;
        },
        set: function (value) {
            this._responseType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AJAXConfig.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    AJAXConfig.prototype.setData = function (id, value) {
        if (this.data === null) {
            this.data = {};
        }
        this.data[id] = value;
    };
    AJAXConfig.prototype.setResponseTypeJSON = function () {
        this._responseType = "json";
    };
    AJAXConfig.prototype.setResponseTypeText = function () {
        this._responseType = "text";
    };
    AJAXConfig.prototype.setTargetNone = function () {
        this._target = AJAXConfig.TARGET_NONE;
    };
    AJAXConfig.prototype.setTargetGlobal = function () {
        this._target = AJAXConfig.TARGET_GLOBAL;
    };
    AJAXConfig.prototype.setTargetLeftWindow = function () {
        this._target = AJAXConfig.TARGET_LEFT;
    };
    AJAXConfig.prototype.setTargetRightWindow = function () {
        this._target = AJAXConfig.TARGET_RIGHT;
    };
    AJAXConfig.TARGET_NONE = 0;
    AJAXConfig.TARGET_GLOBAL = 1;
    AJAXConfig.TARGET_LEFT = 2;
    AJAXConfig.TARGET_RIGHT = 3;
    AJAXConfig.CONDITIONAL_LOADING_TIMEOUT = 150;
    return AJAXConfig;
}());
var WebsocketController = (function () {
    function WebsocketController(url) {
        this.socket = null;
        this.keepAlive = true;
        this.keepAliveTime = 15 * 1000;
        this.keepAliveInterval = null;
        this.onOpen = [];
        this.onClose = [];
        this.onMessage = [];
        this.onError = [];
        this.url = url;
    }
    WebsocketController.prototype.connect = function () {
        if (this.isReady()) {
            console.warn("[WEBSOCKET] Attempt to connect a WebSocket that was already connected. Disconnecting first.");
            this.close();
        }
        var url = Server.getWebsocketURL() + this.url;
        if (Application.Login.hasSession()) {
            url += ';jsessionid=' + Application.Login.getSession();
        }
        this.socket = new WebSocket(url);
        this.socket.addEventListener("open", {
            controller: this,
            handleEvent: function (e) {
                this.controller.resetInterval();
                this.controller.triggerOpen();
                console.debug("[WEBSOCKET] " + this.controller.url + ": Open.", e);
            }
        });
        this.socket.addEventListener("error", {
            controller: this,
            handleEvent: function (e) {
                console.error("[WEBSOCKET] " + this.controller.url + ": Error.", e);
            }
        });
        this.socket.addEventListener("message", {
            controller: this,
            handleEvent: function (e) {
                this.controller.resetInterval();
                if (e.data !== "1" && e.data.indexOf("[\"status") !== 0)
                    console.debug("[WEBSOCKET] " + this.controller.url + ": Message: ", e);
                this.controller.triggerMessage(e);
            }
        });
        this.socket.addEventListener("close", {
            controller: this,
            handleEvent: function (e) {
                this.controller.disableInterval();
                this.controller.triggerClose();
                console.warn("[WEBSOCKET] " + this.controller.url + ": Closed.", e);
            }
        });
    };
    WebsocketController.prototype.isReady = function () {
        return this.socket !== null && this.socket.readyState === WebsocketController.READYSTATE_OPEN;
    };
    WebsocketController.prototype.resetInterval = function () {
        if (this.keepAlive) {
            if (this.keepAliveInterval !== null) {
                clearInterval(this.keepAliveInterval);
            }
            var interval = function (controller) {
                controller.doKeepAlive();
            };
            this.keepAliveInterval = setInterval(interval.bind(null, this), this.keepAliveTime);
        }
    };
    WebsocketController.prototype.disableInterval = function () {
        if (this.keepAliveInterval !== null) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
    };
    WebsocketController.prototype.doKeepAlive = function () {
        this.socket.send("0");
    };
    WebsocketController.prototype.send = function (action, obj) {
        if (this.isReady()) {
            if (typeof obj !== "string") {
                obj = JSON.stringify(obj);
            }
            this.socket.send(action + ";" + obj);
            if (action !== "status")
                console.debug("[WEBSOCKET] Message sent:", action + ";" + obj);
        }
        else {
            console.warn("[WEBSOCKET] Attempt to send messages through a WebSocket that isn't ready. Ignoring. Offending message: ", action, obj);
        }
    };
    WebsocketController.prototype.close = function () {
        if (this.socket !== null && (this.socket.readyState === WebsocketController.READYSTATE_CONNECTING || this.socket.readyState === WebsocketController.READYSTATE_OPEN)) {
            this.socket.close();
        }
    };
    WebsocketController.prototype.addCloseListener = function (obj) {
        this.onClose.push(obj);
    };
    WebsocketController.prototype.addOpenListener = function (obj) {
        this.onOpen.push(obj);
    };
    WebsocketController.prototype.addMessageListener = function (type, obj) {
        this.onMessage.push({
            type: type,
            obj: obj,
            handleEvent: function (e) {
                var response = JSON.parse(e.data);
                if (Array.isArray(response) && response[0] === this.type) {
                    obj.handleEvent(response);
                }
            }
        });
    };
    WebsocketController.prototype.triggerOpen = function () {
        for (var i = 0; i < this.onOpen.length; i++) {
            this.onOpen[i].handleEvent();
        }
    };
    WebsocketController.prototype.triggerClose = function () {
        for (var i = 0; i < this.onClose.length; i++) {
            this.onClose[i].handleEvent();
        }
    };
    WebsocketController.prototype.triggerMessage = function (e) {
        for (var i = 0; i < this.onMessage.length; i++) {
            this.onMessage[i].handleEvent(e);
        }
    };
    WebsocketController.READYSTATE_CONNECTING = 0;
    WebsocketController.READYSTATE_OPEN = 1;
    WebsocketController.READYSTATE_CLOSING = 2;
    WebsocketController.READYSTATE_CLOSED = 3;
    return WebsocketController;
}());
var ChatWsController = (function () {
    function ChatWsController() {
        this.socket = new WebsocketController(Server.Chat.CHAT_URL);
        this.currentRoom = null;
        this.onReady = null;
        this.socket.addOpenListener({
            controller: this,
            handleEvent: function () {
                if (this.controller.onReady !== null) {
                    this.controller.onReady.handleEvent();
                    this.controller.onReady = null;
                }
            }
        });
    }
    ChatWsController.prototype.isReady = function () {
        return this.socket.isReady();
    };
    ChatWsController.prototype.start = function () {
        this.socket.connect();
    };
    ChatWsController.prototype.end = function () {
        this.currentRoom = null;
        this.socket.close();
    };
    ChatWsController.prototype.enterRoom = function (id) {
        this.socket.send("room", id);
        this.currentRoom = id;
    };
    ChatWsController.prototype.sendStatus = function (info) {
        var status = [];
        status.push(info.typing ? "1" : "0");
        status.push(info.afk ? "1" : "0");
        status.push(info.focused ? "1" : "0");
        this.socket.send("status", status.join(","));
    };
    ChatWsController.prototype.sendPersona = function (info) {
        var persona = {
            persona: info.persona,
            avatar: info.avatar
        };
        this.socket.send("persona", JSON.stringify(persona));
    };
    ChatWsController.prototype.sendMessage = function (message) {
        this.socket.send("message", message.exportAsObject());
    };
    ChatWsController.prototype.saveMemory = function (memory) {
        this.socket.send("memory", memory);
    };
    ChatWsController.prototype.addCloseListener = function (obj) {
        this.socket.addCloseListener(obj);
    };
    ChatWsController.prototype.addOpenListener = function (obj) {
        this.socket.addOpenListener(obj);
    };
    ChatWsController.prototype.addMessageListener = function (type, obj) {
        this.socket.addMessageListener(type, obj);
    };
    return ChatWsController;
}());
var Configuration = (function () {
    function Configuration(defV) {
        this.changeTrigger = new Trigger();
        this.value = null;
        this.defValue = null;
        this.setFunction = null;
        this.getFunction = null;
        this.defValue = defV;
        this.value = defV;
    }
    Configuration.prototype.getDefault = function () {
        return this.defValue;
    };
    Configuration.prototype.reset = function () {
        this.storeValue(this.defValue);
    };
    Configuration.prototype.addChangeListener = function (listener) {
        this.changeTrigger.addListener(listener);
    };
    Configuration.prototype.storeValue = function (value) {
        var oldValue = JSON.stringify(this.value);
        if (this.setFunction !== null) {
            this.setFunction(value);
        }
        else {
            this.value = value;
        }
        var newValue = JSON.stringify(this.value);
        if (newValue !== oldValue) {
            this.changeTrigger.trigger(this);
            return true;
        }
        return false;
    };
    Configuration.prototype.getValue = function () {
        if (this.getFunction !== null) {
            return this.getFunction();
        }
        return this.value;
    };
    return Configuration;
}());
var NumberConfiguration = (function (_super) {
    __extends(NumberConfiguration, _super);
    function NumberConfiguration(defValue, min, max) {
        _super.call(this, defValue);
        this.min = 0;
        this.max = 100;
        this.setFunction = function (value) {
            if (!isNaN(value)) {
                value = Math.floor(value);
                if (value < this.min) {
                    value = this.min;
                }
                if (value > this.max) {
                    value = this.max;
                }
                this.value = value;
            }
        };
        this.getFunction = function () {
            if ($.browser.mobile) {
                return 0;
            }
            return this.value;
        };
        this.min = min;
        this.max = max;
    }
    return NumberConfiguration;
}(Configuration));
var WsportConfiguration = (function (_super) {
    __extends(WsportConfiguration, _super);
    function WsportConfiguration() {
        _super.apply(this, arguments);
        this.setFunction = function (value) {
            if (Server.WEBSOCKET_PORTS.indexOf(value) === -1) {
                this.value = Server.WEBSOCKET_PORTS[0];
            }
            else {
                this.value = value;
            }
        };
    }
    return WsportConfiguration;
}(Configuration));
var LanguageConfiguration = (function (_super) {
    __extends(LanguageConfiguration, _super);
    function LanguageConfiguration() {
        _super.call(this, navigator.language);
        this.setFunction = function (value) {
            if (value.indexOf("_") !== -1) {
                value = value.replace("_", "-");
            }
            this.value = value;
        };
    }
    return LanguageConfiguration;
}(Configuration));
var BooleanConfiguration = (function (_super) {
    __extends(BooleanConfiguration, _super);
    function BooleanConfiguration(bool) {
        _super.call(this, bool ? 1 : 0);
        this.setFunction = function (value) {
            if (typeof value !== "string")
                value = value.toString().toLowerCase();
            var bool = value === "1" || value === "true";
            if (bool)
                this.value = 1;
            else
                this.value = 0;
        };
        this.getFunction = function () {
            return this.value === 1;
        };
    }
    return BooleanConfiguration;
}(Configuration));
var TrackerMemory = (function () {
    function TrackerMemory() {
        this.changeTrigger = new Trigger();
    }
    TrackerMemory.prototype.addChangeListener = function (listener) {
        this.changeTrigger.addListener(listener);
    };
    TrackerMemory.prototype.triggerChange = function () {
        this.changeTrigger.trigger(this);
    };
    return TrackerMemory;
}());
var MemoryCombat = (function (_super) {
    __extends(MemoryCombat, _super);
    function MemoryCombat() {
        _super.apply(this, arguments);
        this.combatants = [];
        this.round = 0;
        this.turn = 0;
    }
    MemoryCombat.prototype.reset = function () {
        this.combatants = [];
        this.round = 0;
        this.turn = 0;
        this.triggerChange();
    };
    MemoryCombat.prototype.exportAsObject = function () {
        return null;
    };
    MemoryCombat.prototype.storeValue = function (obj) {
    };
    MemoryCombat.prototype.getValue = function () {
        return null;
    };
    return MemoryCombat;
}(TrackerMemory));
var MemoryPica = (function (_super) {
    __extends(MemoryPica, _super);
    function MemoryPica() {
        _super.apply(this, arguments);
        this.picaAllowed = true;
        this.updateUnderway = false;
        this.changeDetected = false;
    }
    MemoryPica.prototype.reset = function () {
        this.picaAllowed = true;
    };
    MemoryPica.prototype.getValue = function () {
        return this;
    };
    MemoryPica.prototype.picaAllowedStore = function (isIt) {
        isIt = isIt === true;
        if (isIt !== this.picaAllowed) {
            this.picaAllowed = isIt;
            if (this.updateUnderway) {
                this.changeDetected = true;
            }
            else {
                this.triggerChange();
            }
        }
    };
    MemoryPica.prototype.storeValue = function (values) {
        if (!Array.isArray(values) || values.length < MemoryPica.fieldOrder.length) {
            console.warn("[ROOMMEMMORY] [MemoryPica] Invalid store operation requested. Ignoring.");
            return;
        }
        this.changeDetected = false;
        this.updateUnderway = true;
        for (var i = 0; i < MemoryPica.fieldOrder.length; i++) {
            this[MemoryPica.fieldOrder[i] + "Store"](values[i]);
        }
        if (this.changeDetected) {
            this.triggerChange();
        }
        this.updateUnderway = false;
    };
    MemoryPica.prototype.exportAsObject = function () {
        var result = [];
        for (var i = 0; i < MemoryPica.fieldOrder.length; i++) {
            result.push(this[MemoryPica.fieldOrder[i]]);
        }
        return result;
    };
    MemoryPica.fieldOrder = ["picaAllowed"];
    return MemoryPica;
}(TrackerMemory));
var MemoryVersion = (function (_super) {
    __extends(MemoryVersion, _super);
    function MemoryVersion() {
        _super.apply(this, arguments);
        this.importVersion = Server.Chat.Memory.version;
    }
    MemoryVersion.prototype.reset = function () {
        this.importVersion = Server.Chat.Memory.version;
    };
    MemoryVersion.prototype.storeValue = function (v) {
        this.importVersion = v;
    };
    MemoryVersion.prototype.getValue = function () {
        return this.importVersion;
    };
    MemoryVersion.prototype.exportAsObject = function () {
        return Server.Chat.Memory.version;
    };
    return MemoryVersion;
}(TrackerMemory));
var CombatEffect = (function () {
    function CombatEffect() {
        this.name = "";
        this.origin = 0;
        this.customString = null;
    }
    CombatEffect.prototype.reset = function () {
        this.name = UI.Language.getLanguage().getLingo("_TRACKERUNKNOWNEFFECT_");
    };
    CombatEffect.prototype.exportAsObject = function () {
        var arr = [this.name, this.origin];
        if (this.customString !== null) {
            arr.push(this.customString);
        }
        return arr;
    };
    CombatEffect.prototype.storeValue = function (array) {
        if (!Array.isArray(array) || typeof array[0] !== "string" || typeof array[1] !== "number") {
            this.reset();
        }
        else {
            this.name = array[0];
            this.origin = array[1];
            if (typeof array[2] === "string") {
                this.customString = array[2];
            }
        }
    };
    return CombatEffect;
}());
var CombatParticipant = (function () {
    function CombatParticipant(memo) {
        this.id = 0;
        this.name = "";
        this.initiative = 0;
        this.effects = [];
        this.combatMemory = memo;
    }
    CombatParticipant.prototype.setSheet = function (sheet) {
        this.id = sheet.getId();
        this.name = sheet.getName();
    };
    CombatParticipant.prototype.exportAsObject = function () {
        var participant = [this.id, this.name, this.initiative];
        var effects = [];
        for (var i = 0; i < this.effects.length; i++) {
            effects.push(this.effects[i].exportAsObject());
        }
        participant.push(effects);
        return participant;
    };
    return CombatParticipant;
}());
var ChatInfo = (function () {
    function ChatInfo(floater) {
        this.textNode = document.createTextNode("null");
        this.senderBold = document.createElement("b");
        this.senderTextNode = document.createTextNode("_CHATSENDER_");
        this.storyteller = false;
        this.floater = floater;
        this.floater.style.display = "none";
        while (this.floater.firstChild !== null)
            this.floater.removeChild(this.floater.firstChild);
        this.senderBold.appendChild(this.senderTextNode);
        this.senderBold.appendChild(document.createTextNode(": "));
        this.floater.appendChild(this.senderBold);
        this.floater.appendChild(this.textNode);
        UI.Language.markLanguage(this.senderBold);
    }
    ChatInfo.prototype.showFor = function ($element, message) {
        this.floater.style.display = "";
        var offset = $element.offset().top;
        var height = window.innerHeight;
        if (message !== undefined) {
            this.floater.style.bottom = (height - offset) + "px";
            this.textNode.nodeValue = message.getUser().getUser().getFullNickname();
            if (message.getUser().isStoryteller() !== this.storyteller) {
                this.senderTextNode.nodeValue = message.getUser().isStoryteller() ? "_CHATSENDERSTORYTELLER_" : "_CHATSENDER_";
                this.storyteller = message.getUser().isStoryteller();
                UI.Language.markLanguage(this.senderBold);
            }
        }
    };
    ChatInfo.prototype.hide = function () {
        this.floater.style.display = "none";
    };
    ChatInfo.prototype.bindMessage = function (message, element) {
        if (message instanceof MessageSystem) {
            return;
        }
        var $element = $(element);
        element.addEventListener("mouseenter", {
            chatInfo: this,
            message: message,
            $element: $element,
            handleEvent: function () {
                this.chatInfo.showFor(this.$element, this.message);
            }
        });
        element.addEventListener("mousemove", {
            chatInfo: this,
            $element: $element,
            handleEvent: function () {
                this.chatInfo.showFor(this.$element);
            }
        });
        element.addEventListener("mouseleave", {
            chatInfo: this,
            handleEvent: function () {
                this.chatInfo.hide();
            }
        });
    };
    return ChatInfo;
}());
var ChatAvatar = (function () {
    function ChatAvatar() {
        this.element = document.createElement("div");
        this.img = document.createElement("img");
        this.typing = document.createElement("a");
        this.afk = document.createElement("a");
        this.name = document.createTextNode("????#????");
        this.user = null;
        this.persona = null;
        this.online = false;
        this.changedOnline = false;
        var name = document.createElement("div");
        name.classList.add("avatarName");
        name.appendChild(this.name);
        this.typing.style.display = "none";
        this.typing.classList.add("avatarTyping");
        this.afk.style.display = "none";
        this.afk.classList.add("avatarAFK");
        this.img.classList.add("avatarImg");
        this.element.classList.add("avatarContainer");
        this.element.appendChild(this.img);
        this.element.appendChild(this.typing);
        this.element.appendChild(this.afk);
        this.element.appendChild(name);
        this.img.style.display = "none";
        this.element.classList.add("icons-chatAnon");
        this.img.addEventListener("error", {
            avatar: this,
            handleEvent: function () {
                this.avatar.img.style.display = "none";
                this.avatar.element.classList.add("icons-chatAnonError");
            }
        });
    }
    ChatAvatar.prototype.getHTML = function () {
        return this.element;
    };
    ChatAvatar.prototype.getUser = function () {
        return this.user;
    };
    ChatAvatar.prototype.setOnline = function (online) {
        if (online) {
            this.element.style.display = "";
        }
        else {
            this.element.style.display = "none";
        }
        if (online !== this.online) {
            this.changedOnline = true;
            this.online = online;
        }
    };
    ChatAvatar.prototype.reset = function () {
        this.setOnline(false);
        this.changedOnline = false;
    };
    ChatAvatar.prototype.isChangedOnline = function () {
        var is = this.changedOnline;
        this.changedOnline = false;
        return is;
    };
    ChatAvatar.prototype.setImg = function (img) {
        if (img === null) {
            this.img.style.display = "none";
            this.element.classList.add("icons-chatAnon");
            this.element.classList.remove("icons-chatAnonError");
        }
        else {
            this.img.style.display = "";
            this.element.classList.remove("icons-chatAnon");
            this.element.classList.remove("icons-chatAnonError");
            this.img.src = img;
        }
    };
    ChatAvatar.prototype.setName = function (name) {
        this.name.nodeValue = name;
    };
    ChatAvatar.prototype.setFocus = function (focus) {
        if (!focus) {
            this.element.style.opacity = "0.7";
        }
        else {
            this.element.style.opacity = "1";
        }
    };
    ChatAvatar.prototype.setTyping = function (typing) {
        if (typing) {
            this.typing.style.display = "";
        }
        else {
            this.typing.style.display = "none";
        }
    };
    ChatAvatar.prototype.setAfk = function (afk) {
        if (afk) {
            this.afk.style.display = "";
        }
        else {
            this.afk.style.display = "none";
        }
    };
    ChatAvatar.prototype.updateName = function () {
        if (this.persona === null) {
            if (this.user !== null)
                this.setName(this.user.getFullNickname());
        }
        else {
            this.setName(this.persona);
        }
        if (this.user !== null) {
            this.element.setAttribute("title", this.user.getFullNickname());
        }
        else if (this.persona !== null) {
            this.element.setAttribute("title", this.persona);
        }
        else {
            this.element.removeAttribute("title");
        }
    };
    ChatAvatar.prototype.updateFromObject = function (obj) {
        if (obj['id'] !== undefined) {
            this.user = DB.UserDB.getUser(obj['id']);
        }
        if (obj['idle'] !== undefined)
            this.setAfk(obj['idle']);
        if (obj['focused'] !== undefined)
            this.setFocus(obj['focused']);
        if (obj['online'] !== undefined)
            this.setOnline(obj['online']);
        if (obj['typing'] !== undefined)
            this.setTyping(obj['typing']);
        if (obj['persona'] !== undefined)
            this.persona = obj['persona'];
        if (obj['avatar'] !== undefined)
            this.setImg(obj['avatar']);
        this.updateName();
    };
    return ChatAvatar;
}());
var ChatNotificationIcon = (function () {
    function ChatNotificationIcon(icon, hasLanguage) {
        this.element = document.createElement("div");
        this.hoverInfo = document.createElement("div");
        this.language = hasLanguage === undefined ? true : hasLanguage;
        this.element.classList.add("chatNotificationIcon");
        this.element.classList.add(icon);
        this.hoverInfo.classList.add("chatNotificationHover");
        if (this.language) {
            this.element.appendChild(this.hoverInfo);
        }
        this.element.style.display = "none";
    }
    ChatNotificationIcon.prototype.addText = function (text) {
        this.hoverInfo.appendChild(document.createTextNode(text));
    };
    ChatNotificationIcon.prototype.getElement = function () {
        if (this.language) {
            UI.Language.markLanguage(this.hoverInfo);
        }
        return this.element;
    };
    ChatNotificationIcon.prototype.show = function () {
        if (this.element.style.display === "") {
            return false;
        }
        this.element.style.display = "";
        return true;
    };
    ChatNotificationIcon.prototype.hide = function () {
        if (this.element.style.display === "none") {
            return false;
        }
        this.element.style.display = "none";
        return true;
    };
    return ChatNotificationIcon;
}());
var ChatFormState = (function () {
    function ChatFormState(element) {
        this.state = -1;
        this.element = element;
        this.setState(ChatFormState.STATE_NORMAL);
    }
    ChatFormState.prototype.getState = function () {
        return this.state;
    };
    ChatFormState.prototype.isNormal = function () {
        return this.state === ChatFormState.STATE_NORMAL;
    };
    ChatFormState.prototype.isAction = function () {
        return this.state === ChatFormState.STATE_ACTION;
    };
    ChatFormState.prototype.isStory = function () {
        return this.state === ChatFormState.STATE_STORY;
    };
    ChatFormState.prototype.isOff = function () {
        return this.state === ChatFormState.STATE_OFF;
    };
    ChatFormState.prototype.setState = function (state) {
        if (this.state === state) {
            return;
        }
        var stateClass = ["icons-chatFormStateNormal", "icons-chatFormStateAction", "icons-chatFormStateStory", "icons-chatFormStateOff"];
        this.element.classList.remove(stateClass[this.state]);
        this.element.classList.add(stateClass[state]);
        this.state = state;
    };
    ChatFormState.STATE_NORMAL = 0;
    ChatFormState.STATE_ACTION = 1;
    ChatFormState.STATE_STORY = 2;
    ChatFormState.STATE_OFF = 3;
    return ChatFormState;
}());
var ChatAvatarChoice = (function () {
    function ChatAvatarChoice(name, avatar) {
        this.avatar = new ChatAvatar();
        this.box = document.createElement("div");
        this.useButton = document.createElement("a");
        this.deleteButton = document.createElement("a");
        var obj = {
            id: Application.Login.isLogged() ? Application.Login.getUser().id : undefined,
            persona: name,
            avatar: avatar
        };
        this.avatar.updateFromObject(obj);
        this.box.appendChild(this.avatar.getHTML());
        this.box.appendChild(this.useButton);
        this.box.appendChild(this.deleteButton);
        this.id = avatar + ";" + name;
        this.box.classList.add("chatAvatarChoiceBox");
        this.useButton.classList.add("chatAvatarChoiceBoxUse");
        this.deleteButton.classList.add("chatAvatarChoiceBoxDelete");
        this.useButton.addEventListener("click", {
            name: name,
            avatar: avatar,
            handleEvent: function () {
                UI.Chat.PersonaDesigner.usePersona(this.name, this.avatar);
            }
        });
        this.deleteButton.addEventListener("click", {
            choice: this,
            handleEvent: function () {
                UI.Chat.PersonaDesigner.removeChoice(this.choice);
            }
        });
        UI.Language.addLanguageTitle(this.useButton, "_CHATPERSONADESIGNERUSE_");
        UI.Language.addLanguageTitle(this.deleteButton, "_CHATPERSONADESIGNERDELETE_");
        this.nameStr = name;
        this.avatarStr = avatar;
    }
    ChatAvatarChoice.prototype.getHTML = function () {
        return this.box;
    };
    return ChatAvatarChoice;
}());
var ChatSystemMessage = (function () {
    function ChatSystemMessage(hasLanguage) {
        this.element = document.createElement("p");
        this.element.classList.add("chatMessageNotification");
        this.hasLanguage = hasLanguage;
    }
    ChatSystemMessage.prototype.addLangVar = function (id, value) {
        UI.Language.addLanguageVariable(this.element, id, value);
    };
    ChatSystemMessage.prototype.addTextLink = function (text, hasLanguage, click) {
        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode(text));
        if (hasLanguage) {
            UI.Language.markLanguage(a);
        }
        a.addEventListener("click", click);
        this.element.appendChild(a);
    };
    ChatSystemMessage.prototype.addText = function (text) {
        this.element.appendChild(document.createTextNode(text));
    };
    ChatSystemMessage.prototype.addElement = function (ele) {
        this.element.appendChild(ele);
    };
    ChatSystemMessage.prototype.getElement = function () {
        if (this.hasLanguage) {
            UI.Language.markLanguage(this.element);
        }
        return this.element;
    };
    return ChatSystemMessage;
}());
var ImagesRow = (function () {
    function ImagesRow(image, folder) {
        this.folder = folder;
        this.image = image;
        var imageContainer = document.createElement("div");
        imageContainer.classList.add("imagesRow");
        var shareButton = document.createElement("a");
        shareButton.classList.add("imagesLeftButton");
        shareButton.classList.add("icons-imagesShare");
        UI.Language.addLanguageTitle(shareButton, "_IMAGESSHARE_");
        shareButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.share();
            }
        });
        var viewButton = document.createElement("a");
        viewButton.classList.add("imagesLeftButton");
        viewButton.classList.add("icons-imagesView");
        UI.Language.addLanguageTitle(viewButton, "_IMAGESVIEW_");
        viewButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.view();
            }
        });
        var personaButton = document.createElement("a");
        personaButton.classList.add("imagesLeftButton");
        personaButton.classList.add("icons-imagesPersona");
        UI.Language.addLanguageTitle(personaButton, "_IMAGESPERSONA_");
        personaButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.usePersona();
            }
        });
        var deleteButton = document.createElement("a");
        deleteButton.classList.add("imagesRightButton");
        deleteButton.classList.add("icons-imagesDelete");
        UI.Language.addLanguageTitle(deleteButton, "_IMAGESDELETE_");
        deleteButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.delete();
            }
        });
        var renameButton = document.createElement("a");
        renameButton.classList.add("imagesRightButton");
        renameButton.classList.add("icons-imagesRename");
        UI.Language.addLanguageTitle(renameButton, "_IMAGESRENAME_");
        renameButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.rename();
            }
        });
        var folderButton = document.createElement("a");
        folderButton.classList.add("imagesRightButton");
        folderButton.classList.add("icons-imagesFolder");
        UI.Language.addLanguageTitle(folderButton, "_IMAGESFOLDER_");
        folderButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.renameFolder();
            }
        });
        var imageTitle = document.createElement("a");
        imageTitle.classList.add("imagesRowTitle");
        var nameNode = document.createTextNode(image.getName());
        imageTitle.appendChild(nameNode);
        this.nameNode = nameNode;
        UI.Language.markLanguage(shareButton, viewButton, personaButton, deleteButton, renameButton, folderButton);
        imageContainer.appendChild(shareButton);
        imageContainer.appendChild(viewButton);
        imageContainer.appendChild(personaButton);
        imageContainer.appendChild(deleteButton);
        imageContainer.appendChild(renameButton);
        imageContainer.appendChild(folderButton);
        imageContainer.appendChild(imageTitle);
        this.html = imageContainer;
    }
    ImagesRow.prototype.view = function () {
        UI.Pica.loadImage(this.image.getLink());
    };
    ImagesRow.prototype.share = function () {
        MessageImage.shareLink(this.image.getName(), this.image.getLink());
    };
    ImagesRow.prototype.usePersona = function () {
        UI.Chat.PersonaDesigner.createPersona(this.image.getName().replace(/ *\([^)]*\) */, '').trim(), this.image.getLink());
        UI.Chat.PersonaManager.createAndUsePersona(this.image.getName().replace(/ *\([^)]*\) */, '').trim(), this.image.getLink());
    };
    ImagesRow.prototype.delete = function () {
        this.html.parentElement.removeChild(this.html);
        this.folder.considerSuicide();
        DB.ImageDB.removeImage(this.image);
    };
    ImagesRow.prototype.renameFolder = function () {
        var newName = prompt(UI.Language.getLanguage().getLingo("_IMAGESRENAMEFOLDERPROMPT_", { languagea: this.image.getName(), languageb: this.image.getFolder() }));
        if (newName === null) {
            return;
        }
        this.image.setFolder(newName.trim());
    };
    ImagesRow.prototype.rename = function () {
        var newName = prompt(UI.Language.getLanguage().getLingo("_IMAGESRENAMEPROMPT_", { languagea: this.image.getName() }));
        if (newName === null || newName === "") {
            return;
        }
        this.image.setName(newName);
        this.nameNode.nodeValue = this.image.getName();
    };
    ImagesRow.prototype.getHTML = function () {
        return this.html;
    };
    return ImagesRow;
}());
var ImagesFolder = (function () {
    function ImagesFolder(images) {
        var folderName = images[0].getFolder();
        this.name = folderName;
        if (folderName === "") {
            folderName = UI.Language.getLanguage().getLingo("_IMAGESNOFOLDERNAME_");
        }
        var folderContainer = document.createElement("div");
        folderContainer.classList.add("imagesFolder");
        this.folderContainer = folderContainer;
        var folderIcon = document.createElement("a");
        folderIcon.classList.add("imagesFolderIcon");
        var folderTitle = document.createElement("span");
        folderTitle.classList.add("imagesFolderTitle");
        folderTitle.addEventListener("click", {
            folder: this,
            handleEvent: function () {
                this.folder.toggle();
            }
        });
        folderTitle.appendChild(document.createTextNode(folderName));
        folderContainer.appendChild(folderIcon);
        folderContainer.appendChild(folderTitle);
        for (var k = 0; k < images.length; k++) {
            var imageRow = new ImagesRow(images[k], this);
            folderContainer.appendChild(imageRow.getHTML());
        }
        this.html = folderContainer;
    }
    ImagesFolder.prototype.getName = function () {
        return this.name;
    };
    ImagesFolder.prototype.open = function () {
        this.folderContainer.classList.add("folderOpen");
    };
    ImagesFolder.prototype.toggle = function () {
        this.folderContainer.classList.toggle("folderOpen");
        if (this.folderContainer.classList.contains("folderOpen")) {
            UI.Images.stayInFolder(this.name);
        }
    };
    ImagesFolder.prototype.getHTML = function () {
        return this.html;
    };
    ImagesFolder.prototype.considerSuicide = function () {
        if (this.html.children.length <= 2) {
            this.html.parentElement.removeChild(this.html);
        }
    };
    return ImagesFolder;
}());
var SheetsRow = (function () {
    function SheetsRow(sheet) {
        this.sheet = sheet;
        this.html = document.createElement("p");
        this.html.classList.add("sheetListSheet");
        var nameLink = document.createElement("a");
        nameLink.classList.add("sheetNameLink");
        this.nameNode = document.createTextNode(sheet.getName());
        nameLink.appendChild(this.nameNode);
        this.html.appendChild(nameLink);
        nameLink.addEventListener("click", {
            row: this,
            handleEvent: function (e) {
                e.preventDefault();
                this.row.open();
            }
        });
        if (sheet.isEditable()) {
            var folder = document.createElement("a");
            folder.classList.add("sheetExtraButton");
            folder.classList.add("textLink");
            folder.appendChild(document.createTextNode("_SHEETSRENAMEFOLDER_"));
            UI.Language.markLanguage(folder);
            this.html.appendChild(folder);
            folder.addEventListener("click", {
                row: this,
                handleEvent: function (e) {
                    e.preventDefault();
                    this.row.editFolder();
                }
            });
        }
        if (sheet.isPromotable()) {
            var perm = document.createElement("a");
            perm.classList.add("sheetExtraButton");
            perm.classList.add("textLink");
            perm.appendChild(document.createTextNode("_SHEETSCHANGEPERMISSIONS_"));
            UI.Language.markLanguage(perm);
            this.html.appendChild(perm);
            perm.addEventListener("click", {
                row: this,
                handleEvent: function (e) {
                    e.preventDefault();
                    this.row.editPerm();
                }
            });
        }
        if (sheet.isDeletable()) {
            var del = document.createElement("a");
            del.classList.add("sheetExtraButton");
            del.classList.add("textLink");
            del.appendChild(document.createTextNode("_SHEETSDELETE_"));
            UI.Language.markLanguage(del);
            this.html.appendChild(del);
            del.addEventListener("click", {
                row: this,
                handleEvent: function (e) {
                    e.preventDefault();
                    this.row.deleteSheet();
                }
            });
        }
    }
    SheetsRow.prototype.open = function () {
    };
    SheetsRow.prototype.deleteSheet = function () {
        if (confirm(UI.Language.getLanguage().getLingo("_SHEETCONFIRMDELETE_", { languagea: this.sheet.getName() }))) {
            var cbs = {
                sheet: this.sheet,
                oldFolder: this.sheet.getFolder(),
                handleEvent: function () {
                    UI.Sheets.keepOpen(this.oldFolder, this.sheet.getGameid());
                    UI.Sheets.callSelf();
                }
            };
            Server.Sheets.deleteSheet(this.sheet, cbs);
        }
    };
    SheetsRow.prototype.editPerm = function () {
        UI.Sheets.SheetPermissionDesigner.callSelf(this.sheet);
    };
    SheetsRow.prototype.editFolder = function () {
        var oldFolder = this.sheet.getFolder();
        var newName = prompt(UI.Language.getLanguage().getLingo("_SHEETSRENAMEFOLDERPROMPT_", { languagea: this.sheet.getName(), languageb: this.sheet.folder }));
        if (newName === null) {
            return;
        }
        this.sheet.folder = newName.trim();
        if (this.sheet.getFolder() !== oldFolder) {
            var cbs = {
                sheet: this.sheet,
                oldFolder: oldFolder,
                handleEvent: function () {
                    UI.Sheets.keepOpen(this.oldFolder, this.sheet.getGameid());
                    UI.Sheets.callSelf();
                }
            };
            Server.Sheets.sendFolder(this.sheet, cbs);
        }
    };
    SheetsRow.prototype.getHTML = function () {
        return this.html;
    };
    return SheetsRow;
}());
var SheetsFolder = (function () {
    function SheetsFolder(sheets, open) {
        var folderName = sheets[0].folder;
        if (folderName === "") {
            folderName = UI.Language.getLanguage().getLingo("_SHEETSNOFOLDERNAME_");
        }
        this.html = document.createElement("div");
        this.html.classList.add("sheetListFolderContainer");
        this.html.classList.add("lightHoverable");
        if (open === true) {
            this.html.classList.add("openSheetFolder");
        }
        var p = document.createElement("p");
        p.classList.add("sheetListFolderName");
        p.appendChild(document.createTextNode(folderName));
        p.addEventListener("click", function (e) {
            e.preventDefault();
            this.parentElement.classList.toggle("openSheetFolder");
        });
        this.html.appendChild(p);
        for (var i = 0; i < sheets.length; i++) {
            var sheet = new SheetsRow(sheets[i]);
            this.html.appendChild(sheet.getHTML());
        }
    }
    SheetsFolder.prototype.getHTML = function () {
        return this.html;
    };
    return SheetsFolder;
}());
var SheetPermRow = (function () {
    function SheetPermRow(player) {
        this.deleteSheet = false;
        this.editSheet = false;
        this.viewSheet = false;
        this.promoteSheet = false;
        this.deleteSheet = player['deletar'];
        this.editSheet = player['editar'];
        this.viewSheet = player['visualizar'];
        this.promoteSheet = player['promote'];
        this.sheetId = player['id'];
        this.userId = player['userid'];
        this.nickname = player['nickname'];
        this.nicknamesufix = player['nicknamesufix'];
    }
    SheetPermRow.prototype.getHTML = function () {
        var p = document.createElement("p");
        p.classList.add("sheetPermRow");
        var viewLabel = document.createElement("label");
        viewLabel.classList.add("language");
        viewLabel.classList.add("sheetPermLabel");
        return p;
    };
    return SheetPermRow;
}());
var PicaContainer = (function () {
    function PicaContainer(picaWindow) {
        this.tools = new PicaToolbar();
        this.board = new PicaBoard();
        this.container = document.createElement("div");
        this.container.id = "pictureContainer";
        this.container.appendChild(this.board.getHTML());
        this.container.appendChild(this.tools.getHTML());
        picaWindow.appendChild(this.container);
        this.board.resize();
    }
    PicaContainer.prototype.loadImage = function (url) {
        this.board.loadImage(url);
    };
    PicaContainer.prototype.getHTML = function () {
        return this.container;
    };
    return PicaContainer;
}());
var PicaTool = (function () {
    function PicaTool() {
    }
    return PicaTool;
}());
var PicaToolbar = (function () {
    function PicaToolbar() {
        this.container = document.createElement("div");
        this.container.id = "pictureToolsContainer";
    }
    PicaToolbar.prototype.getHTML = function () {
        return this.container;
    };
    PicaToolbar.prototype.addTool = function () {
    };
    return PicaToolbar;
}());
var PicaBoard = (function () {
    function PicaBoard() {
        this.board = document.createElement("div");
        this.background = new PicaBG(this);
        this.board.id = "pictureBoard";
        console.debug("[PicaBoard] Binding on window resize.");
        var resizer = {
            board: this,
            handleEvent: function () {
                this.board.resize();
            }
        };
        window.addEventListener("resize", resizer);
    }
    PicaBoard.prototype.loadImage = function (url) {
        this.resize();
        this.background.loadImage(url);
    };
    PicaBoard.prototype.getAvailHeight = function () {
        return this.availHeight;
    };
    PicaBoard.prototype.getAvailWidth = function () {
        return this.availWidth;
    };
    PicaBoard.prototype.resize = function () {
        this.availHeight = this.board.offsetHeight;
        this.availWidth = this.board.offsetWidth;
        this.background.resize();
    };
    PicaBoard.prototype.getHTML = function () {
        return this.board;
    };
    return PicaBoard;
}());
var PicaBG = (function () {
    function PicaBG(board) {
        this.img = document.createElement("img");
        this.board = board;
        this.img.style.position = "absolute";
        this.img.addEventListener("load", {
            BG: this,
            handleEvent: function (data) {
                this.BG.onLoad();
            }
        });
        this.board.getHTML().appendChild(this.img);
    }
    PicaBG.prototype.onLoad = function () {
        if (!this.img.complete || (typeof this.img.naturalHeight === "undefined" || this.img.naturalHeight === 0)) {
            return;
        }
        this.img.style.opacity = "1";
        var height = this.img.naturalHeight;
        var width = this.img.naturalWidth;
        if (!(height < this.board.getAvailHeight() && width < this.board.getAvailWidth())) {
            var fWidth = this.board.getAvailWidth() / width;
            var fHeight = this.board.getAvailHeight() / height;
            var factor = fWidth < fHeight ? fWidth : fHeight;
            height = height * factor;
            width = width * factor;
            console.log(fWidth, fHeight, factor, height, width);
        }
        this.img.height = height;
        this.img.width = width;
        this.img.style.left = ((this.board.getAvailWidth() - width) / 2).toString() + "px";
        this.img.style.top = ((this.board.getAvailHeight() - height) / 2).toString() + "px";
        UI.Pica.stopLoading();
    };
    PicaBG.prototype.loadImage = function (url) {
        if (this.img.src === url) {
            return;
        }
        else {
            this.img.style.opacity = "0";
            UI.Pica.startLoading();
            this.img.src = url;
        }
    };
    PicaBG.prototype.resize = function () {
    };
    return PicaBG;
}());
var SoundsRow = (function () {
    function SoundsRow(snd, folder) {
        this.folder = folder;
        this.sound = snd;
        var soundContainer = document.createElement("div");
        soundContainer.classList.add("imagesRow");
        var shareButton = document.createElement("a");
        shareButton.classList.add("imagesLeftButton");
        shareButton.classList.add("icons-imagesShare");
        UI.Language.addLanguageTitle(shareButton, "_IMAGESSHARE_");
        shareButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.share();
            }
        });
        var viewButton = document.createElement("a");
        viewButton.classList.add("imagesLeftButton");
        viewButton.classList.add("icons-soundsPlay");
        UI.Language.addLanguageTitle(viewButton, "_SOUNDSPLAY_");
        viewButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.play();
            }
        });
        var personaButton = document.createElement("a");
        personaButton.classList.add("imagesLeftButton");
        personaButton.classList.add("icons-imagesPersona");
        UI.Language.addLanguageTitle(personaButton, "_IMAGESPERSONA_");
        personaButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.usePersona();
            }
        });
        var deleteButton = document.createElement("a");
        deleteButton.classList.add("imagesRightButton");
        deleteButton.classList.add("icons-imagesDelete");
        UI.Language.addLanguageTitle(deleteButton, "_IMAGESDELETE_");
        deleteButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.delete();
            }
        });
        var renameButton = document.createElement("a");
        renameButton.classList.add("imagesRightButton");
        renameButton.classList.add("icons-imagesRename");
        UI.Language.addLanguageTitle(renameButton, "_SOUNDSRENAME_");
        renameButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.rename();
            }
        });
        var folderButton = document.createElement("a");
        folderButton.classList.add("imagesRightButton");
        folderButton.classList.add("icons-imagesFolder");
        UI.Language.addLanguageTitle(folderButton, "_SOUNDSFOLDER_");
        folderButton.addEventListener("click", {
            row: this,
            handleEvent: function () {
                this.row.renameFolder();
            }
        });
        var imageTitle = document.createElement("a");
        imageTitle.classList.add("imagesRowTitle");
        var nameNode = document.createTextNode(this.sound.getName());
        imageTitle.appendChild(nameNode);
        this.nameNode = nameNode;
        UI.Language.markLanguage(shareButton, viewButton, personaButton, deleteButton, renameButton, folderButton);
        soundContainer.appendChild(shareButton);
        soundContainer.appendChild(viewButton);
        soundContainer.appendChild(deleteButton);
        soundContainer.appendChild(renameButton);
        soundContainer.appendChild(folderButton);
        soundContainer.appendChild(imageTitle);
        this.html = soundContainer;
    }
    SoundsRow.prototype.play = function () {
        if (this.sound.isBgm()) {
            UI.SoundController.playBGM(this.sound.getLink());
        }
        else {
            UI.SoundController.playSE(this.sound.getLink());
        }
    };
    SoundsRow.prototype.share = function () {
        if (this.sound.isBgm()) {
            MessageBGM.shareLink(this.sound.getName(), this.sound.getLink());
        }
        else {
            MessageSE.shareLink(this.sound.getName(), this.sound.getLink());
        }
    };
    SoundsRow.prototype.delete = function () {
        this.html.parentElement.removeChild(this.html);
        this.folder.considerSuicide();
        DB.SoundDB.removeSound(this.sound);
    };
    SoundsRow.prototype.renameFolder = function () {
        UI.Sounds.stayInFolder(this.sound.getFolder());
        var newName = prompt(UI.Language.getLanguage().getLingo("_SOUNDSRENAMEFOLDERPROMPT_", { languagea: this.sound.getName(), languageb: this.sound.getFolder() }));
        if (newName === null) {
            return;
        }
        this.sound.setFolder(newName.trim());
        UI.Sounds.printSounds();
    };
    SoundsRow.prototype.rename = function () {
        var newName = prompt(UI.Language.getLanguage().getLingo("_SOUNDSRENAMEPROMPT_", { languagea: this.sound.getName() }));
        if (newName === null || newName === "") {
            return;
        }
        this.sound.setName(newName);
        this.nameNode.nodeValue = this.sound.getName();
    };
    SoundsRow.prototype.getHTML = function () {
        return this.html;
    };
    return SoundsRow;
}());
var SoundsFolder = (function () {
    function SoundsFolder(sounds) {
        var folderName = sounds[0].getFolder();
        this.name = folderName;
        if (folderName === "") {
            folderName = UI.Language.getLanguage().getLingo("_SOUNDSNOFOLDERNAME_");
        }
        var folderContainer = document.createElement("div");
        folderContainer.classList.add("imagesFolder");
        this.folderContainer = folderContainer;
        var folderIcon = document.createElement("a");
        folderIcon.classList.add("imagesFolderIcon");
        var folderTitle = document.createElement("span");
        folderTitle.classList.add("imagesFolderTitle");
        folderTitle.addEventListener("click", {
            folder: this,
            handleEvent: function () {
                this.folder.toggle();
            }
        });
        folderTitle.appendChild(document.createTextNode(folderName));
        folderContainer.appendChild(folderIcon);
        folderContainer.appendChild(folderTitle);
        for (var k = 0; k < sounds.length; k++) {
            var soundRow = new SoundsRow(sounds[k], this);
            folderContainer.appendChild(soundRow.getHTML());
        }
        this.html = folderContainer;
    }
    SoundsFolder.prototype.getName = function () {
        return this.name;
    };
    SoundsFolder.prototype.open = function () {
        this.folderContainer.classList.add("folderOpen");
    };
    SoundsFolder.prototype.toggle = function () {
        this.folderContainer.classList.toggle("folderOpen");
        if (this.folderContainer.classList.contains("folderOpen")) {
            UI.Images.stayInFolder(this.name);
        }
    };
    SoundsFolder.prototype.getHTML = function () {
        return this.html;
    };
    SoundsFolder.prototype.considerSuicide = function () {
        if (this.html.children.length <= 2) {
            this.html.parentElement.removeChild(this.html);
        }
    };
    return SoundsFolder;
}());
var SheetStyle = (function () {
    function SheetStyle() {
        this.css = document.createElement("style");
        this.visible = document.createElement("div");
        this.$visible = $(this.visible);
        this.multipleChanges = false;
        this.pendingChanges = [];
        this.changeCounter = 0;
        this.idCounter = 0;
        this.after = function () { };
        this.visible.setAttribute("id", "sheetDiv");
        this.css.type = "text/css";
    }
    SheetStyle.prototype.getUniqueID = function () {
        return "undefined" + (this.idCounter++);
    };
    SheetStyle.prototype.simplifyName = function (str) {
        return str.latinise().toLowerCase().replace(/ /g, '');
    };
    SheetStyle.prototype.addStyle = function (style) {
        this.styleInstance = style;
        this.visible.innerHTML = style.html;
        this.css.innerHTML = style.css;
        this.sheet = new Sheet(this, this.visible.childNodes);
        this.after();
    };
    SheetStyle.prototype.triggerVariableChange = function (variable) {
        if (this.multipleChanges) {
            this.pendingChanges.push(variable);
        }
        else {
            variable.triggerChange(this.changeCounter++);
        }
    };
    SheetStyle.prototype.triggerAll = function () {
        for (var i = 0; i < this.pendingChanges.length; i++) {
            this.pendingChanges[i].triggerChange(this.changeCounter);
        }
        this.changeCounter += 1;
        this.pendingChanges = [];
    };
    SheetStyle.prototype.getStyle = function () {
        return this.css;
    };
    SheetStyle.prototype.getElement = function () {
        return this.visible;
    };
    SheetStyle.prototype.get$Element = function () {
        return this.$visible;
    };
    return SheetStyle;
}());
var StyleFactory;
(function (StyleFactory) {
    function getCreator() {
        var creator = SheetStyle;
        var a = "var DFS;(function (DFS) {    function sayHi() {        console.log('Hi');    }    DFS.sayHi = sayHi;})(DFS || (DFS = {}));var SomethingElse = (function () {    function SomethingElse() {        this.gluglu = 10;    }    return SomethingElse;})();var NewSheetStyle = (function (_super) {    __extends(NewSheetStyle, _super);    function NewSheetStyle() {        _super.call(this);        this.something = 0;        this.something = 1;    }    NewSheetStyle.prototype.createGl = function () {        return new SomethingElse();    };    NewSheetStyle.prototype.sayHi = function () {        DFS.sayHi();    };    return NewSheetStyle;})(SheetStyle);creator = NewSheetStyle;";
        try {
            eval(a);
        }
        catch (e) {
            console.error("[SheetStyle] Error in style code.");
            console.log(e);
            creator = SheetStyle;
        }
        if (creator === SheetStyle) {
            console.warn("[SheetStyle] No changes made to SheetStyle, utilizing common style.");
        }
        return creator;
    }
    StyleFactory.getCreator = getCreator;
})(StyleFactory || (StyleFactory = {}));
var Sheet = (function () {
    function Sheet(style, eles) {
        this.elements = [];
        this.variables = {};
        this.lists = {};
        this.variableShortcuts = {};
        this.buttons = {};
        this.style = style;
        for (var i = 0; i < eles.length; i++) {
            this.elements.push(eles[i]);
        }
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].nodeType === Node.ELEMENT_NODE) {
                this.processElement(this.elements[i]);
            }
        }
    }
    Sheet.prototype.processElement = function (element) {
        if (element.classList.contains("sheetList")) {
            this.createList(element);
        }
        else if (element.classList.contains("sheetVariable")) {
            this.createVariable(element);
        }
        else if (element.classList.contains("sheetButton")) {
            this.createButton(element);
        }
        else {
            var lists = element.getElementsByClassName("sheetList");
            for (var i = 0; i < lists.length; i++) {
                this.createList(lists[i]);
            }
            var variables = element.getElementsByClassName("sheetVariable");
            for (var i = 0; i < variables.length; i++) {
                this.createVariable(variables[i]);
            }
            var buttons = element.getElementsByClassName("sheetButton");
            for (var i = 0; i < buttons.length; i++) {
                this.createButton(buttons[i]);
            }
        }
    };
    Sheet.prototype.getValueFor = function (id) {
        id = this.style.simplifyName(id);
        return this.getValueForSimpleId(id);
    };
    Sheet.prototype.getValueForSimpleId = function (id) {
        if (this.variableShortcuts[id] !== undefined) {
            return this.variableShortcuts[id].getValue();
        }
        return null;
    };
    Sheet.prototype.getVariable = function (id) {
        if (this.variables[id] !== undefined) {
            return this.variables[id];
        }
        return null;
    };
    Sheet.prototype.getVariableBySimpleId = function (simpleid) {
        if (this.variableShortcuts[simpleid] !== undefined) {
            return this.variableShortcuts[simpleid];
        }
        return null;
    };
    Sheet.prototype.getButton = function (id) {
        if (this.buttons[id] !== undefined) {
            return this.buttons[id];
        }
        return null;
    };
    Sheet.prototype.createVariable = function (element) {
        var constructor;
        var variable;
        var type;
        type = element.dataset['type'] === undefined ? "text" : element.dataset['type'].replace(/[^A-Za-z0-9]/g, "").toLowerCase();
        if (eval("typeof SheetVariable" + type + " !== \"function\"")) {
            type = "text";
        }
        constructor = eval("SheetVariable" + type);
        variable = new constructor(this, this.style, element);
        this.variables[variable.id] = variable;
        this.variableShortcuts[this.style.simplifyName(variable.id)] = variable;
    };
    Sheet.prototype.createButton = function (element) {
        var constructor;
        var button;
        var type;
        type = element.dataset['type'] === undefined ? "" : element.dataset['type'].replace(/[^A-Za-z0-9]/g, "").toLowerCase();
        if (eval("typeof SheetButton" + type + " !== \"function\"")) {
            type = "";
        }
        constructor = eval("SheetButton" + type);
        button = new constructor(this, this.style, element);
        this.buttons[button.id] = button;
    };
    Sheet.prototype.createList = function (element) {
        var list = new SheetList(this, this.style, element);
        this.lists[list.id] = list;
        this.variableShortcuts[this.style.simplifyName(list.id)] = list;
    };
    return Sheet;
}());
var SheetList = (function () {
    function SheetList(sheet, style, element) {
        this.rows = [];
        this.detachedRows = [];
        this.rowElements = [];
        this.keyIndex = null;
        this.keyValue = null;
        this.sheet = sheet;
        this.style = style;
        while (element.firstChild !== null) {
            this.rowElements.push(element.removeChild(element.firstChild));
        }
        this.visible = element;
        this.id = element.dataset['id'] === undefined ? this.style.getUniqueID() : element.dataset['id'];
    }
    SheetList.prototype.getValueFor = function (id) {
        id = this.style.simplifyName(id);
        if (this.keyValue !== null && this.keyIndex !== null) {
            for (var i = 0; i < this.rows.length; i++) {
                var value = this.rows[i].getValueFor(this.keyIndex);
                if (typeof value === "string") {
                    var simpleValue = this.style.simplifyName(value);
                    if (simpleValue === id) {
                        return this.rows[i].getValueFor(this.keyValue);
                    }
                }
                else {
                    return null;
                }
            }
        }
        return null;
    };
    SheetList.prototype.getValue = function () {
        if (this.keyValue !== null) {
            var values = [];
            for (var i = 0; i < this.rows.length; i++) {
                values.push(this.rows[i].getValueFor(this.keyValue));
            }
            return values;
        }
        else {
            return null;
        }
    };
    return SheetList;
}());
var SheetVariable = (function () {
    function SheetVariable(parent, style, ele) {
        this.value = null;
        this.editable = true;
        this.changeTrigger = new Trigger();
        this.parent = parent;
        this.style = style;
        this.visible = ele;
        this.id = ele.dataset['id'] === undefined ? this.style.getUniqueID() : ele.dataset['id'];
        this.editable = ele.dataset['editable'] === undefined ? true : (ele.dataset['editable'].toLowerCase() === "true" || ele.dataset['editable'] === "1");
        if (this.editable) {
            ele.contentEditable = "true";
            ele.addEventListener("input", {
                variable: this,
                handleEvent: function (e) {
                    this.variable.triggerInput(e);
                }
            });
            ele.addEventListener("blur", {
                variable: this,
                handleEvent: function (e) {
                    this.variable.triggerBlur();
                }
            });
        }
        else {
            ele.contentEditable = "false";
        }
    }
    SheetVariable.prototype.cleanChildren = function () {
        while (this.visible.lastChild !== null) {
            this.visible.removeChild(this.visible.lastChild);
        }
    };
    SheetVariable.prototype.updateVisible = function () {
        this.cleanChildren();
        this.visible.appendChild(document.createTextNode(this.value));
    };
    SheetVariable.prototype.triggerInput = function (e) {
    };
    SheetVariable.prototype.triggerBlur = function () {
        this.storeValue(this.visible.innerText);
    };
    SheetVariable.prototype.storeValue = function (val) {
        if (val !== this.value) {
            this.value = val;
            this.style.triggerVariableChange(this);
            this.updateVisible();
        }
    };
    SheetVariable.prototype.triggerChange = function (counter) {
        this.changeTrigger.trigger(this, counter);
    };
    SheetVariable.prototype.getValue = function () {
        return this.value;
    };
    SheetVariable.prototype.exportObject = function () {
        return this.value;
    };
    SheetVariable.prototype.addOnChange = function (f) {
        this.changeTrigger.addListener(f);
    };
    return SheetVariable;
}());
var SheetButton = (function () {
    function SheetButton(sheet, style, ele) {
        this.click = function () { };
        this.sheet = sheet;
        this.style = style;
        this.visible = ele;
        this.visible.addEventListener("click", {
            button: this,
            handleEvent: function (e) {
                this.button.click(e);
            }
        });
        this.id = ele.dataset['id'] === undefined ? this.style.getUniqueID() : ele.dataset['id'];
    }
    return SheetButton;
}());
var SheetButtonaddrow = (function (_super) {
    __extends(SheetButtonaddrow, _super);
    function SheetButtonaddrow() {
        _super.apply(this, arguments);
        this.click = function () {
            alert("Add Row!");
        };
    }
    return SheetButtonaddrow;
}(SheetButton));
var StyleInstance = (function () {
    function StyleInstance() {
    }
    return StyleInstance;
}());
var SoundLink = (function () {
    function SoundLink(name, url, folder, bgm) {
        this.name = name;
        this.url = url;
        this.folder = folder;
        this.bgm = bgm;
    }
    SoundLink.prototype.getFolder = function () {
        return this.folder;
    };
    SoundLink.prototype.isBgm = function () {
        return this.bgm;
    };
    SoundLink.prototype.setFolder = function (name) {
        this.folder = name;
        DB.SoundDB.considerSaving();
    };
    SoundLink.prototype.getLink = function () {
        return Server.URL.fixURL(this.url);
    };
    SoundLink.prototype.getName = function () {
        return this.name;
    };
    SoundLink.prototype.setName = function (name) {
        if (this.name !== name) {
            this.name = name;
            DB.SoundDB.triggerChange(this);
            DB.SoundDB.considerSaving();
        }
    };
    SoundLink.prototype.exportAsObject = function () {
        return {
            name: this.name,
            url: this.url,
            folder: this.folder,
            bgm: this.bgm
        };
    };
    return SoundLink;
}());
var MessageFactory;
(function (MessageFactory) {
    var messageClasses = {};
    var messageClassesArray = [];
    var messageSlash = {};
    function registerMessage(msg, id, slashCommands) {
        if (messageClasses[id] !== undefined) {
            console.warn("Attempt to overwrite message type at " + id + ". Ignoring. Offending class:", msg);
            return;
        }
        if (messageClassesArray.indexOf(msg) === -1) {
            messageClassesArray.push(msg);
        }
        messageClasses[id] = msg;
        for (var i = 0; i < slashCommands.length; i++) {
            if (messageSlash[slashCommands[i]] !== undefined) {
                console.warn("Attempt to overwrite message slash command at " + slashCommands[i] + ". Ignoring. Offending class:", msg);
                continue;
            }
            messageSlash[slashCommands[i]] = msg;
        }
    }
    MessageFactory.registerMessage = registerMessage;
    function getMessagetypeArray() {
        return messageClassesArray;
    }
    MessageFactory.getMessagetypeArray = getMessagetypeArray;
    function registerSlashCommand(slash, slashCommands) {
        for (var i = 0; i < slashCommands.length; i++) {
            if (messageSlash[slashCommands[i]] !== undefined) {
                console.warn("Attempt to overwrite message slash command at " + slashCommands[i] + ". Ignoring. Offending class:", slash);
                continue;
            }
            messageSlash[slashCommands[i]] = slash;
        }
    }
    MessageFactory.registerSlashCommand = registerSlashCommand;
    function createMessageFromType(id) {
        id = id.toLowerCase();
        if (messageClasses[id] !== undefined) {
            return new messageClasses[id]();
        }
        return new MessageUnknown();
    }
    MessageFactory.createMessageFromType = createMessageFromType;
    function createTestingMessages() {
        var list = [];
        for (var id in messageClasses) {
            var message = new messageClasses[id]();
            list = list.concat(message.makeMockUp());
        }
        return list;
    }
    MessageFactory.createTestingMessages = createTestingMessages;
    function getConstructorFromText(form) {
        var index = form.indexOf(' ');
        if (index !== -1) {
            var slash = form.substr(0, index).toLowerCase();
            var msg = form.substr(index + 1);
        }
        else {
            var slash = form;
            var msg = "";
        }
        if (messageSlash[slash] !== undefined) {
            return messageSlash[slash];
        }
        return null;
    }
    MessageFactory.getConstructorFromText = getConstructorFromText;
    function createFromText(form) {
        var index = form.indexOf(' ');
        if (index !== -1) {
            var slash = form.substr(0, index).toLowerCase();
            var msg = form.substr(index + 1);
        }
        else {
            var slash = form;
            var msg = "";
        }
        if (messageSlash[slash] !== undefined) {
            var command = new messageSlash[slash]();
            var valid = command.receiveCommand(slash, msg);
            if (valid && command.isMessage()) {
                return command;
            }
            else if (!valid) {
                var errorHTML = command.getInvalidHTML(slash, msg);
                if (errorHTML !== null)
                    UI.Chat.printElement(errorHTML);
                return null;
            }
            else {
                return null;
            }
        }
        var error = new ChatSystemMessage(true);
        error.addText("_CHATINVALIDCOMMAND_");
        UI.Chat.printElement(error.getElement());
        return null;
    }
    MessageFactory.createFromText = createFromText;
})(MessageFactory || (MessageFactory = {}));
var SlashCommand = (function () {
    function SlashCommand() {
    }
    SlashCommand.prototype.receiveCommand = function (slashCommand, message) {
        console.error("SlashCommand.receiveCommand is abstract. Offending class:", this.constructor['name'], this);
        return false;
    };
    SlashCommand.prototype.isMessage = function () {
        return this instanceof Message;
    };
    SlashCommand.prototype.getInvalidHTML = function (slashCommand, msg) {
        return null;
    };
    return SlashCommand;
}());
var SlashClear = (function (_super) {
    __extends(SlashClear, _super);
    function SlashClear() {
        _super.apply(this, arguments);
    }
    return SlashClear;
}(SlashCommand));
MessageFactory.registerSlashCommand(SlashClear, ["/clear", "/clr", "/cls"]);
var SlashReply = (function (_super) {
    __extends(SlashReply, _super);
    function SlashReply() {
        _super.apply(this, arguments);
    }
    return SlashReply;
}(SlashCommand));
MessageFactory.registerSlashCommand(SlashReply, ["/r", "/reply", "/responder", "/resposta"]);
var SlashImages = (function (_super) {
    __extends(SlashImages, _super);
    function SlashImages() {
        _super.apply(this, arguments);
    }
    SlashImages.prototype.receiveCommand = function (slashCommand, message) {
        var room = Server.Chat.getRoom();
        if (room === null)
            return false;
        var messages = MessageImage.getLastImages(room.id);
        if (messages.length > 0) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATIMAGESPRINTINGIMAGES_");
            UI.Chat.printElement(msg.getElement());
            MessageImage.stopAutomation();
            for (var i = messages.length - 1; i >= 0; i--) {
                UI.Chat.printMessage(messages[i]);
            }
            MessageImage.resumeAutomation();
        }
        else {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATIMAGESNOIMAGES_");
            UI.Chat.printElement(msg.getElement());
        }
        return true;
    };
    return SlashImages;
}(SlashCommand));
MessageFactory.registerSlashCommand(SlashImages, ["/images", "/imgs", "/imagens", "/fotos", "/picas"]);
var SlashLog = (function (_super) {
    __extends(SlashLog, _super);
    function SlashLog() {
        _super.apply(this, arguments);
    }
    SlashLog.prototype.receiveCommand = function (slashCommand, message) {
        var cbs = {
            room: Server.Chat.getRoom(),
            handleEvent: function () {
                UI.Logger.callSelf(this.room);
            }
        };
        Server.Chat.getAllMessages(Server.Chat.getRoom().id, cbs);
        return true;
    };
    return SlashLog;
}(SlashCommand));
MessageFactory.registerSlashCommand(SlashLog, ["/log", "/logger"]);
var Message = (function (_super) {
    __extends(Message, _super);
    function Message() {
        _super.apply(this, arguments);
        this.id = 0;
        this.localid = null;
        this.roomid = null;
        this.date = null;
        this.module = "";
        this.msg = "";
        this.special = {};
        this.sending = null;
        this.origin = 0;
        this.destination = null;
        this.updatedTrigger = new Trigger();
        this.html = null;
        this.clone = false;
    }
    Message.prototype.getDate = function () {
        if (this.date === "" || this.date === null) {
            return null;
        }
        return this.date;
    };
    Message.prototype.onPrint = function () { };
    ;
    Message.prototype.setPersona = function (name) {
        this.setSpecial("persona", name);
    };
    Message.prototype.getPersona = function () {
        return this.getSpecial("persona", "???");
    };
    Message.prototype.findPersona = function () { };
    Message.prototype.getLocalId = function () {
        if (this.localid === null)
            DB.MessageDB.registerLocally(this);
    };
    Message.prototype.getUser = function () {
        var user = DB.UserDB.getAUser(this.origin);
        var context = user.getRoomContext(this.roomid);
        if (context === null) {
            context = new UserRoomContext(user);
            context.roomid = this.roomid;
            if (this.origin !== 0) {
                console.warn("[MESSAGE] Could not find user Room Context for " + this.origin + ", creating a new one.");
            }
        }
        return context;
    };
    Message.prototype.addDestinationStorytellers = function (room) {
        if (room === null) {
            return;
        }
        var storytellers = room.getStorytellers();
        for (var i = 0; i < storytellers.length; i++) {
            this.addDestination(storytellers[i].getUser());
        }
    };
    Message.prototype.addDestination = function (user) {
        if (this.destination === null) {
            this.destination = [user.id];
        }
        else if (typeof this.destination === "number") {
            this.destination = [this.destination, user.id];
        }
        else if (Array.isArray(this.destination)) {
            this.destination.push(user.id);
        }
        else {
            console.warn("[MESSAGE] Attempt to add user to unknown destination type? What gives? Offending user and message:", user, this);
        }
    };
    Message.prototype.getDestinations = function () {
        if (Array.isArray(this.destination)) {
            var users = [];
            for (var i = 0; i < this.destination.length; i++) {
                var user = DB.UserDB.getAUser(this.destination[i]);
                var context = user.getRoomContext(this.roomid);
                if (context === null) {
                    context = new UserRoomContext(user);
                    context.roomid = this.roomid;
                    console.warn("[MESSAGE] Could not find user Room Context for " + this.destination[i] + ", creating a new one.");
                }
                users.push(context);
            }
            return users;
        }
        else {
            var user = DB.UserDB.getAUser(this.destination);
            var context = user.getRoomContext(this.roomid);
            if (context === null) {
                context = new UserRoomContext(user);
                context.roomid = this.roomid;
                console.warn("[MESSAGE] Could not find user Room Context for " + this.destination + ", creating a new one.");
            }
            return [context];
        }
    };
    Message.prototype.makeMockUp = function () {
        this.msg = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat orci nulla, et dictum turpis commodo a. Duis iaculis neque lectus, ac sodales diam varius id.";
        return [this];
    };
    Message.prototype.isWhisper = function () {
        if (Array.isArray(this.destination)) {
            return this.destination.length > 0;
        }
        return this.destination !== null && this.destination !== 0;
    };
    Message.prototype.isMine = function () {
        return this.origin === Application.getMyId();
    };
    Message.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.appendChild(document.createTextNode("_CHATMESSAGEUNKNOWNTYPE_"));
        p.dataset['a'] = this.msg;
        return p;
    };
    Message.prototype.getHTML = function () {
        if (this.html === null) {
            this.html = this.createHTML();
        }
        return this.html;
    };
    Message.prototype.prepareSending = function () {
        this.origin = Application.getMyId();
        this.getLocalId();
        var html = this.getHTML();
        if (html !== null && this.html === html) {
            this.html.classList.add("chatMessageSending");
            var timeoutFunction = (function (message) {
                var html = message.getHTML();
                html.classList.remove("chatMessageSending");
                html.classList.add("chatMessageError");
                var errorMessage = new ChatSystemMessage(true);
                errorMessage.addText("_CHATMESSAGENOTSENT_");
                errorMessage.addText(" ");
                var click = {
                    message: message,
                    error: errorMessage,
                    handleEvent: function () {
                        var error = this.error.getElement();
                        if (error.parentNode !== null) {
                            error.parentNode.removeChild(error);
                        }
                        var html = this.message.getHTML();
                        html.classList.remove("chatMessageError");
                        UI.Chat.sendMessage(this.message);
                    }
                };
                errorMessage.addTextLink("_CHATMESSAGENOTSENTRESEND_", true, click);
                if (html.parentNode !== null) {
                    html.parentNode.insertBefore(errorMessage.getElement(), html.nextSibling);
                    UI.Chat.updateScrollPosition(true);
                }
            }).bind(null, this);
            this.sending = setTimeout(timeoutFunction, 8000);
        }
    };
    Message.prototype.getSpecial = function (id, defaultValue) {
        if (this.special[id] !== undefined) {
            return this.special[id];
        }
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        return null;
    };
    Message.prototype.setSpecial = function (id, value) {
        this.special[id] = value;
    };
    Message.prototype.updateFromObject = function (obj) {
        for (var id in this) {
            if (obj[id] === undefined)
                continue;
            if (id === "localid")
                continue;
            this[id] = obj[id];
        }
        if (typeof this.special === "string") {
            this.special = JSON.parse(this.special);
        }
        this.triggerUpdated();
    };
    Message.prototype.exportAsLog = function () {
        var obj = this.exportAsObject();
        obj['roomid'] = 0;
        obj['id'] = this.id;
        obj['msg'] = obj['message'];
        delete (obj['message']);
        return obj;
    };
    Message.prototype.exportAsObject = function () {
        var result = {};
        var attributes = [
            'destination', 'module', 'origin', 'roomid', 'date', "clone", 'localid', 'special'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (this[attributes[i]] !== undefined) {
                result[attributes[i]] = this[attributes[i]];
            }
        }
        result["message"] = this.msg;
        return result;
    };
    Message.prototype.receiveCommand = function (slashCommand, msg) {
        this.msg = msg;
        return true;
    };
    Message.prototype.setMsg = function (str) {
        this.msg = str;
    };
    Message.prototype.getMsg = function () {
        if (this.msg === null) {
            return "";
        }
        return this.msg;
    };
    Message.prototype.unsetSpecial = function (id) {
        delete (this.special[id]);
    };
    Message.prototype.addUpdatedListener = function (list) {
        this.updatedTrigger.addListener(list);
    };
    Message.prototype.triggerUpdated = function () {
        this.updatedTrigger.trigger(this);
        if (this.sending !== null) {
            clearTimeout(this.sending);
            this.html.classList.remove("chatMessageSending");
            this.sending = null;
        }
        if (this.localid !== null) {
            DB.MessageDB.releaseLocalMessage(this.localid);
        }
    };
    Message.prototype.doNotPrint = function () {
        if (this.clone && this.destination !== null) {
            return true;
        }
        return false;
    };
    return Message;
}(SlashCommand));
var MessageSystem = (function (_super) {
    __extends(MessageSystem, _super);
    function MessageSystem() {
        _super.apply(this, arguments);
        this.module = "system";
    }
    MessageSystem.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageSystem");
        var b = document.createElement("b");
        b.appendChild(document.createTextNode("_CHATMESSAGEANNOUNCEMENT_"));
        UI.Language.markLanguage(b);
        p.appendChild(b);
        p.appendChild(document.createTextNode(": " + this.getMsg()));
        return p;
    };
    return MessageSystem;
}(Message));
MessageFactory.registerMessage(MessageSystem, "system", []);
var MessageCountdown = (function (_super) {
    __extends(MessageCountdown, _super);
    function MessageCountdown() {
        _super.call(this);
        this.counter = document.createTextNode("99999");
        this.module = "countdown";
        this.addUpdatedListener(function (e) {
            var target = e.getTarget();
            if (target !== null) {
                var msg = DB.MessageDB.getMessage(target);
                if (msg !== null) {
                    msg.updateCounter(e.getCounter());
                }
            }
            else {
                e.updateCounter(parseInt(e.getMsg()));
            }
        });
    }
    MessageCountdown.prototype.createHTML = function () {
        if (this.getMsg() === "") {
            return null;
        }
        var p = document.createElement("p");
        var counter = parseInt(this.getMsg());
        this.updateCounter(counter);
        var span = document.createElement("span");
        if (counter > 0) {
            span.classList.add("chatMessageCounterSpan");
            span.appendChild(this.counter);
            p.classList.add("chatMessageCounter");
        }
        else {
            span.classList.add("chatMessageCounterEndSpan");
            p.classList.add("chatMessageCounterEnd");
        }
        p.appendChild(span);
        return p;
    };
    MessageCountdown.prototype.receiveCommand = function (slash, msg) {
        if (MessageCountdown.timeout !== null) {
            clearTimeout(MessageCountdown.timeout);
            MessageCountdown.timeout = null;
            var message = new MessageCountdown();
            message.setTarget(MessageCountdown.lastTimeout.id);
            message.setMsg("0");
            message.setCounter(0);
            UI.Chat.sendMessage(message);
            MessageCountdown.lastTimeout = null;
        }
        var counter = parseInt(msg);
        if (isNaN(counter)) {
            return false;
        }
        this.setMsg(counter.toString());
        var func = function () {
            if (this.target.id === 0) {
                MessageCountdown.timeout = setTimeout(this['func'], 1000);
                return;
            }
            var msg;
            if (this.current > 0) {
                msg = new MessageCountdown();
                msg.setTarget(this.target.id);
                msg.setCounter(this.current--);
                MessageCountdown.timeout = setTimeout(this['func'], 1000);
            }
            else if (this.current <= 0) {
                msg = new MessageCountdown();
                msg.setTarget(this.target.id);
                msg.setCounter(this.current);
                msg.setMsg(this.current.toString());
                MessageCountdown.timeout = null;
                MessageCountdown.lastTimeout = null;
            }
            UI.Chat.sendMessage(msg);
        };
        var counterObj = {
            current: counter - 1,
            target: this
        };
        counterObj['func'] = func.bind(counterObj);
        MessageCountdown.lastTimeout = this;
        MessageCountdown.timeout = setTimeout(counterObj['func'], 1000);
        return true;
    };
    MessageCountdown.prototype.getTarget = function () {
        return this.getSpecial("target", null);
    };
    MessageCountdown.prototype.setTarget = function (id) {
        this.setSpecial("target", id);
    };
    MessageCountdown.prototype.setCounter = function (e) {
        this.setSpecial("counter", e);
    };
    MessageCountdown.prototype.getCounter = function () {
        return this.getSpecial("counter", 0);
    };
    MessageCountdown.prototype.updateCounter = function (e) {
        var curr = parseInt(this.counter.nodeValue);
        if (e < curr) {
            this.counter.nodeValue = e.toString();
        }
    };
    MessageCountdown.timeout = null;
    return MessageCountdown;
}(Message));
MessageFactory.registerMessage(MessageCountdown, "countdown", ["/countdown", "/count"]);
var MessageVote = (function (_super) {
    __extends(MessageVote, _super);
    function MessageVote() {
        _super.call(this);
        this.module = "vote";
        this.voters = [];
        this.voteAmountText = document.createTextNode("0");
        this.votersText = document.createTextNode("");
        this.addUpdatedListener({
            handleEvent: function (e) {
                if (e.getVoteTarget() !== null) {
                    var target = DB.MessageDB.getMessage(e.getVoteTarget());
                    if (target !== null && target instanceof MessageVote) {
                        target.addVote(e.getUser());
                    }
                }
            }
        });
    }
    MessageVote.prototype.setVoteTarget = function (id) {
        this.setSpecial("castvote", id);
    };
    MessageVote.prototype.getVoteTarget = function () {
        return this.getSpecial("castvote", null);
    };
    MessageVote.prototype.createHTML = function () {
        if (this.getVoteTarget() !== null) {
            return null;
        }
        var p = document.createElement("p");
        p.classList.add("chatMessageVote");
        var a = document.createElement("a");
        a.classList.add("chatMessageVoteAmount");
        a.appendChild(this.voteAmountText);
        p.appendChild(a);
        var reason = document.createElement("span");
        reason.classList.add("chatMessageVoteReason");
        reason.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        reason.appendChild(document.createTextNode("_CHATMESSAGEVOTECREATEDVOTE_"));
        reason.appendChild(document.createTextNode(": " + this.getMsg()));
        UI.Language.markLanguage(reason);
        p.appendChild(reason);
        var span = document.createElement("span");
        span.classList.add("chatMessageVoteVoters");
        span.appendChild(this.votersText);
        p.appendChild(span);
        var clickObj = {
            message: this,
            handleEvent: function () {
                var vote = new MessageVote();
                vote.setVoteTarget(this.message.id);
                UI.Chat.sendMessage(vote);
            }
        };
        a.addEventListener("click", clickObj);
        return p;
    };
    MessageVote.prototype.updateVoters = function () {
        this.voteAmountText.nodeValue = this.voters.length.toString();
        var voterNames = [];
        for (var i = 0; i < this.voters.length; i++) {
            voterNames.push(this.voters[i].getUniqueNickname());
        }
        if (this.voters.length > 0) {
            this.votersText.nodeValue = voterNames.join(", ") + ".";
        }
        else {
            this.votersText.nodeValue = "";
        }
    };
    MessageVote.prototype.addVote = function (user) {
        if (this.voters.indexOf(user) === -1) {
            this.voters.push(user);
            this.updateVoters();
        }
        else {
            this.removeVote(user);
        }
    };
    MessageVote.prototype.removeVote = function (user) {
        var index = this.voters.indexOf(user);
        if (index !== -1) {
            this.voters.splice(index, 1);
            this.updateVoters();
        }
    };
    return MessageVote;
}(Message));
MessageFactory.registerMessage(MessageVote, "vote", ["/vote", "/voto", "/votar", "/vota"]);
var MessageWebm = (function (_super) {
    __extends(MessageWebm, _super);
    function MessageWebm() {
        _super.apply(this, arguments);
        this.module = "webm";
    }
    MessageWebm.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDVIDEO_"));
        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        }
        else {
            p.appendChild(document.createTextNode(". "));
        }
        UI.Language.markLanguage(p);
        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGEPLAYVIDEO_"));
        a.appendChild(document.createTextNode("."));
        UI.Language.markLanguage(a);
        p.appendChild(a);
        return p;
    };
    MessageWebm.prototype.getName = function () {
        return this.getSpecial("name", null);
    };
    MessageWebm.prototype.setName = function (name) {
        this.setSpecial("name", name);
    };
    return MessageWebm;
}(Message));
MessageFactory.registerMessage(MessageWebm, "webm", ["/webm"]);
var MessageVideo = (function (_super) {
    __extends(MessageVideo, _super);
    function MessageVideo() {
        _super.apply(this, arguments);
        this.module = "youtube";
    }
    MessageVideo.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDVIDEO_"));
        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        }
        else {
            p.appendChild(document.createTextNode(". "));
        }
        UI.Language.markLanguage(p);
        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGEPLAYVIDEO_"));
        a.appendChild(document.createTextNode("."));
        UI.Language.markLanguage(a);
        p.appendChild(a);
        return p;
    };
    MessageVideo.prototype.getName = function () {
        return this.getSpecial("name", null);
    };
    MessageVideo.prototype.setName = function (name) {
        this.setSpecial("name", name);
    };
    return MessageVideo;
}(Message));
MessageFactory.registerMessage(MessageVideo, "youtube", ["/video", "/youtube"]);
var MessageSE = (function (_super) {
    __extends(MessageSE, _super);
    function MessageSE() {
        _super.apply(this, arguments);
        this.module = "seplay";
        this.playedBefore = false;
    }
    MessageSE.prototype.onPrint = function () {
        if (this.playedBefore) {
            return;
        }
        if (UI.Chat.doAutomation()) {
            var cfg = Application.Config.getConfig("autoSE").getValue();
            if (cfg === 0)
                return;
            if (this.getUser().isStoryteller() || cfg === 2) {
                UI.SoundController.playSE(this.getMsg());
                this.playedBefore = true;
            }
        }
    };
    MessageSE.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDSE_"));
        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        }
        else {
            p.appendChild(document.createTextNode(". "));
        }
        UI.Language.markLanguage(p);
        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGEPLAYSE_"));
        a.appendChild(document.createTextNode("."));
        a.addEventListener("click", {
            message: this,
            handleEvent: function (e) {
                UI.SoundController.playSE(this.message.getMsg());
            }
        });
        UI.Language.markLanguage(a);
        p.appendChild(a);
        return p;
    };
    MessageSE.prototype.getName = function () {
        return this.getSpecial("name", null);
    };
    MessageSE.prototype.setName = function (name) {
        this.setSpecial("name", name);
    };
    MessageSE.shareLink = function (name, url) {
        var msg = new MessageBGM();
        msg.findPersona();
        msg.setName(name);
        msg.setMsg(url);
        UI.Chat.sendMessage(msg);
    };
    return MessageSE;
}(Message));
MessageFactory.registerMessage(MessageSE, "seplay", ["/se", "/seplay", "/soundeffect", "/sound"]);
var MessageImage = (function (_super) {
    __extends(MessageImage, _super);
    function MessageImage() {
        _super.apply(this, arguments);
        this.module = "image";
        this.openedBefore = false;
    }
    MessageImage.addLastImage = function (msg) {
        if (MessageImage.lastImages[msg.roomid] === undefined) {
            MessageImage.lastImages[msg.roomid] = [msg];
        }
        else {
            var idx = MessageImage.lastImages[msg.roomid].indexOf(msg);
            if (idx === -1) {
                MessageImage.lastImages[msg.roomid].push(msg);
            }
            else {
                MessageImage.lastImages[msg.roomid].splice(idx, 1);
                MessageImage.lastImages[msg.roomid].push(msg);
            }
            if (MessageImage.lastImages[msg.roomid].length > MessageImage.maxHistory) {
                MessageImage.lastImages[msg.roomid].splice(0, 1);
            }
        }
    };
    MessageImage.getLastImages = function (roomid) {
        if (typeof MessageImage.lastImages[roomid] !== "undefined") {
            return MessageImage.lastImages[roomid];
        }
        else {
            return [];
        }
    };
    MessageImage.stopAutomation = function () {
        MessageImage.noAutomation = true;
    };
    MessageImage.resumeAutomation = function () {
        MessageImage.noAutomation = false;
    };
    MessageImage.prototype.onPrint = function () {
        if (this.openedBefore || MessageImage.noAutomation)
            return;
        if (UI.Chat.doAutomation()) {
            var cfg = Application.Config.getConfig("autoImage").getValue();
            if (cfg === 0)
                return;
            if (this.getUser().isStoryteller() || cfg === 2) {
                this.clickLink();
                this.openedBefore = true;
            }
        }
        MessageImage.addLastImage(this);
    };
    MessageImage.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDIMAGE_"));
        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        }
        else {
            p.appendChild(document.createTextNode(". "));
        }
        UI.Language.markLanguage(p);
        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGESEEIMAGE_"));
        a.appendChild(document.createTextNode("."));
        a.href = this.getMsg();
        a.addEventListener("click", {
            msg: this,
            handleEvent: function (e) {
                e.preventDefault();
                this.msg.clickLink();
            }
        });
        UI.Language.markLanguage(a);
        p.appendChild(a);
        return p;
    };
    MessageImage.prototype.clickLink = function () {
        UI.Pica.loadImage(this.getMsg());
    };
    MessageImage.prototype.getName = function () {
        return this.getSpecial("name", null);
    };
    MessageImage.prototype.setName = function (name) {
        this.setSpecial("name", name);
    };
    MessageImage.shareLink = function (name, url) {
        var newImage = new MessageImage();
        newImage.findPersona();
        newImage.setName(name);
        newImage.setMsg(url);
        UI.Chat.sendMessage(newImage);
    };
    MessageImage.prototype.receiveCommand = function (slashCommand, msg) {
        if (msg === "") {
            return false;
        }
        this.msg = msg;
        return true;
    };
    MessageImage.lastImages = {};
    MessageImage.maxHistory = 10;
    MessageImage.noAutomation = false;
    return MessageImage;
}(Message));
MessageFactory.registerMessage(MessageImage, "image", ["/image", "/imagem", "/picture", "/figura", "/pic"]);
var MessageBGM = (function (_super) {
    __extends(MessageBGM, _super);
    function MessageBGM() {
        _super.apply(this, arguments);
        this.module = "bgmplay";
        this.playedBefore = false;
    }
    MessageBGM.prototype.onPrint = function () {
        if (this.playedBefore) {
            return;
        }
        if (UI.Chat.doAutomation()) {
            var cfg = Application.Config.getConfig("autoBGM").getValue();
            if (cfg === 0)
                return;
            if (this.getUser().isStoryteller() || cfg === 2) {
                UI.SoundController.playBGM(this.getMsg());
                this.playedBefore = true;
            }
        }
    };
    MessageBGM.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageShare");
        p.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        p.appendChild(document.createTextNode("_CHATMESSAGESHAREDBGM_"));
        var name = this.getName();
        if (name !== null) {
            p.appendChild(document.createTextNode(": " + name + ". "));
        }
        else {
            p.appendChild(document.createTextNode(". "));
        }
        UI.Language.markLanguage(p);
        var a = document.createElement("a");
        a.classList.add("textLink");
        a.appendChild(document.createTextNode("_CHATMESSAGEPLAYBGM_"));
        a.appendChild(document.createTextNode("."));
        a.addEventListener("click", {
            message: this,
            handleEvent: function (e) {
                UI.SoundController.playBGM(this.message.getMsg());
            }
        });
        UI.Language.markLanguage(a);
        p.appendChild(a);
        return p;
    };
    MessageBGM.prototype.getName = function () {
        return this.getSpecial("name", null);
    };
    MessageBGM.prototype.setName = function (name) {
        this.setSpecial("name", name);
    };
    MessageBGM.shareLink = function (name, url) {
        var msg = new MessageBGM();
        msg.findPersona();
        msg.setName(name);
        msg.setMsg(url);
        UI.Chat.sendMessage(msg);
    };
    return MessageBGM;
}(Message));
MessageFactory.registerMessage(MessageBGM, "bgmplay", ["/bgm", "/splay", "/bgmplay", "/musica"]);
var MessageStream = (function (_super) {
    __extends(MessageStream, _super);
    function MessageStream() {
        _super.apply(this, arguments);
        this.module = "stream";
    }
    MessageStream.prototype.createHTML = function () {
        return null;
    };
    return MessageStream;
}(Message));
MessageFactory.registerMessage(MessageStream, "stream", []);
var MessageSheetcommand = (function (_super) {
    __extends(MessageSheetcommand, _super);
    function MessageSheetcommand() {
        _super.apply(this, arguments);
        this.module = "sheetcmd";
    }
    MessageSheetcommand.prototype.createHTML = function () {
        return null;
    };
    return MessageSheetcommand;
}(Message));
MessageFactory.registerMessage(MessageSheetcommand, "sheetcmd", []);
var MessageWhisper = (function (_super) {
    __extends(MessageWhisper, _super);
    function MessageWhisper() {
        _super.call(this);
        this.module = "whisper";
        var list = function (message) {
            if (!message.isMine()) {
                UI.Chat.Forms.setLastWhisperFrom(message.getUser());
            }
        };
        this.addUpdatedListener(list);
    }
    MessageWhisper.prototype.onPrint = function () {
        if (!this.isMine() && UI.Chat.doAutomation() && !document.hasFocus()) {
            UI.SoundController.playAlert();
        }
    };
    MessageWhisper.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatWhisper");
        var b = document.createElement("b");
        b.classList.add("chatWhisperLink");
        b.appendChild(document.createTextNode("( "));
        b.addEventListener("click", {
            destination: this.destination,
            msg: this,
            handleEvent: function () {
                if (!this.msg.isMine()) {
                    UI.Chat.Forms.setInput("/whisper " + this.msg.getUser().getUniqueNickname() + ", ");
                }
                else {
                    var destination = Array.isArray(this.destination) ? this.destination[0] : this.destination;
                    UI.Chat.Forms.setInput("/whisper " + DB.UserDB.getAUser(destination).getRoomContext(UI.Chat.getRoom().id).getUniqueNickname() + ", ");
                }
            }
        });
        if (Application.isMe(this.origin)) {
            b.appendChild(document.createTextNode("_CHATMESSAGEWHISPERTO_"));
            var destination = Array.isArray(this.destination) ? this.destination[0] : this.destination;
            b.appendChild(document.createTextNode(" " + DB.UserDB.getAUser(destination).getFullNickname() + " )"));
        }
        else {
            b.appendChild(document.createTextNode("_CHATMESSAGEWHISPERFROM_"));
            b.appendChild(document.createTextNode(" " + this.getUser().getUser().getFullNickname() + " )"));
        }
        p.appendChild(b);
        p.appendChild(document.createTextNode(": " + this.getMsg()));
        UI.Language.markLanguage(b);
        return p;
    };
    MessageWhisper.prototype.receiveCommand = function (slashCommand, msg) {
        var room = UI.Chat.getRoom();
        var index = msg.indexOf(',');
        var target = msg.substr(0, index).trim();
        var message = msg.substr(index + 1).trim();
        var users = room.getUsersByName(target);
        if (users.length === 1) {
            this.setMsg(message);
            this.addDestination(users[0].getUser());
            return true;
        }
        else {
            return false;
        }
    };
    MessageWhisper.prototype.getInvalidHTML = function (slashCommand, msg) {
        var room = UI.Chat.getRoom();
        var index = msg.indexOf(',');
        var target = msg.substr(0, index).trim();
        var message = msg.substr(index + 1).trim();
        var users = room.getUsersByName(target);
        var error = new ChatSystemMessage(true);
        if (users.length === 0) {
            error.addText("_CHATWHISPERNOTARGETSFOUND_");
            error.addLangVar("a", target);
        }
        else {
            var clickF = function () {
                UI.Chat.Forms.setInput("/whisper " + this.target + ", " + this.message);
            };
            error.addText("_CHATMULTIPLETARGETSFOUND_");
            error.addText(": ");
            for (var i = 0; i < users.length; i++) {
                var listener = {
                    target: users[i].getUniqueNickname(),
                    message: message,
                    handleEvent: clickF
                };
                error.addTextLink(users[i].getUniqueNickname(), false, listener);
                if ((i + 1) < users.length) {
                    error.addText(", ");
                }
                else {
                    error.addText(".");
                }
            }
        }
        return error.getElement();
    };
    return MessageWhisper;
}(Message));
MessageFactory.registerMessage(MessageWhisper, "whisper", ["/whisper", "/whisp", "/private", "/pm", "/privado", "/pessoal", "/w"]);
var MessageSheetdamage = (function (_super) {
    __extends(MessageSheetdamage, _super);
    function MessageSheetdamage() {
        _super.apply(this, arguments);
        this.module = "sheetdm";
    }
    MessageSheetdamage.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageSheetdamage");
        p.classList.add(this.getType());
        var a = document.createElement("a");
        a.classList.add("icons-chatDamage" + this.getType());
        a.classList.add("chatMessageDamageIcon");
        p.appendChild(a);
        p.appendChild(document.createTextNode(this.getSheetName() + ":"));
        var span = document.createElement("span");
        span.classList.add("chatMessageDamageBubble");
        span.classList.add(this.getType());
        span.appendChild(document.createTextNode(this.getAmount() + " " + this.getType()));
        p.appendChild(span);
        return p;
    };
    MessageSheetdamage.prototype.getType = function () {
        var type = this.getSpecial("type", "HP");
        if (type === "HP" || type === "MP" || type === "Exp") {
            return type;
        }
        return "HP";
    };
    MessageSheetdamage.prototype.setTypeHP = function () {
        this.setSpecial("type", "HP");
    };
    MessageSheetdamage.prototype.setTypeMP = function () {
        this.setSpecial("type", "MP");
    };
    MessageSheetdamage.prototype.setTypeExp = function () {
        this.setSpecial("type", "Exp");
    };
    MessageSheetdamage.prototype.setLog = function (log) {
        this.setSpecial("log", log);
    };
    MessageSheetdamage.prototype.getLog = function () {
        return this.getSpecial("log", null);
    };
    MessageSheetdamage.prototype.setSheetName = function (name) {
        this.msg = name;
    };
    MessageSheetdamage.prototype.getSheetName = function () {
        var old = this.getSpecial("sheetname", null);
        if (old === null) {
            old = this.msg;
        }
        return old;
    };
    MessageSheetdamage.prototype.setAmount = function (amount) {
        this.setSpecial("amount", amount);
    };
    MessageSheetdamage.prototype.getAmount = function () {
        var amount = this.getSpecial("amount", null);
        if (amount === null) {
            return "0?";
        }
        if (typeof amount === "string") {
            amount = parseInt(amount);
        }
        if (amount > 0) {
            return "+ " + amount.toString();
        }
        return "- " + (amount * -1).toString();
    };
    return MessageSheetdamage;
}(Message));
MessageFactory.registerMessage(MessageSheetdamage, "sheetdm", []);
var MessageSheetturn = (function (_super) {
    __extends(MessageSheetturn, _super);
    function MessageSheetturn() {
        _super.apply(this, arguments);
        this.module = "sheettr";
    }
    MessageSheetturn.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageTurn");
        var a = document.createElement("a");
        a.classList.add("icons-chatMessageTurn");
        a.classList.add("chatMessageTurnIcon");
        p.appendChild(a);
        p.appendChild(document.createTextNode(this.getSheetName() + ":"));
        return p;
    };
    MessageSheetturn.prototype.setSheetName = function (name) {
        this.msg = name;
    };
    MessageSheetturn.prototype.getSheetName = function () {
        var old = this.getSpecial("sheetname", null);
        if (old === null) {
            old = this.msg;
        }
        return old;
    };
    MessageSheetturn.prototype.setPlayer = function (id) {
        this.setSpecial("player", id);
    };
    MessageSheetturn.prototype.getPlayer = function () {
        return this.getSpecial('player', 0);
    };
    return MessageSheetturn;
}(Message));
MessageFactory.registerMessage(MessageSheetturn, "sheettr", []);
var MessageDice = (function (_super) {
    __extends(MessageDice, _super);
    function MessageDice() {
        _super.call(this);
        this.module = "dice";
        this.addUpdatedListener({
            handleEvent: function (e) {
                if (e.html !== null) {
                    var newHTML = e.createHTML();
                    if (e.html.parentNode !== null) {
                        e.html.parentNode.replaceChild(newHTML, e.html);
                    }
                    e.html = newHTML;
                }
            }
        });
    }
    MessageDice.prototype.findPersona = function () {
        var personaName = UI.Chat.PersonaManager.getPersonaName();
        this.setPersona(personaName === null ? "???" : personaName);
    };
    MessageDice.prototype.makeMockUp = function () {
        var messages = [this];
        this.addDice(2, 10);
        this.setSpecial("rolls", [5, 5]);
        this.msg = "Example Reason";
        messages.push(new MessageDice());
        messages.push(new MessageDice());
        messages[1].addDice(2, 10);
        messages[1].setSpecial("rolls", [1, 1]);
        messages[2].addDice(2, 10);
        messages[2].setSpecial("rolls", [10, 10]);
        return messages;
    };
    MessageDice.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageDice");
        if (this.getRolls().length === 0 && this.getDice().length !== 0) {
            p.appendChild(document.createTextNode("_CHATDICEROLLEDWAITING_"));
            UI.Language.markLanguage(p);
            return p;
        }
        var b = document.createElement("b");
        b.appendChild(document.createTextNode("* " + this.getSpecial("persona", "????") + " "));
        p.appendChild(b);
        if (this.isWhisper()) {
            if (this.getRolls().length > 0) {
                p.appendChild(document.createTextNode("_CHATDICESECRETROLLED_"));
            }
            else {
                p.appendChild(document.createTextNode("_CHATDICESECRETSHOWN_"));
            }
        }
        else {
            if (this.getRolls().length > 0) {
                p.appendChild(document.createTextNode("_CHATDICEROLLED_"));
            }
            else {
                p.appendChild(document.createTextNode("_CHATDICESHOWN_"));
            }
        }
        p.appendChild(document.createTextNode(" "));
        if (this.getRolls().length > 0) {
            var initialRoll = document.createElement("span");
            initialRoll.classList.add("chatMessageDiceBoxSquare");
            initialRoll.appendChild(document.createTextNode(this.getInitialRoll()));
            p.appendChild(initialRoll);
            p.appendChild(document.createTextNode(" = "));
            var rolls = this.getRolls();
            var faces = this.getDice();
            var allCrits = true;
            var allFailures = true;
            for (var i = 0; i < rolls.length; i++) {
                var span = document.createElement("span");
                span.classList.add("chatMessageDiceBoxRoll");
                if (rolls[i] === faces[i] && faces[i] > 1) {
                    span.classList.add("rainbow");
                    allFailures = false;
                }
                else if (rolls[i] === 1 && faces[i] > 1) {
                    span.classList.add("shame");
                    allCrits = false;
                }
                else {
                    allCrits = false;
                    allFailures = false;
                }
                span.appendChild(document.createTextNode(rolls[i].toString()));
                p.appendChild(span);
                if ((i + 1) < rolls.length) {
                    p.appendChild(document.createTextNode(" + "));
                }
            }
            if (allCrits) {
                initialRoll.classList.add("rainbow");
            }
            else if (allFailures) {
                initialRoll.classList.add("shame");
            }
            if (this.getMod() !== 0) {
                p.appendChild(document.createTextNode(" + "));
                var span = document.createElement("span");
                span.classList.add("chatMessageDiceBoxCircle");
                span.appendChild(document.createTextNode(this.getMod().toString()));
                p.appendChild(span);
                if (allCrits) {
                    span.classList.add("rainbow");
                }
                else if (allFailures) {
                    span.classList.add("shame");
                }
            }
            p.appendChild(document.createTextNode(" = "));
            var span = document.createElement("span");
            span.classList.add("chatMessageDiceBoxResult");
            span.appendChild(document.createTextNode(this.getResult().toString()));
            if (allCrits) {
                span.classList.add("rainbow");
                p.classList.add("rainbow");
            }
            else if (allFailures) {
                span.classList.add("shame");
                p.classList.add("shame");
            }
            p.appendChild(span);
        }
        else {
            var initialRoll = document.createElement("span");
            initialRoll.classList.add("chatMessageDiceBoxCircle");
            initialRoll.appendChild(document.createTextNode(this.getMod().toString()));
            p.appendChild(initialRoll);
        }
        if (this.getMsg() !== "") {
            var span = document.createElement("span");
            span.classList.add("chatMessageDiceReason");
            var b = document.createElement("b");
            b.appendChild(document.createTextNode("_CHATMESSAGEDICEREASON_"));
            b.appendChild(document.createTextNode(": "));
            UI.Language.markLanguage(b);
            span.appendChild(b);
            span.appendChild(document.createTextNode(this.getMsg()));
            p.appendChild(span);
        }
        UI.Language.markLanguage(p);
        return p;
    };
    MessageDice.prototype.getInitialRoll = function () {
        var dices = this.getDice();
        var cleanedDices = {};
        var mod = this.getMod();
        for (var i = 0; i < dices.length; i++) {
            if (cleanedDices[dices[i]] === undefined) {
                cleanedDices[dices[i]] = 1;
            }
            else {
                cleanedDices[dices[i]]++;
            }
        }
        var finalString = [];
        for (var faces in cleanedDices) {
            finalString.push(cleanedDices[faces] + "d" + faces);
        }
        var str = finalString.join(" + ");
        if (mod < 0) {
            str += " - " + (mod * -1);
        }
        else {
            str += " + " + mod;
        }
        return str;
    };
    MessageDice.prototype.getRolls = function () {
        return this.getSpecial("rolls", []);
    };
    MessageDice.prototype.getMod = function () {
        return this.getSpecial("mod", 0);
    };
    MessageDice.prototype.setMod = function (mod) {
        this.setSpecial("mod", mod);
    };
    MessageDice.prototype.getDice = function () {
        return this.getSpecial("dice", []);
    };
    MessageDice.prototype.setDice = function (dice) {
        this.setSpecial("dice", dice);
    };
    MessageDice.prototype.addMod = function (mod) {
        this.setSpecial("mod", mod);
    };
    MessageDice.prototype.addDice = function (amount, faces) {
        if (faces === 0) {
            return;
        }
        var dices = this.getDice();
        for (var i = 0; i < amount; i++) {
            dices.push(faces);
        }
        this.setDice(dices);
    };
    MessageDice.prototype.getResult = function () {
        var result = 0;
        result += this.getMod();
        result += this.getRolls().reduce(function (previousValue, currentValue) {
            return previousValue + currentValue;
        });
        return result;
    };
    return MessageDice;
}(Message));
MessageFactory.registerMessage(MessageDice, "dice", []);
var MessageStory = (function (_super) {
    __extends(MessageStory, _super);
    function MessageStory() {
        _super.apply(this, arguments);
        this.module = "story";
    }
    MessageStory.prototype.makeMockUp = function () {
        var list = [];
        list.push(this);
        this.msg = "Lorem [ipsum] dolor {sit amet}, *consectetur adipiscing elit*. (Maecenas pellentesque) lectus neque, ac suscipit metus facilisis vitae. Sed ut nisi non massa sagittis molestie non sed libero.";
        this.setSpecial("persona", "Undefined");
        var newMsg;
        var languages = ['Elvish', 'Binary', 'Magraki', 'Abyssal', 'Draconic', 'Aquon', 'Celestan', 'Technum', 'Arcana', 'Ancient', 'Natrum', 'Ellum', 'Animal', 'Auran', 'Davek', 'Arkadium'].sort();
        for (var i = 0; i < languages.length; i++) {
            newMsg = new MessageStory();
            newMsg.msg = "[" + languages[i] + "]: Nulla luctus quam sit [amet] ullamcorper {luctus}. *Integer* a nulla vitae (blandit tincidunt).";
            newMsg.setSpecial("language", languages[i]);
            list.push(newMsg);
        }
        return list;
    };
    MessageStory.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageStory");
        var container = p;
        var lang = this.getSpecial("language", "none");
        var thisMsg = "";
        var messageNodes = [];
        messageNodes.push(document.createTextNode("- "));
        var currentSpecial = null;
        var specialStarters = ["[", "{", "(", "*"];
        var specialEnders = ["]", "}", ")", "*"];
        var specialClasses = ["chatRoleplayImportant", "chatRoleplayItalic", "chatRoleplayThought", "chatRoleplayAction"];
        var specialInclusive = [true, false, true, true];
        var special;
        for (var i = 0; i < this.msg.length; i++) {
            special = -1;
            if (currentSpecial === null)
                special = specialStarters.indexOf(this.msg.charAt(i));
            else if (specialEnders.indexOf(this.msg.charAt(i)) === currentSpecial) {
                if (specialInclusive[currentSpecial]) {
                    thisMsg += this.msg.charAt(i);
                }
                var span = document.createElement("span");
                span.classList.add(specialClasses[currentSpecial]);
                span.appendChild(document.createTextNode(thisMsg));
                messageNodes.push(span);
                thisMsg = "";
                currentSpecial = null;
                continue;
            }
            if (special !== -1) {
                currentSpecial = special;
                if (lang !== "none") {
                    var ele = document.createElement("span");
                    ele.classList.add("chatRoleplayLang" + lang);
                    ele.appendChild(document.createTextNode(thisMsg));
                    messageNodes.push(ele);
                }
                else {
                    messageNodes.push(document.createTextNode(thisMsg));
                }
                thisMsg = "";
                if (specialInclusive[special])
                    thisMsg += this.msg.charAt(i);
                continue;
            }
            thisMsg += this.msg.charAt(i);
        }
        if (thisMsg !== "") {
            messageNodes.push(document.createTextNode(thisMsg));
        }
        for (var i = 0; i < messageNodes.length; i++) {
            container.appendChild(messageNodes[i]);
        }
        return p;
    };
    return MessageStory;
}(Message));
MessageFactory.registerMessage(MessageStory, "story", ["/story", "/history", "/historia", "/história", "/histo", "/sto"]);
var MessageAction = (function (_super) {
    __extends(MessageAction, _super);
    function MessageAction() {
        _super.apply(this, arguments);
        this.module = "action";
    }
    MessageAction.prototype.findPersona = function () {
        var personaName = UI.Chat.PersonaManager.getPersonaName();
        this.setPersona(personaName === null ? "???" : personaName);
    };
    MessageAction.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatAction");
        var b = document.createElement("b");
        b.appendChild(document.createTextNode("* " + this.getSpecial("persona", "???") + " "));
        p.appendChild(b);
        p.appendChild(document.createTextNode(this.msg));
        return p;
    };
    return MessageAction;
}(Message));
MessageFactory.registerMessage(MessageAction, "action", ["/act", "/me", "/eu", "/açao", "/ação", "/agir"]);
var MessageOff = (function (_super) {
    __extends(MessageOff, _super);
    function MessageOff() {
        _super.apply(this, arguments);
        this.module = "offgame";
    }
    MessageOff.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatOff");
        var b = document.createElement("b");
        b.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + ": "));
        p.appendChild(b);
        p.appendChild(document.createTextNode(this.msg));
        return p;
    };
    return MessageOff;
}(Message));
MessageFactory.registerMessage(MessageOff, "offgame", ["/off", "/ooc"]);
var MessageRoleplay = (function (_super) {
    __extends(MessageRoleplay, _super);
    function MessageRoleplay() {
        _super.call(this);
        this.module = "roleplay";
        this.addUpdatedListener({
            handleEvent: function (e) {
                var lingua = e.getSpecial("lingua", null);
                if (lingua !== null) {
                    e.setSpecial("language", lingua);
                    e.unsetSpecial("lingua");
                }
            }
        });
    }
    MessageRoleplay.prototype.findPersona = function () {
        var personaName = UI.Chat.PersonaManager.getPersonaName();
        this.setPersona(personaName === null ? "???" : personaName);
    };
    MessageRoleplay.prototype.makeMockUp = function () {
        var list = [];
        list.push(this);
        this.msg = "Lorem [ipsum] dolor {sit amet}, *consectetur adipiscing elit*. (Maecenas pellentesque) lectus neque, ac suscipit metus facilisis vitae. Sed ut nisi non massa sagittis molestie non sed libero.";
        this.setSpecial("persona", "Undefined");
        var newMsg = new MessageRoleplay();
        newMsg.msg = "Nulla luctus quam sit amet ullamcorper luctus. Integer a nulla vitae nibh blandit tincidunt id nec tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus.";
        newMsg.setSpecial("persona", "Cabamamimo");
        list.push(newMsg);
        var languages = ['Elvish', 'Binary', 'Magraki', 'Abyssal', 'Draconic', 'Aquon', 'Celestan', 'Technum', 'Arcana', 'Ancient', 'Natrum', 'Ellum', 'Animal', 'Auran', 'Davek', 'Arkadium'].sort();
        for (var i = 0; i < languages.length; i++) {
            newMsg = new MessageRoleplay();
            newMsg.msg = "[" + languages[i] + "]: Nulla luctus quam sit [amet] ullamcorper {luctus}. *Integer* a nulla vitae (blandit tincidunt).";
            newMsg.setSpecial("persona", "Línguoso");
            newMsg.setSpecial("language", languages[i]);
            list.push(newMsg);
        }
        return list;
    };
    MessageRoleplay.prototype.createHTML = function () {
        if (this.isIgnored())
            return null;
        var p = document.createElement("p");
        p.classList.add("chatMessageParagraph");
        var container = p;
        var b = document.createElement("b");
        b.appendChild(document.createTextNode(this.getSpecial("persona", "????") + ": "));
        p.appendChild(b);
        var lang = this.getLanguage();
        var thisMsg = "";
        var messageNodes = [];
        var currentSpecial = null;
        var specialStarters = ["[", "{", "(", "*"];
        var specialEnders = ["]", "}", ")", "*"];
        var specialClasses = ["chatRoleplayImportant", "chatRoleplayItalic", "chatRoleplayThought", "chatRoleplayAction"];
        var specialInclusive = [true, false, true, true];
        var special;
        for (var i = 0; i < this.msg.length; i++) {
            special = -1;
            if (currentSpecial === null)
                special = specialStarters.indexOf(this.msg.charAt(i));
            else if (specialEnders.indexOf(this.msg.charAt(i)) === currentSpecial) {
                if (specialInclusive[currentSpecial]) {
                    thisMsg += this.msg.charAt(i);
                }
                var span = document.createElement("span");
                span.classList.add(specialClasses[currentSpecial]);
                span.appendChild(document.createTextNode(thisMsg));
                messageNodes.push(span);
                thisMsg = "";
                currentSpecial = null;
                continue;
            }
            if (special !== -1) {
                currentSpecial = special;
                if (lang !== "none" && !$.browser.mobile) {
                    var ele = document.createElement("span");
                    ele.classList.add("chatRoleplayLang" + lang);
                    ele.appendChild(document.createTextNode(thisMsg));
                    messageNodes.push(ele);
                }
                else {
                    messageNodes.push(document.createTextNode(thisMsg));
                }
                thisMsg = "";
                if (specialInclusive[special])
                    thisMsg += this.msg.charAt(i);
                continue;
            }
            thisMsg += this.msg.charAt(i);
        }
        if (thisMsg !== "") {
            if (lang === "none" || $.browser.mobile) {
                messageNodes.push(document.createTextNode(thisMsg));
            }
            else {
                var ele = document.createElement("span");
                ele.classList.add("chatRoleplayLang" + lang);
                ele.appendChild(document.createTextNode(thisMsg));
                messageNodes.push(ele);
            }
        }
        for (var i = 0; i < messageNodes.length; i++) {
            container.appendChild(messageNodes[i]);
        }
        var translation = this.getTranslation();
        if (translation !== null) {
            var span = document.createElement("span");
            span.classList.add("chatRoleplayTranslation");
            var b = document.createElement("b");
            b.appendChild(document.createTextNode("_CHATMESSAGEROLEPLAYTRANSLATION_"));
            b.appendChild(document.createTextNode(": "));
            UI.Language.markLanguage(b);
            span.appendChild(b);
            span.appendChild(document.createTextNode(translation));
            p.appendChild(span);
        }
        return p;
    };
    MessageRoleplay.prototype.isIgnored = function () {
        if (!Application.Login.isLogged())
            return false;
        var ignored = this.getSpecial("ignoreFor", []);
        return ignored.indexOf(Application.Login.getUser().id) !== -1;
    };
    MessageRoleplay.prototype.getLanguage = function () {
        var oldLingua = this.getSpecial("lingua", null);
        if (oldLingua !== null)
            return oldLingua;
        var language = this.getSpecial("language", "none");
        return language;
    };
    MessageRoleplay.prototype.setLanguage = function (lang) {
        this.setSpecial("language", lang);
    };
    MessageRoleplay.prototype.setTranslation = function (message) {
        this.setSpecial("translation", message);
    };
    MessageRoleplay.prototype.getTranslation = function () {
        return this.getSpecial('translation', null);
    };
    return MessageRoleplay;
}(Message));
MessageFactory.registerMessage(MessageRoleplay, "roleplay", []);
var MessageUnknown = (function (_super) {
    __extends(MessageUnknown, _super);
    function MessageUnknown() {
        _super.apply(this, arguments);
        this.module = "unkn";
    }
    MessageUnknown.prototype.createHTML = function () {
        var p = document.createElement("p");
        p.classList.add("chatMessageNotification");
        p.appendChild(document.createTextNode("_CHATMESSAGEUNKNOWNTYPE_"));
        UI.Language.addLanguageVariable(p, "a", this.module);
        UI.Language.addLanguageVariable(p, "b", this.getUser().getUser().getFullNickname());
        UI.Language.markLanguage(p);
        return p;
    };
    return MessageUnknown;
}(Message));
MessageFactory.registerMessage(MessageUnknown, "unkn", []);
var DB;
(function (DB) {
    var UserDB;
    (function (UserDB) {
        var users = {};
        function hasUser(id) {
            return users[id] !== undefined;
        }
        UserDB.hasUser = hasUser;
        function getUser(id) {
            if (hasUser(id)) {
                return users[id];
            }
            return null;
        }
        UserDB.getUser = getUser;
        function getAUser(id) {
            if (hasUser(id))
                return users[id];
            return new User();
        }
        UserDB.getAUser = getAUser;
        function updateFromObject(obj) {
            for (var i = 0; i < obj.length; i++) {
                if (users[obj[i]['id']] === undefined) {
                    users[obj[i]['id']] = new User();
                }
                users[obj[i]['id']].updateFromObject(obj[i]);
            }
        }
        UserDB.updateFromObject = updateFromObject;
    })(UserDB = DB.UserDB || (DB.UserDB = {}));
})(DB || (DB = {}));
var DB;
(function (DB) {
    var GameDB;
    (function (GameDB) {
        var games = {};
        function hasGame(id) {
            return games[id] !== undefined;
        }
        GameDB.hasGame = hasGame;
        function getGame(id) {
            if (hasGame(id)) {
                return games[id];
            }
            return null;
        }
        GameDB.getGame = getGame;
        function getOrderedGameList() {
            var list = [];
            for (var id in games) {
                list.push(games[id]);
            }
            list.sort(function (a, b) {
                var na = a.name.toLowerCase();
                var nb = b.name.toLowerCase();
                if (na < nb)
                    return -1;
                if (nb < na)
                    return 1;
                return 0;
            });
            return list;
        }
        GameDB.getOrderedGameList = getOrderedGameList;
        function updateFromObject(obj, cleanup) {
            var cleanedup = {};
            for (var i = 0; i < obj.length; i++) {
                if (games[obj[i]['id']] === undefined) {
                    games[obj[i]['id']] = new Game();
                }
                games[obj[i]['id']].updateFromObject(obj[i], cleanup);
                cleanedup[obj[i]['id']] = games[obj[i]['id']];
            }
            if (cleanup) {
                games = cleanedup;
            }
        }
        GameDB.updateFromObject = updateFromObject;
    })(GameDB = DB.GameDB || (DB.GameDB = {}));
})(DB || (DB = {}));
var DB;
(function (DB) {
    var RoomDB;
    (function (RoomDB) {
        RoomDB.rooms = {};
        function hasRoom(id) {
            return RoomDB.rooms[id] !== undefined;
        }
        RoomDB.hasRoom = hasRoom;
        function getRoom(id) {
            if (hasRoom(id)) {
                return RoomDB.rooms[id];
            }
            return null;
        }
        RoomDB.getRoom = getRoom;
        function releaseRoom(id) {
            if (hasRoom(id)) {
                delete (this.rooms[id]);
                return true;
            }
            return false;
        }
        RoomDB.releaseRoom = releaseRoom;
        function updateFromObject(obj, cleanup) {
            for (var i = 0; i < obj.length; i++) {
                var room = obj[i];
                if (RoomDB.rooms[room['id']] === undefined) {
                    RoomDB.rooms[room['id']] = new Room();
                }
                RoomDB.rooms[room['id']].updateFromObject(room, cleanup);
            }
        }
        RoomDB.updateFromObject = updateFromObject;
    })(RoomDB = DB.RoomDB || (DB.RoomDB = {}));
})(DB || (DB = {}));
var DB;
(function (DB) {
    var MessageDB;
    (function (MessageDB) {
        MessageDB.messageById = {};
        var messageByLocalId = {};
        var lastLocal = 0;
        function releaseMessage(id) {
            if (hasMessage(id)) {
                delete (MessageDB.messageById[id]);
                return true;
            }
            return false;
        }
        MessageDB.releaseMessage = releaseMessage;
        function releaseLocalMessage(id) {
            if (hasLocalMessage(id)) {
                messageByLocalId[id].localid = null;
                delete (messageByLocalId[id]);
                return true;
            }
            return false;
        }
        MessageDB.releaseLocalMessage = releaseLocalMessage;
        function releaseAllLocalMessages() {
            for (var id in messageByLocalId) {
                releaseLocalMessage(id);
            }
        }
        MessageDB.releaseAllLocalMessages = releaseAllLocalMessages;
        function hasMessage(id) {
            return MessageDB.messageById[id] !== undefined;
        }
        MessageDB.hasMessage = hasMessage;
        function hasLocalMessage(id) {
            return messageByLocalId[id] !== undefined;
        }
        MessageDB.hasLocalMessage = hasLocalMessage;
        function getMessage(id) {
            if (hasMessage(id))
                return MessageDB.messageById[id];
            return null;
        }
        MessageDB.getMessage = getMessage;
        function getLocalMessage(id) {
            if (hasLocalMessage(id))
                return messageByLocalId[id];
            return null;
        }
        MessageDB.getLocalMessage = getLocalMessage;
        function registerLocally(msg) {
            msg.localid = lastLocal++;
            messageByLocalId[msg.localid] = msg;
        }
        MessageDB.registerLocally = registerLocally;
        function updateFromObject(obj) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i]['localid'] !== undefined && hasLocalMessage(obj[i]['localid'])) {
                    MessageDB.messageById[obj[i]['id']] = getLocalMessage(obj[i]['localid']);
                }
                else if (!hasMessage(obj[i]['id'])) {
                    MessageDB.messageById[obj[i]['id']] = MessageFactory.createMessageFromType(obj[i]['module']);
                }
                MessageDB.messageById[obj[i]['id']].updateFromObject(obj[i]);
            }
        }
        MessageDB.updateFromObject = updateFromObject;
    })(MessageDB = DB.MessageDB || (DB.MessageDB = {}));
})(DB || (DB = {}));
var DB;
(function (DB) {
    var SheetDB;
    (function (SheetDB) {
        SheetDB.sheets = {};
        var changeTrigger = new Trigger();
        function addChangeListener(list) {
            changeTrigger.addListener(list);
        }
        SheetDB.addChangeListener = addChangeListener;
        function removeChangeListener(list) {
            changeTrigger.removeListener(list);
        }
        SheetDB.removeChangeListener = removeChangeListener;
        function triggerChanged(sheet) {
            changeTrigger.trigger(sheet);
        }
        SheetDB.triggerChanged = triggerChanged;
        function hasSheet(id) {
            return SheetDB.sheets[id] !== undefined;
        }
        SheetDB.hasSheet = hasSheet;
        function getSheet(id) {
            if (hasSheet(id)) {
                return SheetDB.sheets[id];
            }
            return null;
        }
        SheetDB.getSheet = getSheet;
        function releaseSheet(id) {
            if (hasSheet(id)) {
                delete (SheetDB.sheets[id]);
            }
        }
        SheetDB.releaseSheet = releaseSheet;
        function updateFromObject(obj) {
            for (var i = 0; i < obj.length; i++) {
                if (SheetDB.sheets[obj[i]['id']] === undefined) {
                    SheetDB.sheets[obj[i]['id']] = new SheetInstance();
                }
                SheetDB.sheets[obj[i]['id']].updateFromObject(obj[i]);
            }
            triggerChanged(null);
        }
        SheetDB.updateFromObject = updateFromObject;
        function getSheetsByGame(game) {
            var wanted = [];
            for (var id in SheetDB.sheets) {
                if (SheetDB.sheets[id].getGameid() === game.getId()) {
                    wanted.push(SheetDB.sheets[id]);
                }
            }
            return wanted;
        }
        SheetDB.getSheetsByGame = getSheetsByGame;
        function getSheetsByFolder(sheets) {
            var folders = {};
            var result = [];
            for (var i = 0; i < sheets.length; i++) {
                if (folders[sheets[i].getFolder()] === undefined) {
                    folders[sheets[i].getFolder()] = [sheets[i]];
                    result.push(folders[sheets[i].getFolder()]);
                }
                else {
                    folders[sheets[i].getFolder()].push(sheets[i]);
                }
            }
            result.sort(function (a, b) {
                if (a[0].getFolder() < b[0].getFolder())
                    return -1;
                if (a[0].getFolder() > b[0].getFolder())
                    return 1;
                return 0;
            });
            for (var i = 0; i < result.length; i++) {
                result[i].sort(function (a, b) {
                    if (a.getName() < b.getName())
                        return -1;
                    if (a.getName() > b.getName())
                        return 1;
                    return 0;
                });
            }
            return result;
        }
        SheetDB.getSheetsByFolder = getSheetsByFolder;
    })(SheetDB = DB.SheetDB || (DB.SheetDB = {}));
})(DB || (DB = {}));
var DB;
(function (DB) {
    var ImageDB;
    (function (ImageDB) {
        var images = [];
        var changeTrigger = new Trigger();
        var delayedStore = null;
        var delayedStoreTimeout = 3000;
        function removeImage(img) {
            var idx = images.indexOf(img);
            if (idx === -1) {
                console.warn("[ImageDB] Attempt to remove unregistered image. Ignoring. Offender: ", img);
                return;
            }
            images.splice(idx, 1);
            considerSaving();
        }
        ImageDB.removeImage = removeImage;
        function considerSaving() {
            if (delayedStore !== null) {
                clearTimeout(delayedStore);
            }
            delayedStore = setTimeout(function () { Server.Storage.sendImages(); }, delayedStoreTimeout);
        }
        ImageDB.considerSaving = considerSaving;
        function getImages() {
            return images;
        }
        ImageDB.getImages = getImages;
        function getImageByName(name) {
            name = name.toLowerCase();
            for (var i = 0; i < images.length; i++) {
                if (images[i].getName().toLowerCase() === name) {
                    return images[i];
                }
            }
            return null;
        }
        ImageDB.getImageByName = getImageByName;
        function getImageByLink(url) {
            for (var i = 0; i < images.length; i++) {
                if (images[i].getLink() === url) {
                    return images[i];
                }
            }
            return null;
        }
        ImageDB.getImageByLink = getImageByLink;
        function hasImageByName(name) {
            return (getImageByName(name) !== null);
        }
        ImageDB.hasImageByName = hasImageByName;
        function hasImageByLink(url) {
            return (getImageByLink(url) !== null);
        }
        ImageDB.hasImageByLink = hasImageByLink;
        function getImagesByFolder() {
            var folders = {};
            var result = [];
            for (var i = 0; i < images.length; i++) {
                if (folders[images[i].getFolder()] === undefined) {
                    folders[images[i].getFolder()] = [images[i]];
                    result.push(folders[images[i].getFolder()]);
                }
                else {
                    folders[images[i].getFolder()].push(images[i]);
                }
            }
            result.sort(function (a, b) {
                if (a[0].getFolder() < b[0].getFolder())
                    return -1;
                if (a[0].getFolder() > b[0].getFolder())
                    return 1;
                return 0;
            });
            for (var i = 0; i < result.length; i++) {
                result[i].sort(function (a, b) {
                    if (a.getName() < b.getName())
                        return -1;
                    if (a.getName() > b.getName())
                        return 1;
                    return 0;
                });
            }
            return result;
        }
        ImageDB.getImagesByFolder = getImagesByFolder;
        function exportAsObject() {
            var arr = [];
            for (var i = 0; i < images.length; i++) {
                arr.push(images[i].exportAsObject());
            }
            return arr;
        }
        ImageDB.exportAsObject = exportAsObject;
        function updateFromObject(obj) {
            images = [];
            var line;
            for (var i = 0; i < obj.length; i++) {
                line = obj[i];
                images.push(new ImageLink(line['name'], line['url'], line['folder']));
            }
            images.sort(function (a, b) {
                if (a.getFolder() < b.getFolder())
                    return -1;
                if (a.getFolder() > b.getFolder())
                    return 1;
                var na = a.getName().toLowerCase();
                var nb = b.getName().toLowerCase();
                if (na < nb)
                    return -1;
                if (na > nb)
                    return 1;
                if (a.getLink() < b.getLink())
                    return -1;
                if (a.getLink() > b.getLink())
                    return 1;
                return 0;
            });
            changeTrigger.trigger(images);
        }
        ImageDB.updateFromObject = updateFromObject;
        function addImage(img) {
            images.push(img);
            considerSaving();
        }
        ImageDB.addImage = addImage;
        function addImages(imgs) {
            for (var i = 0; i < imgs.length; i++) {
                images.push(imgs[i]);
            }
            changeTrigger.trigger(images);
            Server.Storage.sendImages();
        }
        ImageDB.addImages = addImages;
        function triggerChange(image) {
            if (image === null) {
                changeTrigger.trigger(images);
            }
            else {
                changeTrigger.trigger(image);
            }
        }
        ImageDB.triggerChange = triggerChange;
        function addChangeListener(f) {
            changeTrigger.addListener(f);
        }
        ImageDB.addChangeListener = addChangeListener;
        function removeChangeListener(f) {
            changeTrigger.removeListener(f);
        }
        ImageDB.removeChangeListener = removeChangeListener;
    })(ImageDB = DB.ImageDB || (DB.ImageDB = {}));
})(DB || (DB = {}));
var DB;
(function (DB) {
    var SoundDB;
    (function (SoundDB) {
        var sounds = [];
        var changeTrigger = new Trigger();
        var delayedStore = null;
        var delayedStoreTimeout = 3000;
        function removeSound(snd) {
            var idx = sounds.indexOf(snd);
            if (idx === -1) {
                console.warn("[SoundDB] Attempt to remove unregistered sound. Ignoring. Offender: ", snd);
                return;
            }
            sounds.splice(idx, 1);
            considerSaving();
        }
        SoundDB.removeSound = removeSound;
        function considerSaving() {
            if (delayedStore !== null) {
                clearTimeout(delayedStore);
            }
            delayedStore = setTimeout(function () { Server.Storage.sendSounds(); }, delayedStoreTimeout);
        }
        SoundDB.considerSaving = considerSaving;
        function getSounds() {
            return sounds;
        }
        SoundDB.getSounds = getSounds;
        function getSoundByName(name) {
            name = name.toLowerCase();
            for (var i = 0; i < sounds.length; i++) {
                if (sounds[i].getName().toLowerCase() === name) {
                    return sounds[i];
                }
            }
            return null;
        }
        SoundDB.getSoundByName = getSoundByName;
        function getSoundByLink(url) {
            for (var i = 0; i < sounds.length; i++) {
                if (sounds[i].getLink() === url) {
                    return sounds[i];
                }
            }
            return null;
        }
        SoundDB.getSoundByLink = getSoundByLink;
        function hasSoundByName(name) {
            return (getSoundByName(name) !== null);
        }
        SoundDB.hasSoundByName = hasSoundByName;
        function hasSoundByLink(url) {
            return (getSoundByLink(url) !== null);
        }
        SoundDB.hasSoundByLink = hasSoundByLink;
        function getSoundsByFolder() {
            var folders = {};
            var result = [];
            for (var i = 0; i < sounds.length; i++) {
                if (folders[sounds[i].getFolder()] === undefined) {
                    folders[sounds[i].getFolder()] = [sounds[i]];
                    result.push(folders[sounds[i].getFolder()]);
                }
                else {
                    folders[sounds[i].getFolder()].push(sounds[i]);
                }
            }
            result.sort(function (a, b) {
                if (a[0].getFolder() < b[0].getFolder())
                    return -1;
                if (a[0].getFolder() > b[0].getFolder())
                    return 1;
                return 0;
            });
            for (var i = 0; i < result.length; i++) {
                result[i].sort(function (a, b) {
                    if (a.getName() < b.getName())
                        return -1;
                    if (a.getName() > b.getName())
                        return 1;
                    return 0;
                });
            }
            return result;
        }
        SoundDB.getSoundsByFolder = getSoundsByFolder;
        function exportAsObject() {
            var arr = [];
            for (var i = 0; i < sounds.length; i++) {
                arr.push(sounds[i].exportAsObject());
            }
            return arr;
        }
        SoundDB.exportAsObject = exportAsObject;
        function updateFromObject(obj) {
            sounds = [];
            var line;
            if (obj.length > 0 && typeof obj[0]["url"] === "undefined") {
                console.log("Old version");
                var rest = [];
                for (var i = 0; i < obj.length; i++) {
                    var folder = obj[i];
                    var folderName = folder['name'];
                    for (var k = 0; k < folder['sounds'].length; k++) {
                        var row = folder['sounds'][k];
                        rest.push({
                            bgm: row['bgm'],
                            name: row['name'],
                            url: row['link'],
                            folder: folderName
                        });
                    }
                }
                obj = rest;
            }
            for (var i = 0; i < obj.length; i++) {
                line = obj[i];
                sounds.push(new SoundLink(line['name'], line['url'], line['folder'], line['bgm']));
            }
            sounds.sort(function (a, b) {
                if (a.getFolder() < b.getFolder())
                    return -1;
                if (a.getFolder() > b.getFolder())
                    return 1;
                var na = a.getName().toLowerCase();
                var nb = b.getName().toLowerCase();
                if (na < nb)
                    return -1;
                if (na > nb)
                    return 1;
                if (a.getLink() < b.getLink())
                    return -1;
                if (a.getLink() > b.getLink())
                    return 1;
                return 0;
            });
            changeTrigger.trigger(sounds);
        }
        SoundDB.updateFromObject = updateFromObject;
        function addSound(snd) {
            sounds.push(snd);
            considerSaving();
        }
        SoundDB.addSound = addSound;
        function addSounds(snds) {
            for (var i = 0; i < snds.length; i++) {
                sounds.push(snds[i]);
            }
            changeTrigger.trigger(sounds);
            Server.Storage.sendSounds();
        }
        SoundDB.addSounds = addSounds;
        function triggerChange(image) {
            if (image === null) {
                changeTrigger.trigger(sounds);
            }
            else {
                changeTrigger.trigger(image);
            }
        }
        SoundDB.triggerChange = triggerChange;
        function addChangeListener(f) {
            changeTrigger.addListener(f);
        }
        SoundDB.addChangeListener = addChangeListener;
        function removeChangeListener(f) {
            changeTrigger.removeListener(f);
        }
        SoundDB.removeChangeListener = removeChangeListener;
    })(SoundDB = DB.SoundDB || (DB.SoundDB = {}));
})(DB || (DB = {}));
var Application;
(function (Application) {
    function getMe() {
        return Application.Login.getUser();
    }
    Application.getMe = getMe;
    function isMe(id) {
        if (!Application.Login.isLogged())
            return false;
        return Application.Login.getUser().id === id;
    }
    Application.isMe = isMe;
    function getMyId() {
        if (getMe() !== null) {
            return getMe().id;
        }
        return 0;
    }
    Application.getMyId = getMyId;
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Config;
    (function (Config) {
        var configList = {};
        function getConfig(id) {
            return configList[id];
        }
        Config.getConfig = getConfig;
        function registerChangeListener(id, listener) {
            if (configList[id] === undefined) {
                console.warn("[CONFIG] Attempt to register a listener to unregistered configuration at " + id + ". Offending listener:", listener);
                return;
            }
            configList[id].addChangeListener(listener);
        }
        Config.registerChangeListener = registerChangeListener;
        function registerConfiguration(id, config) {
            if (configList[id] !== undefined) {
                console.warn("[CONFIG] Attempt to overwrite registered Configuration at " + id + ". Offending configuration:", config);
                return;
            }
            configList[id] = config;
        }
        Config.registerConfiguration = registerConfiguration;
        function exportAsObject() {
            var result = {};
            for (var key in configList) {
                result[key] = configList[key].getValue();
            }
            return result;
        }
        Config.exportAsObject = exportAsObject;
        function reset() {
            for (var key in configList) {
                configList[key].reset();
            }
        }
        Config.reset = reset;
        function updateFromObject(obj) {
            for (var key in obj) {
                if (configList[key] === undefined) {
                    console.warn("[CONFIG] Unregistered configuration at " + key + ". It will be discarded. Value: ", obj[key]);
                    continue;
                }
                configList[key].storeValue(obj[key]);
            }
            console.debug("[CONFIG] Updated configuration values from:", obj);
        }
        Config.updateFromObject = updateFromObject;
        function saveConfig(cbs, cbe) {
            Server.Config.saveConfig(exportAsObject(), cbs, cbe);
        }
        Config.saveConfig = saveConfig;
    })(Config = Application.Config || (Application.Config = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var LocalMemory;
    (function (LocalMemory) {
        function getMemoryName(id) {
            return "redpg_" + Application.Login.getUser().id + "_" + id;
        }
        function getMemory(id, defaultValue) {
            if (Application.Login.isLogged()) {
                var value = localStorage.getItem(getMemoryName(id));
                if (value !== null) {
                    return JSON.parse(value);
                }
            }
            return defaultValue;
        }
        LocalMemory.getMemory = getMemory;
        function setMemory(id, value) {
            if (Application.Login.isLogged()) {
                localStorage.setItem(getMemoryName(id), JSON.stringify(value));
            }
        }
        LocalMemory.setMemory = setMemory;
        function unsetMemory(id) {
            if (Application.Login.isLogged()) {
                localStorage.removeItem(getMemoryName(id));
            }
        }
        LocalMemory.unsetMemory = unsetMemory;
    })(LocalMemory = Application.LocalMemory || (Application.LocalMemory = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Login;
    (function (Login) {
        var currentUser = null;
        var currentSession = null;
        var lastEmail = null;
        var lastUpdate = null;
        var sessionLife = 30 * 60 * 1000;
        var keepAliveTime = 2 * 60 * 1000;
        var interval = null;
        var trigger = new Trigger();
        var LAST_LOGIN_STORAGE = "redpg_lastLogin";
        var LAST_SESSION_STORAGE = "redpg_lastSession";
        var LAST_SESSION_TIME_STORAGE = "redpg_lastSessionTime";
        function searchLogin() {
            if (localStorage.getItem(LAST_LOGIN_STORAGE) !== null) {
                lastEmail = localStorage.getItem(LAST_LOGIN_STORAGE);
            }
            else {
                lastEmail = null;
            }
            if (localStorage.getItem(LAST_SESSION_STORAGE) !== null) {
                var currentTime = new Date().getTime();
                var lastTime = parseInt(localStorage.getItem(LAST_SESSION_TIME_STORAGE));
                if ((currentTime - lastTime) <= sessionLife) {
                    currentSession = localStorage.getItem(LAST_SESSION_STORAGE);
                    lastUpdate = lastTime.toString();
                }
            }
        }
        Login.searchLogin = searchLogin;
        function hasLastEmail() {
            return lastEmail !== null;
        }
        Login.hasLastEmail = hasLastEmail;
        function getLastEmail() {
            return lastEmail;
        }
        Login.getLastEmail = getLastEmail;
        function isLogged() {
            return currentUser !== null;
        }
        Login.isLogged = isLogged;
        function hasSession() {
            return currentSession !== null;
        }
        Login.hasSession = hasSession;
        function getSession() {
            return currentSession;
        }
        Login.getSession = getSession;
        function logout() {
            var oldLogged = isLogged();
            currentSession = null;
            currentUser = null;
            if (interval !== null)
                window.clearInterval(interval);
            interval = null;
            localStorage.removeItem(LAST_SESSION_STORAGE);
            localStorage.removeItem(LAST_SESSION_TIME_STORAGE);
            if (oldLogged !== isLogged()) {
                triggerListeners();
            }
        }
        Login.logout = logout;
        function attemptLogin(email, password, cbs, cbe) {
            lastEmail = email;
            updateLocalStorage();
            Server.Login.doLogin(email, password, cbs, cbe);
        }
        Login.attemptLogin = attemptLogin;
        function receiveLogin(userJson, sessionid) {
            var oldLogged = isLogged();
            var oldUser = currentUser;
            currentSession = sessionid;
            DB.UserDB.updateFromObject([userJson]);
            currentUser = DB.UserDB.getUser(userJson['id']);
            updateSessionLife();
            if (interval !== null)
                window.clearInterval(interval);
            interval = window.setInterval(function () {
                Application.Login.keepAlive();
            }, keepAliveTime);
            if (!oldLogged || oldUser.id !== currentUser.id) {
                triggerListeners();
            }
        }
        Login.receiveLogin = receiveLogin;
        function updateSessionLife() {
            lastUpdate = new Date().getTime().toString();
            updateLocalStorage();
        }
        Login.updateSessionLife = updateSessionLife;
        function updateLocalStorage() {
            if (lastEmail !== null) {
                localStorage.setItem(LAST_LOGIN_STORAGE, lastEmail);
            }
            if (hasSession()) {
                if (lastUpdate !== null) {
                    localStorage.setItem(LAST_SESSION_STORAGE, currentSession);
                    localStorage.setItem(LAST_SESSION_TIME_STORAGE, lastUpdate);
                }
                else {
                    localStorage.removeItem(LAST_SESSION_STORAGE);
                    localStorage.removeItem(LAST_SESSION_TIME_STORAGE);
                }
            }
        }
        Login.updateLocalStorage = updateLocalStorage;
        function keepAlive() {
            var cbs = {
                handleEvent: function () {
                    Application.Login.updateSessionLife();
                }
            };
            Server.Login.requestSession(true, cbs);
        }
        Login.keepAlive = keepAlive;
        function setSession(a) {
            currentSession = a;
        }
        Login.setSession = setSession;
        function addListener(listener) {
            trigger.addListener(listener);
        }
        Login.addListener = addListener;
        function getUser() {
            return currentUser;
        }
        Login.getUser = getUser;
        function triggerListeners() {
            trigger.trigger(isLogged());
        }
    })(Login = Application.Login || (Application.Login = {}));
})(Application || (Application = {}));
var Lingo = (function () {
    function Lingo() {
        this.ids = [];
        this.unknownLingo = " :( ";
        this.langValues = {};
    }
    Lingo.prototype.setLingo = function (id, value) {
        this.langValues[id] = value;
    };
    Lingo.prototype.getLingo = function (id, dataset) {
        if (this.langValues[id] === undefined) {
            console.warn("[LANGUAGE] No string for \"" + id + "\" in " + this.name + ".");
            return this.unknownLingo;
        }
        var result = this.langValues[id];
        if (dataset === undefined) {
            return result;
        }
        var number = "a".charCodeAt(0);
        while (dataset["language" + String.fromCharCode(number)] !== undefined) {
            result = result.replace(new RegExp("%" + String.fromCharCode(number), 'g'), dataset["language" + String.fromCharCode(number)]);
            number++;
        }
        return result;
    };
    return Lingo;
}());
var LingoList;
(function (LingoList) {
    var lingos = {};
    function getLingos() {
        var list = [];
        for (var id in lingos) {
            if (list.indexOf(lingos[id]) === -1)
                list.push(lingos[id]);
        }
        list.sort(function (a, b) {
            var na = a.name.toLowerCase();
            var nb = b.name.toLowerCase();
            if (na < nb)
                return -1;
            if (na > nb)
                return 1;
            return 0;
        });
        return list;
    }
    LingoList.getLingos = getLingos;
    function getLingo(id) {
        id = id.toLowerCase().trim();
        if (lingos[id] !== undefined) {
            return lingos[id];
        }
        id = id.split("-")[0];
        if (lingos[id] !== undefined) {
            return lingos[id];
        }
        return lingos["pt"];
    }
    LingoList.getLingo = getLingo;
    function storeLingo(lingo) {
        for (var i = 0; i < lingo.ids.length; i++) {
            lingos[lingo.ids[i]] = lingo;
        }
    }
    LingoList.storeLingo = storeLingo;
})(LingoList || (LingoList = {}));
var ptbr = new Lingo();
ptbr.ids = ["pt", "pt-br"];
ptbr.name = "Português - Brasil";
ptbr.shortname = "Português";
ptbr.flagIcon = "PT_BR";
ptbr.setLingo("_LOGINEMAIL_", "E-mail");
ptbr.setLingo("_LOGINPASSWORD_", "Senha");
ptbr.setLingo("_LOGINSUBMIT_", "Entrar");
ptbr.setLingo("_CHANGELOGTITLE_", "Histórico de mudanças");
ptbr.setLingo("_CHANGELOGP1_", "Para receber os updates marcados em vermelho você precisa atualizar sua aplicação para a última versão.");
ptbr.setLingo("_CHANGELOGP2_", "Compatibilidade com versões anteriores não é intencional. Não existem garantias de que versões desatualizadas funcionem e é recomendável sempre utilizar a versão mais recente do aplicativo.");
ptbr.setLingo("_CHANGELOGCURRENTVERSION_", "A sua versão é");
ptbr.setLingo("_CHANGELOGMOSTRECENTVERSION_", "A versão mais recente é");
ptbr.setLingo("_CHANGELOGVERSIONWARNING_", "Seu aplicativo está desatualizado. Recomenda-se atualizar o seu aplicativo. Caso esteja acessando a versão Online através de RedPG.com.br, é só recarregar a página (F5). Atualizações marcadas em vermelho não estão disponíveis.");
ptbr.setLingo("_REDPGTITLE_", "RedPG");
ptbr.setLingo("_REDPGEXP1_", "RedPG é um sistema para facilitar RPGs de Mesa através da internet. Funções do sistema incluem o compartilhamento de Imagens, Sons, Fichas de Personagens, uma sala para troca de mensagens com suporte a dados e muito mais, com novas funções sempre sendo adicionadas.");
ptbr.setLingo("_REDPGEXP2_", "Todos os aspectos do sistema existem e estão presos aos Grupos, um grupo de RPG. Então para criar qualquer coisa ou utilizar o sistema de qualquer maneira, você precisa criar ou ser convidado a um Grupo. Isso é feito na seção \"Grupos\", no menu à esquerda.");
ptbr.setLingo("_REDPGFORUMTITLE_", "Últimos posts no Fórum");
ptbr.setLingo("_REDPGFORUM1_", "Não Implementado");
ptbr.setLingo("_REDPGDONATIONTITLE_", "Doações");
ptbr.setLingo("_REDPGDONATIONEXP1_", "RedPG é um sistema gratuito e permanecerá gratuito enquanto isso for possível. Mas o servidor possui um custo e alguém precisa pagar.");
ptbr.setLingo("_REDPGDONATIONEXP2_", "Através de doações, você funda o desenvolvimento do sistema e ajuda a pagar as mensalidades do servidor. Com a ajuda de todos, RedPG poderá ser grátis para sempre!");
ptbr.setLingo("_REDPGDONATIONEXP3_", "Sempre que fizer uma doação, tente realizar ela a partir de uma conta registrada no mesmo nome registrado no RedPG. Assim, no futuro suas doações poderão ser contabilizadas pelo sistema do RedPG!");
ptbr.setLingo("_REDPGLINKSTITLE_", "Links úteis");
ptbr.setLingo("_REDPGLINKFRONTBUTTON_", "RedPG Front on GitHub");
ptbr.setLingo("_REDPGLINKFRONTEXP_", "Versão offline do cliente RedPG. Usuários que queiram abrir o RedPG a partir da própria máquina devem baixar versões atualizadas aqui. A versão offline permite que jogadores e mestres compartilhem sons que estejam dentro da pasta Sons, sem a necessidade de um servidor para compartilhar sons.");
ptbr.setLingo("_MENULOGOUT_", "Logout");
ptbr.setLingo("_MENUGAMES_", "Grupos");
ptbr.setLingo("_MENUCONFIG_", "Opções");
ptbr.setLingo("_MENUCHAT_", "Chat");
ptbr.setLingo("_MENUSHEETS_", "Fichas");
ptbr.setLingo("_MENUIMAGES_", "Fotos");
ptbr.setLingo("_MENUSOUNDS_", "Sons");
ptbr.setLingo("_MENUIMAGE_", "Foto");
ptbr.setLingo("_MENUHITBOX_", "Hitbox");
ptbr.setLingo("_MENUYOUTUBE_", "Video");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("_STYLESTITLE_", "Estilos de Fichas");
ptbr.setLingo("_STYLESEXP1_", "Um estilo de ficha é como um formulário em branco que pode ser preenchido para criar uma ficha. O sistema é bem aberto e não existem limites para o que um estilo de ficha pode realizar. O uso mais comum para o estilo de ficha é definir quais campos a ficha terá e como eles são apresentados para servirem como fichas de personagens durante o jogo, mas muitos outros tipos de \"ficha\" já foram criados no passado (como História de Personagem, Mapas, Notas Pessoais, etc).");
ptbr.setLingo("_STYLESEXP2_", "A confecção de um estilo é algo um tanto complicado, então essa parte do sistema deve ser utilizada por usuários avançados.");
ptbr.setLingo("_STYLESNEWSTYLE_", "--- Criar novo estilo");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("_STYLEEDITOR_", "Editor de Estilo");
ptbr.setLingo("_STYLEEDITOREXP_", "");
ptbr.setLingo("_STYLEEDITORNAME_", "Nome do Estilo");
ptbr.setLingo("_STYLEEDITORPUBLIC_", "Estilo é Público");
ptbr.setLingo("_STYLEEDITORPUBLICEXP_", "Estilos públicos podem ser utilizados em qualquer mesa.");
ptbr.setLingo("_STYLEEDITORGAME_", "Mesa:");
ptbr.setLingo("_STYLEEDITORGAMEEXP_", "Estilos só podem ser utilizados para fichas criadas na mesa definida.");
ptbr.setLingo("_STYLEEDITORHTML_", "HTML:");
ptbr.setLingo("_STYLEEDITORCSS_", "CSS:");
ptbr.setLingo("_STYLEEDITORJS_", "JavaScript:");
ptbr.setLingo("_STYLEEDITORPUBLICCODE_", "Código Público:");
ptbr.setLingo("_STYLEEDITORCOPY_", "Copiar Estilo:");
ptbr.setLingo("_STYLEEDITORCOPYEXP_", "Copia todos os valores do estilo selecionado para o atual.");
ptbr.setLingo("_STYLEEDITORCOPYBUTTON_", "Copiar");
ptbr.setLingo("_STYLEEDITORREMAIN_", "Permanecer nessa tela");
ptbr.setLingo("_STYLEEDITORSAVE_", "Salvar");
ptbr.setLingo("_SOUNDSTITLE_", "Sons");
ptbr.setLingo("_SOUNDSLINKTITLE_", "Link Direto");
ptbr.setLingo("_SOUNDSDROPBOXCHOOSER_", "Escolher do Dropbox");
ptbr.setLingo("_SOUNDSEXP01_", "Aqui você pode adicionar músicas e efeitos sonoros para compartilhar em Salas ou utilizar em Fichas.");
ptbr.setLingo("_SOUNDSEXP02_", "Quando adicionando arquivos, veja a opção \"Adicionar como BGM\". Sons adicionados como BGM irão tocar no primeiro canal, que por padrão se repete automaticamente. Sons que forem adicionados sem serem BGM serão considerados SE, tocarão no segundo canal e não se repetirão. Existem opções separadas de volume para os dois tipos de sons, essas opções podem ser encontradas na seção \"Opções\", do lado esquerdo.");
ptbr.setLingo("_SOUNDSISBGM_", "Adicionar como BGM");
ptbr.setLingo("_SOUNDSNOFOLDERNAME_", "Sem Pasta");
ptbr.setLingo("_SOUNDSRENAME_", "Renomear");
ptbr.setLingo("_SOUNDSFOLDER_", "Renomear Pasta");
ptbr.setLingo("_SOUNDSPLAY_", "Tocar");
ptbr.setLingo("_SOUNDSRENAMEPROMPT_", "Digite o novo nome para \"%a\":");
ptbr.setLingo("_SOUNDSRENAMEFOLDERPROMPT_", "Digite a nova pasta para \"%a\", atualmente em \"%b\":");
ptbr.setLingo("_IMAGESTITLE_", "Fotos");
ptbr.setLingo("_IMAGESEXP01_", "Imagens ficam anexadas à sua conta e podem ser utilizadas em qualquer seção do RedPG.");
ptbr.setLingo("_IMAGESEXP02_", "Você deve adicionar imagens como um Link direto ou através de uma conta Dropbox. É possível utilizar o botão Dropbox abaixo para começar a guardar as imagens na sua conta RedPG.");
ptbr.setLingo("_IMAGESEXP03_", "O sistema tentará organizar as imagens adicionadas através do Dropbox em pastas automaticamente, porém você pode alterar essas pastas mais tarde. Imagens com um \"-\" no nome do arquivo terão tudo que estiver antes do traço como sendo o nome da pasta, e o que vier depois sendo considerado o nome da imagem. O sistema não vai permitir imagens repetidas (tanto como Link, quanto como Pasta/Nome).");
ptbr.setLingo("_IMAGESDROPBOXCHOOSER_", "Escolher do Dropbox");
ptbr.setLingo("_IMAGESLINKTITLE_", "Link Direto");
ptbr.setLingo("_IMAGESERROR_", "Erro carregando a lista de imagens. Tente novamente.");
ptbr.setLingo("_IMAGESSAVEERROR_", "Houve um erro salvando a lista de imagens.");
ptbr.setLingo("_IMAGESNOFOLDERNAME_", "Sem Pasta");
ptbr.setLingo("_IMAGESSHARE_", "Compartilhar na sala atual (se conectado)");
ptbr.setLingo("_IMAGESVIEW_", "Visualizar");
ptbr.setLingo("_IMAGESPERSONA_", "Utilizar como Persona");
ptbr.setLingo("_IMAGESDELETE_", "Deletar");
ptbr.setLingo("_IMAGESRENAME_", "Renomear");
ptbr.setLingo("_IMAGESFOLDER_", "Alterar Pasta");
ptbr.setLingo("_IMAGESRENAMEPROMPT_", "Digite o novo nome para \"%a\":");
ptbr.setLingo("_IMAGESRENAMEFOLDERPROMPT_", "Digite a nova pasta para \"%a\", atualmente em \"%b\":");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("_PICASHARE_", "Compartilhar no Chat");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("_LOGGERTITLE_", "Logger");
ptbr.setLingo("_LOGGEREXP1_", "O excerto a seguir representa as primeiras e as últimas mensagens que irão fazer parte deste log. Você pode alterar o slider abaixo para definir onde começar o log e onde terminar o log. Apenas mensagens públicas (não enviadas a uma pessoa específica) serão guardadas no JSON. Você pode mover com as setas do teclado após clicar nos sliders.");
ptbr.setLingo("_LOGGEREXP2_", "Aqui você pode definir quais tipos de mensagens não serão salvas. Lembrando que apenas mensagens públicas (visível a todos) serão salvas no log.");
ptbr.setLingo("_LOGGERSUBMIT_", "Criar Log");
ptbr.setLingo("", "");
ptbr.setLingo("_SHEETSTITLE_", "Fichas");
ptbr.setLingo("_SHEETSEXP01_", "Fichas são algo que mestres e seus jogadores podem guardar no sistema, garantindo que todos estejam vendo a mesma versão desse recurso. Um jogador só pode ver fichas para as quais ele tem permissões adequadas, então lembre-se de alterar essas opções para cada ficha que fizer.");
ptbr.setLingo("_SHEETSEXP02_", "Normalmente são usadas para guardar as informações de personagens, mas têm o potencial para guardar qualquer tipo de informação.");
ptbr.setLingo("_SHEETSEXP03_", "Cada ficha utiliza um \"Estilo\", que define a aparência dela e os valores que ela precisa guardar. Como alguns estilos não são criados por um administrador, tome cuidado ao abrir fichas que utilizem estilos criados por alguém em quem você não confia. Apenas os estilos criados por um administrador são considerados seguros.");
ptbr.setLingo("_SHEETSOPENSTYLEEDITOR_", "Abrir gerenciador de estilos de ficha");
ptbr.setLingo("_SHEETSDELETE_", "Deletar");
ptbr.setLingo("_SHEETSRENAMEFOLDER_", "Pasta");
ptbr.setLingo("_SHEETSCHANGEPERMISSIONS_", "Permissões");
ptbr.setLingo("_SHEETSDELETE_", "Deletar");
ptbr.setLingo("_SHEETSNOFOLDERNAME_", "Fichas sem pasta");
ptbr.setLingo("_SHEETSRENAMEFOLDERPROMPT_", "Escolha a nova pasta para \"%a\", atualmente em \"%b\":");
ptbr.setLingo("_SHEETSNEWSHEET_", "Criar nova ficha");
ptbr.setLingo("_SHEETSNOSHEETS_", "Sem fichas para exibir.");
ptbr.setLingo("_SHEETCONFIRMDELETE_", "Deletar \"%a\"? Fichas deletadas não podem ser recuperadas.");
ptbr.setLingo("_SHEETPERMISSIONSHEADER_", "Permissões de Ficha");
ptbr.setLingo("_SHEETPERMISSIONEXP_", "As permissões definem o que cada jogador de um grupo pode fazer com uma certa ficha. \"Ver\" indica que o jogador poderá abrir a ficha, \"Editar\" indica que o jogador poderá alterar os valores dessa ficha, \"Deletar\" permite que o jogador apague a ficha (permanentemente) e \"Promover\" permite que um jogador acesse essa tela, podendo fornecer permissões para outros jogadores.");
ptbr.setLingo("_SHEETPERMISSIONSHEETNAME_", "Você está editando permissões para \"%a\".");
ptbr.setLingo("_SHEETPERMISSIONVIEW_", "Ver");
ptbr.setLingo("_SHEETPERMISSIONEDIT_", "Editar");
ptbr.setLingo("_SHEETPERMISSIONDELETE_", "Deletar");
ptbr.setLingo("_SHEETPERMISSIONPROMOTE_", "Promover");
ptbr.setLingo("_SHEETPERMISSIONSUBMIT_", "Confirmar");
ptbr.setLingo("_GAMESTITLE_", "Grupos");
ptbr.setLingo("_GAMESEXP1_", "Caso precise informar seu identificador para alguém, ele é \"%a\", sem as aspas.");
ptbr.setLingo("_GAMESEXP2_", "Aqui você pode administrar os grupos dos quais você participa. Para convidar jogadores ao seu grupo, você irá precisar do identificador deles.");
ptbr.setLingo("_GAMESEXP3_", "Um grupo nesse sistema é o lugar no qual todas as outras partes do sistema se conectam. As salas, o ambiente no qual as partidas são jogadas, ficam anexadas a um grupo. As fichas de personagens ficam anexadas a um grupo.");
ptbr.setLingo("_GAMESEXP4_", "No momento não é possível pedir uma lista de grupos de livre entrada (não implementados).");
ptbr.setLingo("_GAMESINVITES_", "Meus convites");
ptbr.setLingo("_GAMESNEWGAME_", "Criar novo grupo");
ptbr.setLingo("_GAMEINVITESERROR_", "Houve um erro no pedido.");
ptbr.setLingo("_GAMEINVITESEMPTY_", "Você não recebeu nenhum convite.");
ptbr.setLingo("_GAMEINVITESREFRESH_", "Clique aqui para atualizar essa página.");
ptbr.setLingo("_GAMEINVITESERRORTRYAGAIN_", "Tente novamente.");
ptbr.setLingo("_GAMEINVITESGAMETITLE_", "Grupo");
ptbr.setLingo("_GAMEINVITESSTORYTELLER_", "Mestre");
ptbr.setLingo("_GAMEINVITESNOMESSAGE_", "Nenhuma mensagem foi adicionada ao convite.");
ptbr.setLingo("_GAMEINVITESMESSAGE_", "Convite");
ptbr.setLingo("_GAMEINVITESACCEPT_", "Aceitar");
ptbr.setLingo("_GAMEINVITESREJECT_", "Recusar");
ptbr.setLingo("_GAMESEDIT_", "Editar");
ptbr.setLingo("_GAMESDELETE_", "Deletar");
ptbr.setLingo("_GAMESLEAVE_", "Sair");
ptbr.setLingo("_GAMESNOROOMS_", "Nenhuma sala visível.");
ptbr.setLingo("_GAMESNOGAMES_", "Você não faz parte de nenhum grupo. Você pode criar seu próprio grupo ou ser convidado a algum.");
ptbr.setLingo("_GAMECREATORTITLE_", "Criador");
ptbr.setLingo("_GAMESPERMISSIONS_", "Permissões");
ptbr.setLingo("_GAMESSENDINVITES_", "Enviar convites");
ptbr.setLingo("_GAMESCREATEROOM_", "Criar sala");
ptbr.setLingo("_GAMESROOMPERMISSIONS_", "Permissões");
ptbr.setLingo("_GAMESROOMDELETE_", "Deletar");
ptbr.setLingo("", "");
ptbr.setLingo("_ROOMDESIGNERTITLE_", "Editor de Salas");
ptbr.setLingo("_ROOMDESIGNERERROR_", "Houve um erro no processamento. Tente novamente.");
ptbr.setLingo("_ROOMDESIGNERNAMEPLACEHOLDER_", "Nome da Sala");
ptbr.setLingo("_ROOMDESIGNERMESSAGEPLACEHOLDER_", "Descrição da sala. Será impressa no topo sempre que alguém visitá-la.");
ptbr.setLingo("_ROOMDESIGNERSUBMIT_", "Enviar");
ptbr.setLingo("_ROOMDESIGNEREXP_", "Uma sala é um lugar onde todos podem se reunir para participar de um jogo. Recomenda-se criar salas separadas por sua função, como \"Criação de Fichas\" ou \"História Principal\".");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("_GAMEDESIGNERTITLE_", "Editor de Mesas");
ptbr.setLingo("_GAMEDESIGNERERROR_", "Houve um erro no processamento. Tente novamente.");
ptbr.setLingo("_GAMEDESIGNERNAMEPLACEHOLDER_", "Nome da mesa. Máximo de 30 caracteres.");
ptbr.setLingo("_GAMEDESIGNERMESSAGEPLACEHOLDER_", "Descrição para a mesa. Utilize esse espaço para definir quais os objetivos da mesa, assim como horários e qualquer informação que seus jogadores devam ter.");
ptbr.setLingo("_GAMEDESIGNERSUBMIT_", "Enviar");
ptbr.setLingo("", "");
ptbr.setLingo("_GAMEINVITESTITLE_", "Meus Convites");
ptbr.setLingo("_GAMEINVITESEXP01_", "Enquanto você não aceitar um dos convites, você não faz parte do grupo.");
ptbr.setLingo("_GAMEINVITESEXP02_", "Caso precise informar seu identificador a alguém, ele é \"%a\".");
ptbr.setLingo("_GAMEINVITEDESIGNERTITLE_", "Enviando Convites");
ptbr.setLingo("_GAMEINVITEDESIGNEREXP01_", "Aqui você adiciona jogadores a mesa. Um jogador só pode visualizar qualquer coisa de uma mesa quando ele foi convidado e aceitou o convite. Depois de enviar o convite, você não poderá repetir o envio até o jogador aceitar ou recusar o convite. Para convidar um jogador, você precisa digitar o identificador dele no formulário abaixo. Identificadores de todos são parecidos com o seu, como \"Nome#1234\", então um nome curto, sem espaços, seguido de \"#\" e então um número com quatro dígitos.");
ptbr.setLingo("_GAMEINVITEDESIGNEREXP02_", "Você está adicionando jogadores para a mesa \"%a\".");
ptbr.setLingo("_GAMEINVITEDESIGNERERROR404_", "Nenhum jogador com esse nome foi encontrado.");
ptbr.setLingo("_GAMEINVITEDESIGNERERROR401_", "Você já enviou um convite para esse jogador.");
ptbr.setLingo("_GAMEINVITEDESIGNERSUCCESS_", "Convite enviado com sucesso!");
ptbr.setLingo("_GAMEINVITEDESIGNERSUBMIT_", "Enviar");
ptbr.setLingo("_GAMEINVITEDESIGNERNAMEPLACEHOLDER_", "Identificador#");
ptbr.setLingo("_GAMEINVITEDESIGNERMESSAGEPLACEHOLDER_", "Carta de apresentação");
ptbr.setLingo("", "");
ptbr.setLingo("_CHATHELP01_", "Use \"/comandos\" para imprimir uma lista completa de comandos. Comandos básicos:");
ptbr.setLingo("_CHATHELP02_", "\"/me [mensagem]\": Envia a mensagem como uma ação da persona escolhida.");
ptbr.setLingo("_CHATHELP03_", "\"/off [mensagem]\": Envia a mensagem como uma mensagem fora de jogo, falando como o jogador.");
ptbr.setLingo("_CHATHELP04_", "\"/story [mensagem]\": Envia a mensagem como uma mensagem de história, disponível apenas para narradores.");
ptbr.setLingo("_CHATHELP05_", "Alternativamente, segure Alt, Control ou Shift quando for enviar a mensagem.");
ptbr.setLingo("_CHATHELP06_", "É recomendável executar \"/clear 1\" para limpar as mensagens no servidor de vez em quando, ou a sala ficará cada vez mais lenta.");
ptbr.setLingo("_CHATHELP07_", "Caso deseje usar as músicas em modo offline, mas o RedPG em modo online, clique no formulário abaixo e escolha suas músicas: você estará dando permissão temporária para o RedPG acessá-las.");
ptbr.setLingo("_CHATEMPTYNOTALLOWED_", "Mensagens vazias não são permitidas. Para limpar a tela de mensagens, digite \"/clear\".");
ptbr.setLingo("_CHATMESSAGENOTSENT_", "Houve um erro no envio da mensagem acima.");
ptbr.setLingo("_CHATMESSAGENOTSENTRESEND_", "Clique aqui para tentar novamente.");
ptbr.setLingo("_CHATHASCONNECTED_", "entrou na sala.");
ptbr.setLingo("_CHATHASDISCONNECTED_", "saiu da sala.");
ptbr.setLingo("_CHATOLDMESSAGESNOTLOADED_", "Mensagens antigas não foram impressas.");
ptbr.setLingo("_CHATOLDMESSAGESLOAD_", "Clique aqui para carregar todas as mensagens dessa sala.");
ptbr.setLingo("_CHATYOUAREDISCONNECTED_", "Você foi desconectado.");
ptbr.setLingo("_CHATDISCONNECTEDRECONNECT_", "Clique aqui para reconectar.");
ptbr.setLingo("_CHATNOTALLMESSAGES_", "Algumas mensagens não foram impressas por estarem acima do limite atual de mensagens. Você pode aumentar o limite de mensagens em Opções.");
ptbr.setLingo("_CHATRECONNECTINGEXP_", "Você foi desconectado. Tentando reconectar...");
ptbr.setLingo("_CHATDISCONNECTEDEXP_", "Você está desconectado.");
ptbr.setLingo("_CHATMESSAGEROLEPLAYTRANSLATION_", "Tradução");
ptbr.setLingo("_CHATMESSAGEUNKNOWNTYPE_", "Mensagem de tipo desconhecido \"%a\", enviada por %b.");
ptbr.setLingo("_CHATSENDER_", "Jogador");
ptbr.setLingo("_CHATSENDERSTORYTELLER_", "Mestre");
ptbr.setLingo("_CHATDICEROLLED_", "rolou");
ptbr.setLingo("_CHATDICESECRETROLLED_", "secretamente rolou");
ptbr.setLingo("_CHATDICESHOWN_", "mostrou");
ptbr.setLingo("_CHATDICESECRETSHOWN_", "secretamente mostrou");
ptbr.setLingo("_CHATMESSAGEDICEREASON_", "Motivo");
ptbr.setLingo("_CHATMESSAGEWHISPERTO_", "Mensagem enviada para");
ptbr.setLingo("_CHATMESSAGEWHISPERFROM_", "Mensagem recebida de");
ptbr.setLingo("_CHATMESSAGESHAREDBGM_", "compartilhou um som");
ptbr.setLingo("_CHATMESSAGEPLAYBGM_", "Tocar");
ptbr.setLingo("_CHATMESSAGESHAREDIMAGE_", "compartilhou uma imagem");
ptbr.setLingo("_CHATMESSAGESEEIMAGE_", "Ver");
ptbr.setLingo("_CHATMESSAGESHAREDSE_", "compartilhou um efeito sonoro");
ptbr.setLingo("_CHATMESSAGEPLAYSE_", "Ouvir");
ptbr.setLingo("_CHATMESSAGESHAREDVIDEO_", "compartilhou um video");
ptbr.setLingo("_CHATMESSAGEPLAYVIDEO_", "Assistir");
ptbr.setLingo("_CHATMESSAGEVOTECREATEDVOTE_", "criou uma votação");
ptbr.setLingo("_CHATDICEROLLEDWAITING_", "Esperando resposta do servidor...");
ptbr.setLingo("_CHATDICEAMOUNT_", "#");
ptbr.setLingo("_CHATDICEFACES_", "d#");
ptbr.setLingo("_CHATDICEMOD_", "+#");
ptbr.setLingo("_CHATDICEREASON_", "Razão");
ptbr.setLingo("_CHATWHISPERNOTARGETSFOUND_", "Nenhum jogador encontrado para \"%a\".");
ptbr.setLingo("_CHATMULTIPLETARGETSFOUND_", "Múltiplos jogadores encontrados");
ptbr.setLingo("_CHATINVALIDCOMMAND_", "Comando inválido. Digite \"/comandos\" para imprimir uma lista completa de comandos.");
ptbr.setLingo("_CHATBGMERROR_", "Erro ao tocar música.");
ptbr.setLingo("_CHATSEERROR_", "Erro ao tocar efeito sonoro.");
ptbr.setLingo("_CHATSOUNDADDMORE_", "Clique aqui para alterar músicas em uso.");
ptbr.setLingo("_CHATMESSAGEANNOUNCEMENT_", "AVISO DO SISTEMA");
ptbr.setLingo("_CHATMESSAGESFROM_", "Mensagens de %a.");
ptbr.setLingo("_CHATIMAGESNOIMAGES_", "Sem imagens recentes.");
ptbr.setLingo("_CHATIMAGESPRINTINGIMAGES_", "Imagens recentes:");
ptbr.setLingo("", "");
ptbr.setLingo("_PERSONADESIGNERTITLE_", "Administrador de Personas");
ptbr.setLingo("_PERSONADESIGNERNAME_", "Nome do Personagem");
ptbr.setLingo("_PERSONADESIGNERAVATAR_", "Link para Imagem (Opcional)");
ptbr.setLingo("_PERSONADESIGNERCREATE_", "Criar");
ptbr.setLingo("_CHATPERSONADESIGNERUSE_", "Usar essa persona");
ptbr.setLingo("_CHATPERSONADESIGNERDELETE_", "Deletar essa persona");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("_CONFIGSEVOLUME_", "Volume de Efeitos Sonoros");
ptbr.setLingo("_CONFIGSEVOLUMEEXP_", "Define o volume para efeitos sonoros reproduzidos no RedPG.");
ptbr.setLingo("_CONFIGBGMVOLUME_", "Volume de Músicas");
ptbr.setLingo("_CONFIGBGMVOLUMEEXP_", "Define o volume para músicas reproduzidas no RedPG.");
ptbr.setLingo("_CONFIGSAVE_", "Salvar Configuração");
ptbr.setLingo("_CONFIGERROR_", "Erro salvando configuração.");
ptbr.setLingo("_CONFIGSUCCESS_", "Configurações salvas com sucesso.");
ptbr.setLingo("_CONFIGRESET_", "Resetar Configurações");
ptbr.setLingo("_CONFIGTITLE_", "Configurações");
ptbr.setLingo("_CONFIGCHATFONTSIZE_", "(Chat) Tamanho da fonte:");
ptbr.setLingo("_CONFIGCHATFONTFAMILY_", "(Chat) Fonte:");
ptbr.setLingo("_CHATFONTSIZEEXP01_", "Define o tamanho da fonte utilizada no chat.");
ptbr.setLingo("_CHATFONTSIZEEXP02_", "A fonte se torna menor para a esquerda e maior para a direita.");
ptbr.setLingo("_CHATFONTFAMILEXP01_", "Define qual é a fonte utilizada no Chat. Você pode utilizar qualquer fonte disponível no seu computador.");
ptbr.setLingo("_CHATFONTFAMILEXP02_", "A fonte usada no RedPG é \"Alegreya\". A fonte utilizada no antigo chat do RedPG é \"Caudex\" e ainda está disponível.");
ptbr.setLingo("_CONFIGCHATHELP_", "(Chat) Mostrar texto de ajuda:");
ptbr.setLingo("_CONFIGCHATHELPEXP_", "O texto de ajuda é o guia rápido de utilização do Chat que é normalmente impresso no topo da sala. Essa opção pode esconder esse texto.");
ptbr.setLingo("_CONFIGCHATHELPOP01_", "Imprimir mensagens de ajuda");
ptbr.setLingo("_CONFIGCHATHELPOP02_", "Não imprimir mensagens de ajuda");
ptbr.setLingo("_CONFIGANIMATIONTIME_", "Duração de animações:");
ptbr.setLingo("_ANIMATIONTIMEEXP01_", "Todas as animações do RedPG serão proporcionais a essa configuração.");
ptbr.setLingo("_ANIMATIONTIMEEXP02_", "Abaixar essa configuração pode ajudar em dispositivos mais lentos que estejam tendo dificuldades em processar as animações do RedPG.");
ptbr.setLingo("_CONFIGCHATAUTOEXP_", "Quando recebendo compartilhamentos no Chat, essa opção define quando o compartilhamento é aceito automaticamente. Você sempre pode aceitar manualmente.");
ptbr.setLingo("_CONFIGCHATAUTONEVER_", "Nunca");
ptbr.setLingo("_CONFIGCHATAUTOSOMETIMES_", "Apenas quando enviado pelo narrador");
ptbr.setLingo("_CONFIGCHATAUTOALWAYS_", "Sempre");
ptbr.setLingo("_CONFIGCHATAUTOBGM_", "(Chat) Aceitar músicas:");
ptbr.setLingo("_CONFIGCHATAUTOSE_", "(Chat) Aceitar efeitos sonoros:");
ptbr.setLingo("_CONFIGCHATAUTOIMAGE_", "(Chat) Aceitar imagens:");
ptbr.setLingo("_CONFIGCHATAUTOVIDEO_", "(Chat) Aceitar vídeos:");
ptbr.setLingo("_CONFIGCHATMAXMESSAGESEXP01_", "Define quantas mensagens podem estar impressas no chat ao mesmo tempo. Mínimo de 60 mensagens e máximo de 10000 mensagens. Escolha de acordo com seu CPU.");
ptbr.setLingo("_CONFIGCHATMAXMESSAGESEXP02_", "Essa opção é ignorada e se torna 60 quando utilizando dispositivos móveis.");
ptbr.setLingo("_CONFIGCHATMAXMESSAGES_", "(Chat) Número de mensagens:");
ptbr.setLingo("_CONFIGCLEANPERSONAS_", "(Chat) Personas Vazias");
ptbr.setLingo("_CONFIGCLEANPERSONAS01_", "Mostrar personas padrão");
ptbr.setLingo("_CONFIGCLEANPERSONAS02_", "Mostrar personas vazias");
ptbr.setLingo("_CONFIGCLEANPERSONAS03_", "Mostrar personas vazias, sem nome");
ptbr.setLingo("_CONFIGCLEANPERSONASEXP_", "Essa opção retira o estilo padrão das personas e os deixa transparentes.");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
LingoList.storeLingo(ptbr);
delete (ptbr);
var UI;
(function (UI) {
    UI.idChangelog = "changelogSideWindow";
    UI.idGames = "gamesSideWindow";
    UI.idChat = "chatSideWindow";
    UI.idConfig = "configSideWindow";
    UI.idGameInvites = "gameInvitesSideWindow";
    UI.idStyles = "stylesSideWindow";
    UI.idStyleDesigner = "styleEditorSideWindow";
    UI.idInviteDesigner = "gameInviteFormSideWindow";
    UI.idGameDesigner = "gameDesignerFormSideWindow";
    UI.idRoomDesigner = "roomDesignerFormSideWindow";
    UI.idHome = "homeSideWindow";
    UI.idSheets = "sheetsSideWindow";
    UI.idImages = "imagesSideWindow";
    UI.idSounds = "soundsSideWindow";
    UI.idSheetPerm = "sheetPermSideWindow";
    Application.Config.registerConfiguration("chatMaxMessages", new NumberConfiguration(120, 60, 10000));
    Application.Config.registerConfiguration("chatshowhelp", new BooleanConfiguration(true));
    Application.Config.registerConfiguration("chatfontsize", new NumberConfiguration(16, 12, 32));
    Application.Config.registerConfiguration("chatfontfamily", new Configuration("caudex"));
    Application.Config.getConfig("chatfontfamily").getFunction = function () {
        if ($.browser.mobile) {
            return "alegreya";
        }
        else {
            return this.value;
        }
    };
    Application.Config.registerConfiguration("animTime", new NumberConfiguration(150, 0, 300));
    Application.Config.registerConfiguration("language", new LanguageConfiguration());
    Application.Config.registerConfiguration("fsmode", new BooleanConfiguration(false));
    Application.Config.registerConfiguration("chatuseprompt", new BooleanConfiguration(true));
    Application.Config.registerConfiguration("autoImage", new NumberConfiguration(1, 0, 2));
    Application.Config.registerConfiguration("autoBGM", new NumberConfiguration(1, 0, 2));
    Application.Config.registerConfiguration("autoSE", new NumberConfiguration(1, 0, 2));
    Application.Config.registerConfiguration("autoVIDEO", new NumberConfiguration(1, 0, 2));
    Application.Config.registerConfiguration("bgmVolume", new NumberConfiguration(50, 0, 100));
    Application.Config.registerConfiguration("seVolume", new NumberConfiguration(50, 0, 100));
    Application.Config.registerConfiguration("bgmLoop", new BooleanConfiguration(true));
    var cleanPersonaCSS = document.createElement("style");
    cleanPersonaCSS.type = "text/css";
    cleanPersonaCSS.innerHTML = ".avatarContainer { border-color: rgba(0,0,0,0); background-color: initial; } .avatarName { background-color: initial; }";
    var cleanPersonaTotallyCSS = document.createElement("style");
    cleanPersonaTotallyCSS.type = "text/css";
    cleanPersonaTotallyCSS.innerHTML = ".avatarContainer { border-color: rgba(0,0,0,0); background-color: initial; } .avatarName { opacity: 0; }";
    function cleanPersona(cfg) {
        if (cfg.getValue() === 1) {
            document.head.appendChild(cleanPersonaCSS);
            if (cleanPersonaTotallyCSS.parentElement !== null) {
                cleanPersonaTotallyCSS.parentElement.removeChild(cleanPersonaTotallyCSS);
            }
        }
        else if (cfg.getValue() === 2) {
            document.head.appendChild(cleanPersonaTotallyCSS);
            if (cleanPersonaCSS.parentElement !== null) {
                cleanPersonaCSS.parentElement.removeChild(cleanPersonaCSS);
            }
        }
        else {
            if (cleanPersonaTotallyCSS.parentElement !== null) {
                cleanPersonaTotallyCSS.parentElement.removeChild(cleanPersonaTotallyCSS);
            }
            if (cleanPersonaCSS.parentElement !== null) {
                cleanPersonaCSS.parentElement.removeChild(cleanPersonaCSS);
            }
        }
    }
    UI.cleanPersona = cleanPersona;
    Application.Config.registerConfiguration("cleanPersonas", new NumberConfiguration(0, 0, 2));
    Application.Config.getConfig("cleanPersonas").addChangeListener(function (cfg) {
        UI.cleanPersona(cfg);
    });
})(UI || (UI = {}));
var UI;
(function (UI) {
    var WindowManager;
    (function (WindowManager) {
        var currentWindow = "";
        var windowList = {};
        var $windowList = {};
        var style = document.createElement('style');
        style.type = 'text/css';
        document.head.appendChild(style);
        var lastStyleInnerHTML = "";
        (function () {
            var children = document.body.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.classList.contains("window")) {
                    windowList[child.getAttribute("id")] = child;
                    $windowList[child.getAttribute("id")] = $(child);
                }
            }
        })();
        function callWindow(id) {
            var animationTime = Application.Config.getConfig("animTime").getValue() * 2;
            if (windowList[id] === undefined) {
                console.log("--- Error: Attempt to call inexistent window: " + id + ", ignoring.");
                return;
            }
            if (id === currentWindow)
                return;
            if (currentWindow === "") {
                detachAllWindows();
            }
            else {
                console.debug("Detaching current window: " + currentWindow);
                windowList[currentWindow].style.zIndex = "1";
                windowList[currentWindow].style.opacity = "1";
            }
            var oldid = currentWindow;
            currentWindow = id;
            console.debug("Appending window: " + id);
            $windowList[currentWindow].finish().css("opacity", "0").animate({ opacity: 1 }, animationTime, (function () {
                var ele = document.getElementById(this.oldid);
                if (ele === null) {
                    return;
                }
                if (ele.parentNode !== null) {
                    ele.parentNode.removeChild(ele);
                }
            }).bind({ oldid: oldid }));
            windowList[currentWindow].style.zIndex = "2";
            document.body.appendChild(windowList[currentWindow]);
            UI.Language.updateScreen(windowList[currentWindow]);
        }
        WindowManager.callWindow = callWindow;
        function detachAllWindows() {
            for (var key in windowList) {
                document.body.removeChild(windowList[key]);
            }
        }
        function detachWindow(id) {
            document.body.removeChild(windowList[id]);
        }
        function updateWindowSizes() {
            var stylehtml = "";
            var totalWidth = window.innerWidth;
            var rightSize = 698;
            var leftSize = 35 + 340 + 100;
            var remainingSize = totalWidth - rightSize - leftSize - 20;
            if (remainingSize > 255) {
                remainingSize = 255 + ((remainingSize - 255) * 1 / 2);
            }
            if (remainingSize < 0 || Application.Config.getConfig("fsmode").getValue()) {
                UI.Handles.setAlwaysUp(true);
                leftSize = totalWidth - 120;
                rightSize = leftSize;
                stylehtml += ".rightSideWindow { background-color: rgba(0,0,0,.5);} ";
            }
            else {
                UI.Handles.setAlwaysUp(false);
                leftSize += Math.floor(remainingSize / 85) * 85;
                rightSize = totalWidth - leftSize - 20;
            }
            stylehtml += ".leftSideWindow { width: " + leftSize + "px; }\n.rightSideWindow { width: " + rightSize + "px; }";
            WindowManager.currentLeftSize = leftSize;
            WindowManager.currentRightSize = rightSize;
            if (UI.Handles.isAlwaysUp()) {
                stylehtml += "\n.leftSideWindow { left: 60px; }\n.rightSideWindow { right: 60px; }";
            }
            if (stylehtml !== lastStyleInnerHTML) {
                style.innerHTML = stylehtml;
                lastStyleInnerHTML = stylehtml;
            }
        }
        WindowManager.updateWindowSizes = updateWindowSizes;
        window.addEventListener("resize", function () {
            UI.WindowManager.updateWindowSizes();
        });
    })(WindowManager = UI.WindowManager || (UI.WindowManager = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Logger;
    (function (Logger) {
        var $slider = $(document.getElementById("loggerSlider"));
        var window = document.getElementById("loggerWindow");
        var $window = $(window);
        var currentRoom;
        var acceptedModules;
        var messages;
        var currentLeft;
        var currentRight;
        var messagesToPrint = 3;
        var printTarget = document.getElementById("loggerTarget");
        var checkboxesTarget = document.getElementById("loggerCheckboxes");
        document.getElementById("loggerSubmit").addEventListener("click", function (e) {
            e.preventDefault();
            UI.Logger.submit();
        });
        function callSelf(room) {
            open();
            currentRoom = room;
            messages = currentRoom.getOrderedMessages();
            currentLeft = 0;
            currentRight = messages.length - 1;
            updateSlider();
            updateCheckboxes();
            updateMessages();
        }
        Logger.callSelf = callSelf;
        function filter() {
            var newMessages = [];
            for (var i = currentLeft; i <= currentRight; i++) {
                if (acceptedModules.indexOf(messages[i].module) !== -1) {
                    newMessages.push(messages[i]);
                }
            }
            return newMessages;
        }
        Logger.filter = filter;
        function updateSlider() {
            var min = 0;
            var max = messages.length - 1;
            $slider.slider({
                range: true,
                min: min,
                max: max,
                values: [currentLeft, currentRight],
                slide: function (event, ui) {
                    UI.Logger.setSlider(ui.values[0], ui.values[1]);
                }
            });
        }
        Logger.updateSlider = updateSlider;
        function updateMessages() {
            while (printTarget.firstChild)
                printTarget.removeChild(printTarget.firstChild);
            var filtered = filter();
            if (filtered.length < messagesToPrint * 2) {
                for (var i = 0; i < filtered.length; i++) {
                    var ele = filtered[i].getHTML();
                    if (ele !== null)
                        printTarget.appendChild(ele);
                }
            }
            else {
                for (var i = 0; i <= messagesToPrint; i++) {
                    var ele = filtered[i].getHTML();
                    if (ele !== null)
                        printTarget.appendChild(ele);
                }
                var p = document.createElement("p");
                p.appendChild(document.createTextNode("........"));
                printTarget.appendChild(p);
                for (var i = (filtered.length - 1 - messagesToPrint); i < filtered.length; i++) {
                    var ele = filtered[i].getHTML();
                    if (ele !== null)
                        printTarget.appendChild(ele);
                }
            }
        }
        Logger.updateMessages = updateMessages;
        function updateCheckboxes() {
            while (checkboxesTarget.firstChild)
                checkboxesTarget.removeChild(checkboxesTarget.firstChild);
            var msgTypes = MessageFactory.getMessagetypeArray();
            for (var i = 0; i < msgTypes.length; i++) {
            }
            var msgModules = [];
            for (var i = 0; i < messages.length; i++) {
                if (msgModules.indexOf(messages[i].module) === -1) {
                    msgModules.push(messages[i].module);
                }
            }
            msgModules.sort();
            acceptedModules = [];
            for (var i = 0; i < msgModules.length; i++) {
                acceptedModules.push(msgModules[i]);
                var label = document.createElement("label");
                label.classList.add("loggerLabel");
                var input = document.createElement("input");
                input.type = "checkbox";
                input.checked = true;
                label.appendChild(input);
                label.appendChild(document.createTextNode(msgModules[i]));
                input.addEventListener("change", {
                    input: input,
                    module: msgModules[i],
                    handleEvent: function () {
                        UI.Logger.setModule(this.module, this.input.checked);
                    }
                });
                checkboxesTarget.appendChild(label);
            }
        }
        Logger.updateCheckboxes = updateCheckboxes;
        function setModule(module, acceptable) {
            if (acceptable) {
                if (acceptedModules.indexOf(module) === -1) {
                    acceptedModules.push(module);
                }
            }
            else {
                var pos = acceptedModules.indexOf(module);
                if (pos !== -1) {
                    acceptedModules.splice(pos, 1);
                }
            }
            updateMessages();
        }
        Logger.setModule = setModule;
        function setSlider(left, right) {
            currentLeft = left < 0 ? 0 : left;
            currentRight = right >= messages.length ? messages.length - 1 : right;
            updateMessages();
        }
        Logger.setSlider = setSlider;
        function open() {
            $window.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
        }
        Logger.open = open;
        function close() {
            $window.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
        }
        Logger.close = close;
        var html;
        var js;
        function submit() {
            html = null;
            js = null;
            var cbe = function () { };
            var cbsHTML = function (html) {
                UI.Logger.setHTML(html);
            };
            var cbsJS = function (js) {
                UI.Logger.setJS(js);
            };
            var ajaxHTML = new AJAXConfig(Server.CLIENT_URL + "index.html");
            ajaxHTML.setResponseTypeText();
            ajaxHTML.setTargetLeftWindow();
            Server.AJAX.requestPage(ajaxHTML, cbsHTML, cbe);
            var ajaxJS = new AJAXConfig(Server.CLIENT_URL + "js/Application.js");
            ajaxJS.setResponseTypeText();
            ajaxJS.setTargetLeftWindow();
            Server.AJAX.requestPage(ajaxJS, cbsJS, cbe);
        }
        Logger.submit = submit;
        function setHTML(code) {
            html = code;
            if (js !== null) {
                saveLog();
            }
        }
        Logger.setHTML = setHTML;
        function setJS(code) {
            js = code;
            if (html !== null) {
                saveLog();
            }
        }
        Logger.setJS = setJS;
        function giveMeLog() {
            return currentRoom.getGame().exportAsLog(currentRoom.id, filter());
        }
        Logger.giveMeLog = giveMeLog;
        function saveLog() {
            var log = currentRoom.getGame().exportAsLog(currentRoom.id, filter());
            html = html.replace("//LOGGERTARGET", "UI.Logger.openLog(" + JSON.stringify(log) + ");")
                .replace("href='stylesheets", "href='" + Server.CLIENT_URL + "stylesheets")
                .replace("href='images", "href='" + Server.CLIENT_URL + "images")
                .replace("src='js/lib", "src='" + Server.CLIENT_URL + "js/lib");
            html = html.replace("//LOGGERJSTARGET", js);
            var blob = new Blob([html], { type: "text/plain;charset=utf-8;" });
            var d = new Date();
            var curr_date = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
            var curr_month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
            var curr_year = d.getFullYear();
            var roomName = currentRoom.name;
            var gameName = currentRoom.getGame().getName();
            saveAs(blob, gameName + " - " + roomName + " (" + curr_year + curr_month + curr_date + ").html");
        }
        Logger.saveLog = saveLog;
        function openLog(log) {
            Application.Config.getConfig("chatMaxMessages").storeValue(log['rooms'][0]['messages'].length + 10);
            DB.GameDB.updateFromObject([log], true);
            UI.WindowManager.callWindow(('mainWindow'));
            UI.PageManager.callPage(UI.idHome);
            UI.Chat.callSelf(0, true);
            document.getElementById("leftHandleBar").style.display = "none";
            document.getElementById("rightHandleBar").style.display = "none";
            document.getElementById("chatMessageBox").style.display = "none";
            document.getElementById("chatMessageSendButton").style.display = "none";
            document.getElementById("personaBox").style.display = "none";
            document.getElementById("diceFormBox").style.display = "none";
            document.getElementById("bottomBox").style.display = "none";
            document.getElementById("avatarBox").style.display = "none";
            document.getElementById("avatarUpButton").style.display = "none";
            document.getElementById("avatarDownButton").style.display = "none";
            document.getElementById("chatButtonsBox").style.top = "5px";
            document.getElementById("chatBox").style.top = "5px";
            document.getElementById("chatBox").style.bottom = "5px";
            document.getElementById("chatScrollDown").style.bottom = "15px";
            document.getElementById("leftSideWindow").style.left = "0px";
            document.getElementById("rightSideWindow ").style.right = "0px";
            UI.Chat.scrollToTop();
        }
        Logger.openLog = openLog;
    })(Logger = UI.Logger || (UI.Logger = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Config;
    (function (Config) {
        var error = document.getElementById("configError");
        var success = document.getElementById("configSuccess");
        var timeout = null;
        error.style.display = "none";
        success.style.display = "none";
        document.getElementById("configButton").addEventListener("click", function () { UI.PageManager.callPage(UI.idConfig); });
        document.getElementById("configSave").addEventListener("click", function () {
            UI.Config.saveConfig();
        });
        document.getElementById("configReset").addEventListener("click", function () {
            Application.Config.reset();
        });
        function bindInput(configName, input) {
            Application.Config.getConfig(configName).addChangeListener({
                input: input,
                handleEvent: function (config) {
                    this.input.value = config.getValue().toString();
                }
            });
            input.addEventListener("change", {
                configName: configName,
                input: input,
                handleEvent: function () {
                    var cfg = Application.Config.getConfig(this.configName);
                    cfg.storeValue(this.input.value);
                    this.input.value = cfg.getValue().toString();
                }
            });
            input.value = Application.Config.getConfig(configName).getValue().toString();
        }
        Config.bindInput = bindInput;
        bindInput("chatfontfamily", document.getElementById("configChatFontFamily"));
        bindInput("chatMaxMessages", document.getElementById("configChatMaxMessages"));
        bindInput("chatfontsize", document.getElementById("configChatFontSize"));
        bindInput("chatshowhelp", document.getElementById("configChatShowHelp"));
        bindInput("cleanPersonas", document.getElementById("configCleanPersoas"));
        bindInput("animTime", document.getElementById("configAnimTime"));
        bindInput("autoBGM", document.getElementById("configChatAutoBGM"));
        bindInput("autoSE", document.getElementById("configChatAutoSE"));
        bindInput("autoImage", document.getElementById("configChatAutoImage"));
        bindInput("autoVIDEO", document.getElementById("configChatAutoVideo"));
        bindInput("bgmVolume", document.getElementById("configBGMVolume"));
        bindInput("seVolume", document.getElementById("configSEVolume"));
        function saveConfig() {
            var hide = function () {
                this.finish().fadeOut(Application.Config.getConfig("animTime").getValue());
            };
            var cbs = {
                hide: hide,
                success: success,
                handleEvent: function () {
                    var $success = $(this.success);
                    $success.finish().fadeIn(Application.Config.getConfig("animTime").getValue());
                    UI.Config.setUniqueTimeout(this.hide.bind($success), 5000);
                }
            };
            var cbe = {
                hide: hide,
                error: error,
                handleEvent: function () {
                    var $error = $(this.error);
                    $error.finish().fadeIn(Application.Config.getConfig("animTime").getValue());
                    UI.Config.setUniqueTimeout(this.hide.bind($error), 5000);
                }
            };
            success.style.display = "none";
            error.style.display = "none";
            Application.Config.saveConfig(cbs, cbe);
        }
        Config.saveConfig = saveConfig;
        function setUniqueTimeout(f, t) {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(f, t);
        }
        Config.setUniqueTimeout = setUniqueTimeout;
    })(Config = UI.Config || (UI.Config = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var ChangelogManager;
    (function (ChangelogManager) {
        var currentVersionNode = document.getElementById("changelogCurrentVersion").childNodes[0];
        var externalVersionNode = document.getElementById("changelogActualVersion").childNodes[0];
        var warning = document.getElementById("changelogWarning");
        var target = document.getElementById("changelogTarget");
        function print() {
            empty();
            var localVersion = Changelog.getLocalVersion();
            var externalVersion = Changelog.getExternalVersion();
            if (externalVersion !== null) {
                if (localVersion.toString() === externalVersion.toString()) {
                    warning.style.display = "none";
                }
                else {
                    warning.style.display = "";
                }
                currentVersionNode.nodeValue = localVersion[0] + "." + localVersion[1] + "." + localVersion[2];
                externalVersionNode.nodeValue = externalVersion[0] + "." + externalVersion[1] + "." + externalVersion[2];
            }
            else {
                warning.style.display = "";
                currentVersionNode.nodeValue = localVersion[0] + "." + localVersion[1] + "." + localVersion[2];
                externalVersionNode.nodeValue = "?.?.?";
            }
            var updates = Changelog.getUpdates();
            for (var i = 0; i < updates.length; i++) {
                addOnTop(updates[i].getHTML(false));
            }
            updates = Changelog.getMissingUpdates();
            for (var i = 0; i < updates.length; i++) {
                addOnTop(updates[i].getHTML(true));
            }
        }
        ChangelogManager.print = print;
        function empty() {
            while (target.firstChild !== null) {
                target.removeChild(target.firstChild);
            }
        }
        function addOnTop(ele) {
            if (target.firstChild !== null) {
                target.insertBefore(ele, target.firstChild);
            }
            else {
                target.appendChild(ele);
            }
        }
    })(ChangelogManager = UI.ChangelogManager || (UI.ChangelogManager = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var PageManager;
    (function (PageManager) {
        var $currentLeft = null;
        var $currentRight = null;
        var mainWindow = document.getElementById("mainWindow");
        PageManager.$pages = {};
        function getAnimationTime() {
            return Application.Config.getConfig("animTime").getValue() * 2;
        }
        PageManager.getAnimationTime = getAnimationTime;
        function callPage(id) {
            var animationTime = getAnimationTime();
            var $page = PageManager.$pages[id];
            if ($page === undefined) {
                return console.log("Attempt to call inexistent page at " + id + ". Ignoring.");
            }
            if ($page[0].classList.contains("leftSideWindow")) {
                if (UI.Handles.isAlwaysUp() && $currentRight !== null)
                    closeRightPage();
                if ($currentLeft !== null && $page[0] === $currentLeft[0])
                    return;
                var offLeft = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentLeftSize;
                closeLeftPage();
                $page.finish();
                mainWindow.appendChild($page[0]);
                $page[0].style.left = offLeft + "px";
                $page.animate({
                    left: (UI.Handles.isAlwaysUp() ? 60 : 10)
                }, animationTime, function () {
                    this.style.left = "";
                });
                $currentLeft = $page;
            }
            else {
                if ($currentRight !== null && $page[0] === $currentRight[0])
                    return;
                closeRightPage();
                var offRight = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentRightSize;
                $page.finish();
                mainWindow.appendChild($page[0]);
                $page[0].style.right = offRight + "px";
                $page.animate({
                    right: (UI.Handles.isAlwaysUp() ? 60 : 10)
                }, animationTime, function () {
                    this.style.right = "";
                });
                $currentRight = $page;
            }
            UI.Language.updateScreen($page[0]);
        }
        PageManager.callPage = callPage;
        function closeLeftPage() {
            var offLeft = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentLeftSize;
            var animationTime = getAnimationTime();
            if ($currentLeft !== null) {
                $currentLeft.finish().animate({
                    left: offLeft
                }, animationTime, function () {
                    this.style.left = "";
                    this.parentElement.removeChild(this);
                });
                $currentLeft = null;
            }
        }
        PageManager.closeLeftPage = closeLeftPage;
        function closeRightPage() {
            if ($currentRight === null)
                return;
            var animationTime = getAnimationTime();
            var offRight = (UI.Handles.isAlwaysUp() ? 60 : 10) - UI.WindowManager.currentRightSize;
            $currentRight.finish().animate({
                right: offRight
            }, animationTime, function () {
                this.style.right = "";
                this.parentElement.removeChild(this);
            });
            $currentRight = null;
        }
        PageManager.closeRightPage = closeRightPage;
        ;
        function readWindows() {
            var children = mainWindow.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.getAttribute("id") !== null && (child.classList.contains("leftSideWindow") || child.classList.contains("rightSideWindow"))) {
                    if (child.classList.contains("dontDetach")) {
                        continue;
                    }
                    PageManager.$pages[child.getAttribute("id")] = $(child);
                    mainWindow.removeChild(child);
                }
            }
        }
        PageManager.readWindows = readWindows;
        function getCurrentLeft() {
            if ($currentLeft === null) {
                return null;
            }
            return $currentLeft[0].getAttribute("id");
        }
        PageManager.getCurrentLeft = getCurrentLeft;
    })(PageManager = UI.PageManager || (UI.PageManager = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Images;
    (function (Images) {
        document.getElementById("imagesButton").addEventListener("click", function () { UI.Images.callSelf(); });
        document.getElementById("dropboxImagesButton").addEventListener("click", function () { UI.Images.callDropbox(); });
        var target = document.getElementById("imagesTarget");
        var loadError = document.getElementById("imagesLoadError");
        var saveError = document.getElementById("imagesSaveError");
        target.removeChild(saveError);
        target.removeChild(loadError);
        var autoFolder = null;
        function emptyTarget() {
            while (target.firstChild !== null) {
                target.removeChild(target.lastChild);
            }
        }
        function callSelf() {
            UI.PageManager.callPage(UI.idImages);
            var cbs = { handleEvent: function () {
                    UI.Images.printImages();
                } };
            var cbe = { handleEvent: function (data) {
                    UI.Images.printError(data, true);
                } };
            Server.Storage.requestImages(cbs, cbe);
        }
        Images.callSelf = callSelf;
        function printImages() {
            emptyTarget();
            var images = DB.ImageDB.getImagesByFolder();
            for (var i = 0; i < images.length; i++) {
                var folder = new ImagesFolder(images[i]);
                if (folder.getName() === autoFolder) {
                    folder.open();
                }
                target.appendChild(folder.getHTML());
            }
            autoFolder = null;
        }
        Images.printImages = printImages;
        function stayInFolder(name) {
            autoFolder = name;
        }
        Images.stayInFolder = stayInFolder;
        function printError(data, onLoad) {
            emptyTarget();
            if (onLoad) {
                target.appendChild(loadError);
            }
            else {
                target.appendChild(saveError);
            }
        }
        Images.printError = printError;
        function callDropbox() {
            var options = {
                success: function (files) {
                    UI.Images.addDropbox(files);
                },
                linkType: "preview",
                multiselect: true,
                extensions: ['images'],
            };
            Dropbox.choose(options);
        }
        Images.callDropbox = callDropbox;
        function addDropbox(files) {
            var folders = [];
            var links = [];
            for (var i = 0; i < files.length; i++) {
                var originalName = files[i]['name'].substring(0, files[i]['name'].lastIndexOf('.'));
                ;
                var originalUrl = Server.URL.fixURL(files[i]['link']);
                var name;
                var folderName;
                var hiphenPos = originalName.indexOf("-");
                if (hiphenPos === -1) {
                    folderName = "";
                    name = originalName.trim();
                }
                else {
                    folderName = originalName.substr(0, hiphenPos).trim();
                    name = originalName.substr(hiphenPos + 1, originalName.length - (hiphenPos + 1)).trim();
                }
                var link = new ImageLink(name, originalUrl, folderName);
                links.push(link);
                if (folders.indexOf(folderName) === -1) {
                    folders.push(folderName);
                }
            }
            DB.ImageDB.addImages(links);
            if (folders.length === 1) {
                autoFolder = folders[0];
            }
            else {
                autoFolder = null;
            }
            printImages();
        }
        Images.addDropbox = addDropbox;
    })(Images = UI.Images || (UI.Images = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Loading;
    (function (Loading) {
        var $loadingWindow = $("#loadingWindow").fadeOut(250);
        var loadingCounter = 0;
        Loading.$leftLoader = $("#leftLoading").hide();
        var $rightLoader = $("#rightLoading").hide();
        var leftCounter = 0;
        var rightCounter = 0;
        function stopLoading() {
            if (--loadingCounter <= 0) {
                loadingCounter = 0;
                $loadingWindow.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
            }
        }
        Loading.stopLoading = stopLoading;
        function startLoading() {
            if (++loadingCounter > 0) {
                $loadingWindow.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
            }
        }
        Loading.startLoading = startLoading;
        function blockLeft() {
            if (++leftCounter > 0) {
                Loading.$leftLoader.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
            }
        }
        Loading.blockLeft = blockLeft;
        function blockRight() {
            if (++rightCounter > 0) {
                $rightLoader.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
            }
        }
        Loading.blockRight = blockRight;
        function unblockLeft() {
            if (--leftCounter <= 0) {
                leftCounter = 0;
                Loading.$leftLoader.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
            }
        }
        Loading.unblockLeft = unblockLeft;
        function unblockRight() {
            if (--rightCounter <= 0) {
                rightCounter = 0;
                $rightLoader.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
            }
        }
        Loading.unblockRight = unblockRight;
    })(Loading = UI.Loading || (UI.Loading = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Login;
    (function (Login) {
        document.getElementById("loginForm").addEventListener("submit", function (e) { UI.Login.submitLogin(e); });
        var inputEmail = document.getElementById("loginEmailInput");
        var inputPassword = document.getElementById("loginPasswordInput");
        function resetState() {
            if (Application.Login.hasLastEmail()) {
                inputEmail.value = Application.Login.getLastEmail();
            }
            else {
                inputEmail.value = "";
            }
            inputPassword.value = "";
        }
        Login.resetState = resetState;
        function resetFocus() {
            if (inputEmail.value !== "") {
                inputPassword.focus();
            }
            else {
                inputEmail.focus();
            }
        }
        Login.resetFocus = resetFocus;
        function assumeEmail(email) {
            inputEmail.value = email;
        }
        Login.assumeEmail = assumeEmail;
        function submitLogin(e) {
            e.preventDefault();
            var cbs = {
                handleEvent: function () {
                    if (Application.Login.isLogged()) {
                        UI.WindowManager.callWindow("mainWindow");
                        UI.Login.resetState();
                    }
                    else {
                        alert("Failed login attempt");
                    }
                }
            };
            var cbe = {
                handleEvent: function () {
                    alert("Failed login attempt");
                }
            };
            Application.Login.attemptLogin(inputEmail.value, inputPassword.value, cbs, cbe);
        }
        Login.submitLogin = submitLogin;
        function exposeLoginFailure(e, statusCode) {
            alert("Invalid Login or Error, status: " + statusCode);
        }
        Login.exposeLoginFailure = exposeLoginFailure;
    })(Login = UI.Login || (UI.Login = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Handles;
    (function (Handles) {
        var $leftHandle = $("#leftHandleBar");
        var $leftHandleIcon = $("#leftHandleIcon");
        var $rightHandle = $("#rightHandleBar");
        var $rightHandleIcon = $("#rightHandleIcon");
        var alwaysUp = false;
        $leftHandle[0].addEventListener("mouseenter", function (e) { UI.Handles.mouseIn(this); });
        $rightHandle[0].addEventListener("mouseenter", function (e) { UI.Handles.mouseIn(this); });
        $leftHandle[0].addEventListener("mouseleave", function (e) { UI.Handles.mouseOut(this); });
        $rightHandle[0].addEventListener("mouseleave", function (e) { UI.Handles.mouseOut(this); });
        $leftHandle[0].style.left = "-60px";
        $rightHandle[0].style.right = "-60px";
        function isAlwaysUp() {
            return alwaysUp;
        }
        Handles.isAlwaysUp = isAlwaysUp;
        function mouseIn(handle) {
            if (alwaysUp)
                return;
            var left = $leftHandle[0] === handle;
            var css = {};
            css[left ? "left" : "right"] = "0px";
            if (left) {
                $leftHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
            }
            else {
                $rightHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
            }
        }
        Handles.mouseIn = mouseIn;
        function mouseOut(handle) {
            if (alwaysUp)
                return;
            var left = $leftHandle[0] === handle;
            var css = {};
            css[left ? "left" : "right"] = "-60px";
            if (left) {
                $leftHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
            }
            else {
                $rightHandle.stop().animate(css, Application.Config.getConfig("animTime").getValue() / 2);
            }
        }
        Handles.mouseOut = mouseOut;
        function prepareAlwaysUp() {
            $leftHandleIcon[0].style.display = "none";
            $rightHandleIcon[0].style.display = "none";
            $leftHandle[0].style.left = "0px";
            $rightHandle[0].style.right = "0px";
            $leftHandle[0].style.width = "60px";
            $rightHandle[0].style.width = "60px";
        }
        function prepareNotAlwaysUp() {
            $leftHandleIcon[0].style.display = "";
            $rightHandleIcon[0].style.display = "";
            $leftHandle[0].style.left = "-60px";
            $rightHandle[0].style.right = "-60px";
            $leftHandle[0].style.width = "";
            $rightHandle[0].style.width = "";
        }
        function setAlwaysUp(keepUp) {
            if (keepUp === alwaysUp)
                return;
            if (keepUp) {
                alwaysUp = true;
                prepareAlwaysUp();
            }
            else {
                alwaysUp = false;
                prepareNotAlwaysUp();
            }
        }
        Handles.setAlwaysUp = setAlwaysUp;
        $("#logoutButton").on("click", function () { Server.Login.doLogout(); });
    })(Handles = UI.Handles || (UI.Handles = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Language;
    (function (Language) {
        var currentLanguage = null;
        var flagContainer = document.getElementById("loginFlagContainer");
        var list = LingoList.getLingos();
        var a;
        var clickF = function () {
            localStorage.setItem("lastLanguage", this.ids[0]);
            Application.Config.getConfig("language").storeValue(this.ids[0]);
        };
        for (var i = 0; i < list.length; i++) {
            a = document.createElement("a");
            a.classList.add("flagIcon");
            a.classList.add("icons-flag" + list[i].flagIcon);
            a.classList.add("buttonBehavior");
            a.addEventListener("click", clickF.bind(list[i]));
            a.setAttribute("title", list[i].name);
            flagContainer.appendChild(a);
        }
        delete (list, i, a, clickF);
        Application.Config.registerChangeListener("language", {
            handleEvent: function () {
                var oldLanguage = UI.Language.getLanguage();
                UI.Language.searchLanguage();
                var newLanguage = UI.Language.getLanguage();
                if (oldLanguage !== newLanguage) {
                    UI.Language.updateScreen();
                }
            }
        });
        function getLanguage() {
            return currentLanguage;
        }
        Language.getLanguage = getLanguage;
        function searchLanguage() {
            if (Application.Login.isLogged()) {
                var lingid = Application.Config.getConfig("language").getValue();
                currentLanguage = LingoList.getLingo(lingid);
            }
            else {
                if (localStorage.getItem("lastLanguage") !== null) {
                    currentLanguage = LingoList.getLingo(localStorage.getItem("lastLanguage"));
                }
                else {
                    currentLanguage = LingoList.getLingo(navigator.language);
                }
            }
            localStorage.setItem("lastLanguage", currentLanguage.ids[0]);
        }
        Language.searchLanguage = searchLanguage;
        function updateScreen(target) {
            target = target === undefined ? document : target;
            var elements = target.getElementsByClassName("language");
            for (var i = 0; i < elements.length; i++) {
                updateElement(elements[i]);
            }
        }
        Language.updateScreen = updateScreen;
        function updateElement(element) {
            if (element.dataset['languagenodes'] === undefined) {
                processElement(element);
            }
            if (currentLanguage === null)
                return;
            updateText(element);
        }
        Language.updateElement = updateElement;
        function updateText(element) {
            if (currentLanguage === null)
                return;
            if (element.dataset['languagenodes'] !== "" && element.dataset['languagenodes'] !== undefined) {
                var nodes = element.dataset['languagenodes'].split(";");
                var ids = element.dataset['languagevalues'].split(";");
                for (var i = 0; i < nodes.length; i++) {
                    element.childNodes[parseInt(nodes[i])].nodeValue = currentLanguage.getLingo(ids[i], element.dataset);
                }
            }
            if (element.dataset['valuelingo'] !== undefined) {
                updateInput(element);
            }
            if (element.dataset['placeholderlingo'] !== undefined) {
                updatePlaceholder(element);
            }
            if (element.dataset['titlelingo'] !== undefined) {
                updateTitle(element);
            }
        }
        Language.updateText = updateText;
        function updatePlaceholder(element) {
            element.placeholder = currentLanguage.getLingo(element.dataset['placeholderlingo'], element.dataset);
        }
        function updateInput(element) {
            element.value = currentLanguage.getLingo(element.dataset['valuelingo'], element.dataset);
        }
        function updateTitle(element) {
            element.setAttribute("title", currentLanguage.getLingo(element.dataset['titlelingo'], element.dataset));
        }
        function processElement(element) {
            var ele;
            var languageNodes = [];
            var languageValues = [];
            for (var i = 0; i < element.childNodes.length; i++) {
                ele = element.childNodes[i];
                if (ele.nodeType === Node.TEXT_NODE) {
                    var text = ele.nodeValue.trim();
                    if (text.charAt(0) === "_") {
                        languageNodes.push(i.toString());
                        languageValues.push(text);
                    }
                }
            }
            element.dataset['languagenodes'] = languageNodes.join(";");
            element.dataset['languagevalues'] = languageValues.join(";");
        }
        function addLanguageVariable(element, id, value) {
            element.dataset['language' + id] = value;
        }
        Language.addLanguageVariable = addLanguageVariable;
        function addLanguageValue(element, value) {
            element.dataset['valuelingo'] = value;
        }
        Language.addLanguageValue = addLanguageValue;
        function addLanguagePlaceholder(element, value) {
            element.dataset['placeholderlingo'] = value;
        }
        Language.addLanguagePlaceholder = addLanguagePlaceholder;
        function addLanguageTitle(element, value) {
            element.dataset['titlelingo'] = value;
        }
        Language.addLanguageTitle = addLanguageTitle;
        function markLanguage() {
            var elements = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                elements[_i - 0] = arguments[_i];
            }
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                element.classList.add("language");
                processElement(element);
                updateText(element);
            }
        }
        Language.markLanguage = markLanguage;
    })(Language = UI.Language || (UI.Language = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Sheets;
    (function (Sheets) {
        document.getElementById("sheetsButton").addEventListener("click", function () { UI.Sheets.callSelf(); });
        var sheetList = document.getElementById("sheetWindowSheetList");
        var lastFolder = null;
        var lastGame = null;
        function keepOpen(folder, gameid) {
            lastFolder = folder;
            lastGame = gameid;
        }
        Sheets.keepOpen = keepOpen;
        function keepClosed() {
            lastFolder = null;
            lastGame = null;
        }
        Sheets.keepClosed = keepClosed;
        function callSelf() {
            UI.PageManager.callPage(UI.idSheets);
            Server.Sheets.updateLists({
                handleEvent: function () {
                    UI.Sheets.printSheets();
                }
            });
        }
        Sheets.callSelf = callSelf;
        function empty() {
            while (sheetList.firstChild)
                sheetList.removeChild(sheetList.firstChild);
        }
        function printSheets() {
            empty();
            var games = DB.GameDB.getOrderedGameList();
            for (var k = 0; k < games.length; k++) {
                var game = games[k];
                var wanted = DB.SheetDB.getSheetsByGame(game);
                var sheets = DB.SheetDB.getSheetsByFolder(wanted);
                var gameFolder = document.createElement("div");
                gameFolder.classList.add("sheetListGameContainer");
                gameFolder.classList.add("lightHoverable");
                gameFolder.classList.add("openSheetGame");
                var gameName = document.createElement("p");
                gameName.classList.add("sheetListGameName");
                gameFolder.appendChild(gameName);
                gameName.addEventListener("click", function (e) {
                    e.preventDefault();
                    this.parentElement.classList.toggle("openSheetGame");
                });
                gameName.appendChild(document.createTextNode(game.getName()));
                if (sheets.length > 0) {
                    for (var i = 0; i < sheets.length; i++) {
                        var open = game.getId() === lastGame && sheets[i][0].getFolder() === lastFolder;
                        var sheetFolder = new SheetsFolder(sheets[i], open);
                        gameFolder.appendChild(sheetFolder.getHTML());
                    }
                }
                else {
                    var p = document.createElement("p");
                    p.classList.add("sheetListNoSheet");
                    p.appendChild(document.createTextNode("_SHEETSNOSHEETS_"));
                    UI.Language.markLanguage(p);
                    gameFolder.appendChild(p);
                }
                if (game.getMe().isCreateSheet()) {
                    var p = document.createElement("p");
                    p.classList.add("sheetListNewSheetButton");
                    p.classList.add("textLink");
                    p.classList.add("lightHoverable");
                    p.appendChild(document.createTextNode("> "));
                    p.appendChild(document.createTextNode("_SHEETSNEWSHEET_"));
                    UI.Language.markLanguage(p);
                    gameFolder.appendChild(p);
                    p.addEventListener("click", {
                        game: game,
                        handleEvent: function (e) {
                            e.preventDefault();
                            UI.Sheets.Designer.callSelf(this.game);
                        }
                    });
                }
                sheetList.appendChild(gameFolder);
            }
        }
        Sheets.printSheets = printSheets;
    })(Sheets = UI.Sheets || (UI.Sheets = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Sheets;
    (function (Sheets) {
        var SheetPermissionDesigner;
        (function (SheetPermissionDesigner) {
            var nameTarget = document.getElementById("sheetPermNameTarget");
            var list = document.getElementById("sheetPermList");
            var currentSheet = null;
            var players = null;
            function callSelf(sheet) {
                currentSheet = sheet;
                UI.PageManager.callPage(UI.idSheetPerm);
                var cbs = function (arr) {
                    UI.Sheets.SheetPermissionDesigner.printPlayers(arr);
                };
                var cbe = function () {
                    UI.Sheets.SheetPermissionDesigner.empty();
                };
                Server.Sheets.getSheetPermissions(sheet, cbs, cbe);
                UI.Language.addLanguageVariable(nameTarget, "a", sheet.getName());
                UI.Language.updateElement(nameTarget);
            }
            SheetPermissionDesigner.callSelf = callSelf;
            function empty() {
                while (list.firstChild !== null)
                    list.removeChild(list.firstChild);
            }
            SheetPermissionDesigner.empty = empty;
            function printPlayers(players) {
                empty();
                players.sort(function (a, b) {
                    var na = a['nickname'].toLowerCase();
                    var nb = b['nickname'].toLowerCase();
                    if (na < nb)
                        return -1;
                    if (na > nb)
                        return 1;
                    var na = b['nicknamesufix'].toLowerCase();
                    var nb = b['nicknamesufix'].toLowerCase();
                    if (na < nb)
                        return -1;
                    if (na > nb)
                        return 1;
                    return 0;
                });
                players = [];
                for (var i = 0; i < players.length; i++) {
                    var row = new SheetPermRow(players[i]);
                    players.push(row);
                    list.appendChild(row.getHTML());
                }
            }
            SheetPermissionDesigner.printPlayers = printPlayers;
        })(SheetPermissionDesigner = Sheets.SheetPermissionDesigner || (Sheets.SheetPermissionDesigner = {}));
    })(Sheets = UI.Sheets || (UI.Sheets = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Rooms;
    (function (Rooms) {
        function deleteRoom(room) {
            var cbs = {
                handleEvent: function () {
                    UI.Games.callSelf(false);
                }
            };
            Server.Games.deleteRoom(room.id, cbs, cbs);
        }
        Rooms.deleteRoom = deleteRoom;
    })(Rooms = UI.Rooms || (UI.Rooms = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Rooms;
    (function (Rooms) {
        var Designer;
        (function (Designer) {
            function clear() {
            }
            function fromRoom(room) {
                clear();
                room = room === undefined ? null : room;
                if (room !== null) {
                }
            }
            Designer.fromRoom = fromRoom;
            function toRoom() {
                var room = new Room();
                return room;
            }
            Designer.toRoom = toRoom;
        })(Designer = Rooms.Designer || (Rooms.Designer = {}));
    })(Rooms = UI.Rooms || (UI.Rooms = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Games;
    (function (Games) {
        var gameListTarget = document.getElementById("gameListTarget");
        var nickTarget = document.getElementById("gamesNickTarget");
        Application.Login.addListener({
            handleEvent: function (isLogged) {
                UI.Games.updateNick(isLogged);
            }
        });
        document.getElementById("gamesButton").addEventListener("click", function () {
            UI.Games.callSelf();
        });
        function callSelf(ready) {
            UI.PageManager.callPage(UI.idGames);
            if (ready !== true) {
                Server.Games.updateLists({
                    handleEvent: function () {
                        UI.Games.callSelf(true);
                    }
                });
                return;
            }
            var games = DB.GameDB.getOrderedGameList();
            while (gameListTarget.lastChild !== null)
                gameListTarget.removeChild(gameListTarget.lastChild);
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
                var div = document.createElement("div");
                div.classList.add("mainWindowParagraph");
                div.classList.add("gamesMainDiv");
                var b = document.createElement("b");
                b.appendChild(document.createTextNode(games[i].name));
                b.classList.add("gamesName");
                div.appendChild(b);
                if (games[i].isMyCreation()) {
                    var perm = document.createElement("a");
                    perm.classList.add("gamesOwnerButton");
                    perm.classList.add("textLink");
                    perm.appendChild(document.createTextNode("_GAMESPERMISSIONS_"));
                    perm.style.display = "none";
                    perm.addEventListener("click", {
                        game: games[i],
                        handleEvent: function () {
                        }
                    });
                    var edit = document.createElement("a");
                    edit.classList.add("gamesOwnerButton");
                    edit.classList.add("textLink");
                    edit.appendChild(document.createTextNode("_GAMESEDIT_"));
                    edit.addEventListener("click", {
                        game: games[i],
                        handleEvent: function () {
                        }
                    });
                    edit.style.display = "none";
                    var deleteGame = document.createElement("a");
                    deleteGame.classList.add("gamesOwnerButton");
                    deleteGame.classList.add("textLink");
                    deleteGame.appendChild(document.createTextNode("_GAMESDELETE_"));
                    deleteGame.addEventListener("click", {
                        game: games[i],
                        handleEvent: function () {
                            UI.Games.deleteGame(this.game);
                        }
                    });
                    UI.Language.markLanguage(edit, deleteGame, perm);
                    div.appendChild(deleteGame);
                    div.appendChild(edit);
                    div.appendChild(perm);
                }
                else {
                    var leave = document.createElement("a");
                    leave.classList.add("gamesOwnerButton");
                    leave.classList.add("textLink");
                    leave.appendChild(document.createTextNode("_GAMESLEAVE_"));
                    leave.addEventListener("click", {
                        game: games[i],
                        handleEvent: function () {
                            UI.Games.leaveGame(this.game);
                        }
                    });
                    UI.Language.markLanguage(leave);
                    div.appendChild(leave);
                }
                var creatorDiv = document.createElement("div");
                creatorDiv.classList.add("gameCreatorDiv");
                var creatorTitle = document.createElement("b");
                creatorTitle.appendChild(document.createTextNode("_GAMECREATORTITLE_"));
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
                }
                else {
                    for (var k = 0; k < roomList.length; k++) {
                        var user = roomList[k].getMe();
                        var room = roomList[k];
                        var p = document.createElement("p");
                        p.classList.add("gamesRoomP");
                        var a = document.createElement("a");
                        a.classList.add("textLink");
                        a.classList.add("gameRoomLink");
                        a.addEventListener('click', {
                            roomid: roomList[k].id,
                            handleEvent: function () {
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
                            rDelete.addEventListener("click", {
                                room: room,
                                handleEvent: function () {
                                    UI.Rooms.deleteRoom(this.room);
                                }
                            });
                            p.appendChild(rDelete);
                            var rPerm = document.createElement("a");
                            rPerm.classList.add("textLink");
                            rPerm.classList.add("roomExtraButton");
                            rPerm.appendChild(document.createTextNode("_GAMESROOMPERMISSIONS_"));
                            rPerm.addEventListener("click", {
                                room: room,
                                handleEvent: function () {
                                }
                            });
                            rPerm.style.display = "none";
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
                    p.addEventListener("click", {
                        game: game,
                        handleEvent: function () {
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
                    p.addEventListener("click", {
                        game: game,
                        handleEvent: function () {
                            UI.Games.InviteDesigner.callSelf(this.game);
                        }
                    });
                }
                gameListTarget.appendChild(div);
            }
        }
        Games.callSelf = callSelf;
        ;
        function deleteGame(game) {
            var cbs = {
                handleEvent: function () {
                    UI.Games.callSelf(false);
                }
            };
            Server.Games.deleteGame(game.id, cbs, cbs);
        }
        Games.deleteGame = deleteGame;
        function leaveGame(game) {
            var cbs = {
                handleEvent: function () {
                    UI.Games.callSelf(false);
                }
            };
            Server.Games.leaveGame(game.id, cbs, cbs);
        }
        Games.leaveGame = leaveGame;
        function updateNick(isLogged) {
            if (!isLogged) {
                UI.Language.addLanguageVariable(nickTarget, "a", "Logged out");
            }
            else {
                UI.Language.addLanguageVariable(nickTarget, "a", Application.Login.getUser().getFullNickname());
            }
            UI.Language.updateText(nickTarget);
        }
        Games.updateNick = updateNick;
        ;
    })(Games = UI.Games || (UI.Games = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Games;
    (function (Games) {
        var Invites;
        (function (Invites) {
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
            delete (a);
            document.getElementById("gameInvitesButton").addEventListener("click", function () { UI.Games.Invites.callSelf(); });
            Application.Login.addListener({
                element: document.getElementById("gameInvitesNickTarget"),
                handleEvent: function (isLogged) {
                    if (isLogged) {
                        UI.Language.addLanguageVariable(this.element, "a", Application.Login.getUser().getFullNickname());
                        UI.Language.updateElement(this.element);
                    }
                }
            });
            function callSelf() {
                UI.PageManager.callPage(UI.idGameInvites);
                var cbs = {
                    handleEvent: function (data) {
                        UI.Games.Invites.printInfo(data);
                    }
                };
                var cbe = {
                    handleEvent: function () {
                        UI.Games.Invites.printError();
                    }
                };
                $error.finish().css("opacity", "0");
                Server.Games.getInviteList(cbs, cbe);
            }
            Invites.callSelf = callSelf;
            function empty() {
                while (target.firstChild !== null) {
                    target.removeChild(target.firstChild);
                }
            }
            function printInfo(data) {
                data = data;
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
                }
                else {
                    for (var i = 0; i < data.length; i++) {
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
                        }
                        else {
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
                            id: row['id'],
                            handleEvent: function () {
                                UI.Games.Invites.accept(this.id);
                            }
                        });
                        var reject = document.createElement("a");
                        reject.classList.add("textLink");
                        reject.classList.add("gameInvitesReject");
                        reject.appendChild(document.createTextNode("_GAMEINVITESREJECT_"));
                        UI.Language.markLanguage(reject);
                        reject.addEventListener("click", {
                            id: row['id'],
                            handleEvent: function () {
                                UI.Games.Invites.reject(this.id);
                            }
                        });
                        thirdP.appendChild(accept);
                        thirdP.appendChild(reject);
                        target.appendChild(div);
                    }
                }
            }
            Invites.printInfo = printInfo;
            function accept(id) {
                var onLoaded = {
                    handleEvent: function () {
                        UI.Games.Invites.callSelf();
                    }
                };
                Server.Games.acceptInvite(id, onLoaded, onLoaded);
            }
            Invites.accept = accept;
            function reject(id) {
                var onLoaded = {
                    handleEvent: function () {
                        UI.Games.Invites.callSelf();
                    }
                };
                Server.Games.rejectInvite(id, onLoaded, onLoaded);
            }
            Invites.reject = reject;
            function printError() {
                $error.finish().animate({ opacity: 1 }, Application.Config.getConfig("animTime").getValue() * 2);
            }
            Invites.printError = printError;
        })(Invites = Games.Invites || (Games.Invites = {}));
    })(Games = UI.Games || (UI.Games = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Games;
    (function (Games) {
        var InviteDesigner;
        (function (InviteDesigner) {
            var currentGame = null;
            var gameName = document.getElementById("gameInviteDesignerGameName");
            var form = document.getElementById("gameInviteDesignerForm");
            var nameInput = document.getElementById("gameInviteDesignerName");
            var msgInput = document.getElementById("gameInviteDesignerMessage");
            var err404 = document.getElementById("gameInviteDesigner404");
            var err401 = document.getElementById("gameInviteDesigner401");
            var success = document.getElementById("gameInviteDesigner200");
            InviteDesigner.$msgs = $([err404, err401, success]);
            var $404 = $(err404);
            var $401 = $(err401);
            var $success = $(success);
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                UI.Games.InviteDesigner.submit();
            });
            function callSelf(game) {
                UI.PageManager.callPage(UI.idInviteDesigner);
                UI.Language.addLanguageVariable(gameName, "a", game.name);
                UI.Language.updateElement(gameName);
                currentGame = game;
                InviteDesigner.$msgs.stop().hide();
                nameInput.value = "";
                msgInput.value = "";
            }
            InviteDesigner.callSelf = callSelf;
            function emptyName() {
                nameInput.value = "";
            }
            InviteDesigner.emptyName = emptyName;
            function submit() {
                InviteDesigner.$msgs.stop().hide();
                var cbs = {
                    handleEvent: function () {
                        UI.Games.InviteDesigner.emptyName();
                        UI.Games.InviteDesigner.showMessage(200);
                    }
                };
                var cbe = {
                    handleEvent: function (data, xhr) {
                        if (xhr.status === 409) {
                            UI.Games.InviteDesigner.showMessage(401);
                        }
                        else {
                            UI.Games.InviteDesigner.showMessage(404);
                        }
                    }
                };
                var nick = nameInput.value.split("#");
                if (nick.length !== 2) {
                    showMessage(404);
                    return;
                }
                var message = msgInput.value;
                Server.Games.sendInvite(currentGame.id, nick[0], nick[1], message, cbs, cbe);
            }
            InviteDesigner.submit = submit;
            function showMessage(id) {
                InviteDesigner.$msgs.stop().hide();
                if (id === 200) {
                    $success.fadeIn(Application.Config.getConfig("animTime").getValue());
                }
                else if (id === 401) {
                    $401.fadeIn(Application.Config.getConfig("animTime").getValue());
                }
                else {
                    $404.fadeIn(Application.Config.getConfig("animTime").getValue());
                }
            }
            InviteDesigner.showMessage = showMessage;
        })(InviteDesigner = Games.InviteDesigner || (Games.InviteDesigner = {}));
    })(Games = UI.Games || (UI.Games = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Games;
    (function (Games) {
        var RoomDesigner;
        (function (RoomDesigner) {
            var currentGame = null;
            var currentRoom = null;
            var nameInput = document.getElementById("roomDesignerName");
            var descInput = document.getElementById("roomDesignerMessage");
            var $error = $(document.getElementById("roomDesignerError"));
            document.getElementById("roomDesignerForm").addEventListener("submit", function (e) {
                e.preventDefault();
                UI.Games.RoomDesigner.submit();
            });
            function clear() {
                nameInput.value = "";
                descInput.value = "";
                $error.stop().hide();
            }
            function callSelf(game, room) {
                currentGame = game;
                currentRoom = room === undefined ? null : room;
                clear();
                if (currentRoom !== null) {
                    nameInput.value = currentRoom.name;
                    descInput.value = currentRoom.description;
                }
                UI.PageManager.callPage(UI.idRoomDesigner);
            }
            RoomDesigner.callSelf = callSelf;
            function toRoom() {
                var room;
                if (currentRoom !== null) {
                    room = currentRoom;
                }
                else {
                    room = new Room();
                    room.gameid = currentGame.id;
                }
                room.name = nameInput.value.trim();
                room.description = descInput.value.trim();
                return room;
            }
            RoomDesigner.toRoom = toRoom;
            function submit() {
                var cbs = {
                    handleEvent: function () {
                        UI.Games.callSelf();
                    }
                };
                var cbe = {
                    handleEvent: function () {
                        UI.Games.RoomDesigner.showError();
                    }
                };
                if (currentRoom === null) {
                    Server.Games.createRoom(toRoom(), cbs, cbe);
                }
                else {
                }
            }
            RoomDesigner.submit = submit;
            function showError() {
                $error.fadeIn(Application.Config.getConfig("animTime").getValue());
            }
            RoomDesigner.showError = showError;
        })(RoomDesigner = Games.RoomDesigner || (Games.RoomDesigner = {}));
    })(Games = UI.Games || (UI.Games = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Games;
    (function (Games) {
        var Designer;
        (function (Designer) {
            document.getElementById("gameNewGameButton").addEventListener("click", function (e) {
                e.preventDefault();
                UI.Games.Designer.callSelf();
            });
            var currentGame = null;
            var nameInput = document.getElementById("gameDesignerName");
            var descInput = document.getElementById("gameDesignerMessage");
            var $error = $(document.getElementById("gameDesignerError"));
            document.getElementById("gameDesignerForm").addEventListener("submit", function (e) {
                e.preventDefault();
                UI.Games.Designer.submit();
            });
            function clear() {
                nameInput.value = "";
                descInput.value = "";
                $error.stop().hide();
            }
            function callSelf(game) {
                currentGame = game === undefined ? null : game;
                clear();
                if (currentGame !== null) {
                    nameInput.value = currentGame.name;
                    descInput.value = currentGame.description;
                }
                UI.PageManager.callPage(UI.idGameDesigner);
            }
            Designer.callSelf = callSelf;
            function toGame() {
                var game;
                if (currentGame !== null) {
                    game = currentGame;
                }
                else {
                    game = new Game();
                }
                game.name = nameInput.value.trim();
                game.description = descInput.value.trim();
                return game;
            }
            Designer.toGame = toGame;
            function submit() {
                var cbs = {
                    handleEvent: function () {
                        UI.Games.callSelf();
                    }
                };
                var cbe = {
                    handleEvent: function () {
                        UI.Games.Designer.showError();
                    }
                };
                if (currentGame === null) {
                    Server.Games.createGame(toGame(), cbs, cbe);
                }
                else {
                    Server.Games.editGame(toGame(), cbs, cbe);
                }
            }
            Designer.submit = submit;
            function showError() {
                $error.fadeIn(Application.Config.getConfig("animTime").getValue());
            }
            Designer.showError = showError;
        })(Designer = Games.Designer || (Games.Designer = {}));
    })(Games = UI.Games || (UI.Games = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var SoundController;
    (function (SoundController) {
        var diceSound = document.getElementById("soundDiceRoll");
        var alertSound = document.getElementById("soundAlert");
        var bgmSound = document.getElementById("soundPlayerBGM");
        var seSound = document.getElementById("soundPlayerSE");
        var soundList = document.getElementById("chatSounds");
        var lastURL = null;
        var lastSEURL = null;
        var startedPlaying = false;
        diceSound.parentNode.removeChild(diceSound);
        alertSound.parentNode.removeChild(alertSound);
        bgmSound.parentNode.removeChild(bgmSound);
        seSound.parentNode.removeChild(seSound);
        Application.Config.getConfig("seVolume").addChangeListener(function (e) { UI.SoundController.updateSEVolume(e.getValue()); });
        Application.Config.getConfig("bgmVolume").addChangeListener(function (e) { UI.SoundController.updateBGMVolume(e.getValue()); });
        function updateSEVolume(newVolume) {
            var volume;
            if (newVolume > 100) {
                volume = 1;
            }
            else if (newVolume < 0) {
                volume = 0;
            }
            else {
                volume = (newVolume / 100);
            }
            diceSound.volume = volume;
            alertSound.volume = volume;
            seSound.volume = volume;
        }
        SoundController.updateSEVolume = updateSEVolume;
        function updateBGMVolume(newVolume) {
            var volume;
            if (newVolume > 100) {
                volume = 1;
            }
            else if (newVolume < 0) {
                volume = 0;
            }
            else {
                volume = (newVolume / 100);
            }
            bgmSound.volume = volume;
        }
        SoundController.updateBGMVolume = updateBGMVolume;
        bgmSound.addEventListener("error", function (e) {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATBGMERROR_");
            msg.addText(" ");
            var list = {
                soundList: soundList,
                handleEvent: function () {
                    this.soundList.click();
                }
            };
            msg.addTextLink("_CHATSOUNDADDMORE_", true, list);
            UI.Chat.printElement(msg.getElement());
        });
        seSound.addEventListener("error", function () {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATSEERROR_");
            msg.addText(" ");
            var list = {
                soundList: soundList,
                handleEvent: function () {
                    this.soundList.click();
                }
            };
            msg.addTextLink("_CHATSOUNDADDMORE_", true, list);
            UI.Chat.printElement(msg.getElement());
        });
        function getSoundList() {
            return soundList;
        }
        SoundController.getSoundList = getSoundList;
        function getBGM() {
            return bgmSound;
        }
        SoundController.getBGM = getBGM;
        function playDice() {
            diceSound.currentTime = 0;
            diceSound.play();
        }
        SoundController.playDice = playDice;
        function playAlert() {
            alertSound.currentTime = 0;
            alertSound.play();
        }
        SoundController.playAlert = playAlert;
        bgmSound.addEventListener("canplay", function () {
            if (UI.SoundController.isAutoPlay()) {
                this.play();
            }
        });
        seSound.addEventListener("canplay", function () {
            this.play();
        });
        function isAutoPlay() {
            var r = startedPlaying;
            startedPlaying = false;
            return r;
        }
        SoundController.isAutoPlay = isAutoPlay;
        function playBGM(url) {
            if (lastURL !== null) {
                URL.revokeObjectURL(lastURL);
                lastURL = null;
            }
            startedPlaying = true;
            var found = false;
            var isLink = url.indexOf("://") !== -1;
            if (!isLink) {
                for (var id in soundList.files) {
                    if (soundList.files[id].name === url) {
                        url = URL.createObjectURL(soundList.files[id]);
                        lastURL = url;
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                if (!isLink) {
                    url = "Sounds/" + url;
                }
                else {
                    url = Server.URL.fixURL(url);
                }
            }
            bgmSound.src = url;
        }
        SoundController.playBGM = playBGM;
        function playSE(url) {
            if (lastSEURL !== null) {
                URL.revokeObjectURL(lastSEURL);
                lastSEURL = null;
            }
            var found = false;
            var isLink = url.indexOf("://") !== -1;
            if (!isLink) {
                for (var id in soundList.files) {
                    if (soundList.files[id].name === url) {
                        url = URL.createObjectURL(soundList.files[id]);
                        lastSEURL = url;
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                if (!isLink) {
                    url = "Sounds/" + url;
                }
                else {
                    url = Server.URL.fixURL(url);
                }
            }
            seSound.src = url;
        }
        SoundController.playSE = playSE;
    })(SoundController = UI.SoundController || (UI.SoundController = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var SoundController;
    (function (SoundController) {
        var MusicPlayer;
        (function (MusicPlayer) {
            var bgm = UI.SoundController.getBGM();
            var button = document.getElementById("musicPlayerButton");
            var parent = button.parentNode;
            var container = document.getElementById("musicPlayerContainer");
            var bar = document.getElementById("musicPlayerProgress");
            var playpause = document.getElementById("musicPlayerPlayPause");
            var stop = document.getElementById("musicPlayerStop");
            var repeat = document.getElementById("musicPlayerRepeat");
            var soundListButtonText = document.createTextNode("0");
            document.getElementById("musicPlayerLocal").addEventListener("click", function (e) {
                UI.SoundController.getSoundList().click();
            });
            document.getElementById("musicPlayerLocal").appendChild(soundListButtonText);
            UI.SoundController.getSoundList().addEventListener("change", {
                button: soundListButtonText,
                list: UI.SoundController.getSoundList(),
                handleEvent: function () {
                    this.button.nodeValue = this.list.files.length;
                }
            });
            parent.removeChild(button);
            button.removeChild(container);
            playpause.addEventListener("click", function () {
                var bgm = UI.SoundController.getBGM();
                if (bgm.paused) {
                    bgm.play();
                    this.classList.add("icons-soundPlayerPause");
                    this.classList.remove("icons-soundPlayerPlay");
                }
                else {
                    bgm.pause();
                    this.classList.remove("icons-soundPlayerPause");
                    this.classList.add("icons-soundPlayerPlay");
                }
            });
            stop.addEventListener("click", function () { UI.SoundController.MusicPlayer.stopPlaying(); });
            repeat.addEventListener("click", function () {
                var cfg = Application.Config.getConfig("bgmLoop");
                cfg.storeValue(!cfg.getValue());
            });
            Application.Config.getConfig("bgmLoop").addChangeListener({
                repeat: repeat,
                handleEvent: function (e) {
                    if (e.getValue()) {
                        this.repeat.classList.add("icons-soundPlayerRepeatActive");
                        this.repeat.classList.remove("icons-soundPlayerRepeat");
                    }
                    else {
                        this.repeat.classList.add("icons-soundPlayerRepeat");
                        this.repeat.classList.remove("icons-soundPlayerRepeatActive");
                    }
                }
            });
            bgm.addEventListener("error", function () {
                UI.SoundController.MusicPlayer.stopPlaying();
            });
            bgm.addEventListener("play", {
                playpause: playpause,
                handleEvent: function () {
                    this.playpause.classList.add("icons-soundPlayerPause");
                    this.playpause.classList.remove("icons-soundPlayerPlay");
                }
            });
            bgm.addEventListener("play", function () { UI.SoundController.MusicPlayer.showButton(); });
            var updateSeekerF = function () {
                var time = this.currentTime;
                var duration = this.duration;
                UI.SoundController.MusicPlayer.updateSeeker((time / duration) * 100);
            };
            bgm.addEventListener("timeupdate", updateSeekerF);
            bgm.addEventListener("durationchange", updateSeekerF);
            delete (updateSeekerF);
            bgm.addEventListener("ended", function () {
                var loop = Application.Config.getConfig("bgmLoop").getValue();
                if (loop) {
                    this.currentTime = 0;
                    this.play();
                }
                else {
                    UI.SoundController.MusicPlayer.stopPlaying();
                }
            });
            bar.addEventListener("click", function (e) {
                var offset = $(this).offset();
                var x = e.pageX - offset.left;
                var width = this.clientWidth;
                var bgm = UI.SoundController.getBGM();
                bgm.currentTime = bgm.duration * (x / width);
            });
            button.addEventListener("mouseover", function () { UI.SoundController.MusicPlayer.showContainer(); });
            button.addEventListener("mouseout", function (event) {
                var e = (event.toElement || event.relatedTarget);
                var parent = e;
                while (parent !== null) {
                    if (parent === this) {
                        break;
                    }
                    parent = parent.parentNode;
                }
                if (parent !== null) {
                    return;
                }
                UI.SoundController.MusicPlayer.hideContainer();
            });
            function showContainer() {
                button.appendChild(container);
            }
            MusicPlayer.showContainer = showContainer;
            function hideContainer() {
                if (container.parentNode !== null)
                    button.removeChild(container);
            }
            MusicPlayer.hideContainer = hideContainer;
            function showButton() {
                parent.appendChild(button);
            }
            MusicPlayer.showButton = showButton;
            function hideButton() {
                if (button.parentNode === parent)
                    parent.removeChild(button);
            }
            MusicPlayer.hideButton = hideButton;
            function updateSeeker(perc) {
                bar.value = perc;
            }
            MusicPlayer.updateSeeker = updateSeeker;
            function stopPlaying() {
                hideContainer();
                hideButton();
                bgm.pause();
                bgm.currentTime = 0;
            }
            MusicPlayer.stopPlaying = stopPlaying;
        })(MusicPlayer = SoundController.MusicPlayer || (SoundController.MusicPlayer = {}));
    })(SoundController = UI.SoundController || (UI.SoundController = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Chat;
    (function (Chat) {
        var lastDate = "";
        var chatBox = document.getElementById("chatBox");
        var $chatBox = $(chatBox);
        var $chatBoxScrollDown = $("#chatScrollDown");
        $chatBoxScrollDown[0].style.display = "none";
        var chatHelperss = document.getElementsByClassName("chatInitHelp");
        var chatHelpers = [];
        for (var i = 0; i < chatHelperss.length; i++) {
            chatHelpers.push(chatHelperss[i]);
        }
        delete (i, chatHelperss);
        Application.Config.getConfig("chatfontsize").addChangeListener({
            chatBox: chatBox,
            handleEvent: function () {
                this.chatBox.style.fontSize = Application.Config.getConfig("chatfontsize").getValue() + "px";
                UI.Chat.updateScrollPosition(true);
            }
        });
        chatBox.style.fontSize = Application.Config.getConfig("chatfontsize").getValue() + "px";
        Application.Config.getConfig("chatfontfamily").addChangeListener({
            chatBox: chatBox,
            handleEvent: function () {
                this.chatBox.style.fontFamily = Application.Config.getConfig("chatfontfamily").getValue();
            }
        });
        chatBox.style.fontFamily = Application.Config.getConfig("chatfontfamily").getValue();
        Application.Config.getConfig("chatshowhelp").addChangeListener({
            chatHelpers: chatHelpers,
            handleEvent: function (e) {
                for (var i = 0; i < this.chatHelpers.length; i++) {
                    this.chatHelpers[i].style.display = e.getValue() ? "" : "none";
                }
            }
        });
        var chatTitleNode = document.createTextNode("Title");
        var chatDescriptionNode = document.createTextNode("Description");
        document.getElementById("chatTitle").appendChild(chatTitleNode);
        document.getElementById("chatDescription").appendChild(chatDescriptionNode);
        var chatInfoFloater = new ChatInfo(document.getElementById("chatFloater"));
        var chatTarget = document.getElementById("chatMessages");
        var printingMany = false;
        var lastPrintedId = 0;
        var scrolledDown = true;
        var currentRoom = null;
        var roomTrigger = new Trigger();
        Chat.messageCounter = 0;
        function doAutomation() {
            return !printingMany;
        }
        Chat.doAutomation = doAutomation;
        function callSelf(roomid, log) {
            UI.PageManager.callPage(UI.idChat);
            clearRoom();
            if (log !== true)
                Server.Chat.enterRoom(roomid);
            var room = DB.RoomDB.getRoom(roomid);
            chatTitleNode.nodeValue = room.name;
            chatDescriptionNode.nodeValue = room.description;
            currentRoom = room;
            triggerRoomChanged();
            if (log === true)
                UI.Chat.printMessages(UI.Chat.getRoom().getOrderedMessages(), false);
        }
        Chat.callSelf = callSelf;
        function addRoomChangedListener(listener) {
            roomTrigger.addListener(listener);
        }
        Chat.addRoomChangedListener = addRoomChangedListener;
        function triggerRoomChanged() {
            roomTrigger.trigger(currentRoom);
        }
        function getRoom() {
            return currentRoom;
        }
        Chat.getRoom = getRoom;
        function clearRoom() {
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            lastDate = year + "-" + month + "-" + day;
            var parent = chatTarget.parentNode;
            parent.removeChild(chatTarget);
            while (chatTarget.lastChild !== null) {
                chatTarget.removeChild(chatTarget.lastChild);
            }
            parent.appendChild(chatTarget);
            lastPrintedId = 0;
            Chat.messageCounter = 0;
        }
        Chat.clearRoom = clearRoom;
        function printElement(element, doScroll) {
            chatTarget.appendChild(element);
            Chat.messageCounter++;
            if (doScroll === undefined || doScroll) {
                updateScrollPosition();
            }
            var maxMessages = $.browser.mobile ? Application.Config.getConfig("chatMaxMessages").getDefault() : Application.Config.getConfig("chatMaxMessages").getValue();
            if (Chat.messageCounter > maxMessages) {
                Chat.messageCounter = chatTarget.children.length;
                while (Chat.messageCounter > (maxMessages / 2)) {
                    Chat.messageCounter--;
                    chatTarget.removeChild(chatTarget.firstChild);
                }
                printNotallAtStart();
            }
        }
        Chat.printElement = printElement;
        function printMessage(message, doScroll) {
            var element = message.getHTML();
            if (element !== null) {
                if (message.getDate() !== null && message.getDate() !== lastDate) {
                    lastDate = message.getDate();
                    var msg = new ChatSystemMessage(true);
                    msg.addText("_CHATMESSAGESFROM_");
                    msg.addLangVar("a", lastDate);
                    printElement(msg.getElement());
                }
                chatInfoFloater.bindMessage(message, element);
                printElement(element);
            }
            if (message.id > lastPrintedId) {
                lastPrintedId = message.id;
            }
            message.onPrint();
            if (doScroll === undefined || doScroll) {
                updateScrollPosition();
            }
        }
        Chat.printMessage = printMessage;
        function printMessages(messages, ignoreLowIds) {
            printingMany = true;
            var maxMessages = $.browser.mobile ?
                Application.Config.getConfig("chatMaxMessages").getDefault()
                :
                    Application.Config.getConfig("chatMaxMessages").getValue();
            var i;
            var counting = 0;
            for (i = messages.length - 1; i >= 0; i--) {
                if (messages[i].getHTML() !== null) {
                    if (++counting > (maxMessages - 4)) {
                        break;
                    }
                }
            }
            if (i >= 0) {
                clearRoom();
                if (i > 0) {
                    var msg = new ChatSystemMessage(true);
                    msg.addText("_CHATNOTALLMESSAGES_");
                    printElement(msg.getElement());
                }
            }
            else {
                i = 0;
            }
            var parent = chatTarget.parentNode;
            parent.removeChild(chatTarget);
            while (i < messages.length) {
                if (!messages[i].doNotPrint() && (ignoreLowIds || messages[i].id > lastPrintedId)) {
                    printMessage(messages[i], false);
                }
                i++;
            }
            parent.appendChild(chatTarget);
            printingMany = false;
            updateScrollPosition();
        }
        Chat.printMessages = printMessages;
        function updateScrollPosition(instant) {
            instant = instant === undefined ? true : instant;
            if (scrolledDown) {
                if (instant)
                    chatBox.scrollTop = chatBox.scrollHeight - chatBox.offsetHeight + 10;
                else
                    $chatBox.stop().animate({
                        scrollTop: chatBox.scrollHeight - chatBox.offsetHeight + 10
                    }, Application.Config.getConfig("animTime").getValue());
            }
        }
        Chat.updateScrollPosition = updateScrollPosition;
        function scrollToTop() {
            $chatBox.stop();
            chatBox.scrollTop = 0;
        }
        Chat.scrollToTop = scrollToTop;
        function setScrolledDown(state) {
            if (scrolledDown === state)
                return;
            scrolledDown = state;
            if (scrolledDown) {
                $chatBoxScrollDown.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
            }
            else {
                $chatBoxScrollDown.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
            }
        }
        Chat.setScrolledDown = setScrolledDown;
        function sendMessage(message) {
            if (currentRoom === null) {
                console.warn("[CHAT] Attempt to send messages while not in a room. Ignoring. Offending message:", message);
                return;
            }
            message.roomid = currentRoom.id;
            message.prepareSending();
            printMessage(message);
            Server.Chat.sendMessage(message);
        }
        Chat.sendMessage = sendMessage;
        function getGetAllButton() {
            var getAllForMe = {
                room: currentRoom,
                handleEvent: function () {
                    var cbs = {
                        handleEvent: function () {
                            UI.Chat.clearRoom();
                            UI.Chat.printMessages(UI.Chat.getRoom().getOrderedMessages(), false);
                        }
                    };
                    Server.Chat.getAllMessages(this.room.id, cbs);
                }
            };
            var getAllForMeText = new ChatSystemMessage(true);
            getAllForMeText.addText("_CHATOLDMESSAGESNOTLOADED_");
            getAllForMeText.addText(" ");
            getAllForMeText.addTextLink("_CHATOLDMESSAGESLOAD_", true, getAllForMe);
            return getAllForMeText.getElement();
        }
        Chat.getGetAllButton = getGetAllButton;
        function leave() {
            Server.Chat.end();
            currentRoom = null;
            triggerRoomChanged();
            UI.Games.callSelf();
        }
        Chat.leave = leave;
        function printGetAllButtonAtStart() {
            if (chatTarget.firstChild !== null) {
                var html = getGetAllButton();
                chatTarget.insertBefore(html, chatTarget.firstChild);
            }
            else {
                printGetAllButton();
            }
        }
        Chat.printGetAllButtonAtStart = printGetAllButtonAtStart;
        function printNotallAtStart() {
            var msg = new ChatSystemMessage(true);
            msg.addText("_CHATNOTALLMESSAGES_");
            if (chatTarget.firstChild !== null) {
                chatTarget.insertBefore(msg.getElement(), chatTarget.firstChild);
            }
            else {
                printElement(msg.getElement());
            }
        }
        Chat.printNotallAtStart = printNotallAtStart;
        function printGetAllButton() {
            printElement(getGetAllButton());
        }
        Chat.printGetAllButton = printGetAllButton;
        chatBox.addEventListener("scroll", function (a) {
            var minScroll = this.scrollHeight - this.offsetHeight - 10;
            var currentScroll = this.scrollTop;
            UI.Chat.setScrolledDown(currentScroll >= minScroll);
        });
        $chatBoxScrollDown[0].addEventListener("click", function () {
            UI.Chat.setScrolledDown(true);
            UI.Chat.updateScrollPosition(false);
        });
        clearRoom();
        for (var i = 0; i < 1; i++) {
            var messages = MessageFactory.createTestingMessages();
            printMessages(messages, true);
            delete (messages);
            DB.MessageDB.releaseAllLocalMessages();
        }
        delete (i);
        var chatButton = document.getElementById("openChatButton");
        chatButton.style.display = "none";
        chatButton.addEventListener("click", function () {
            UI.PageManager.callPage(UI.idChat);
            UI.Chat.updateScrollPosition(true);
        });
        addRoomChangedListener({
            button: chatButton,
            handleEvent: function (room) {
                if (room === null) {
                    this.button.style.display = "none";
                }
                else {
                    this.button.style.display = "";
                }
            }
        });
    })(Chat = UI.Chat || (UI.Chat = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Chat;
    (function (Chat) {
        var Avatar;
        (function (Avatar) {
            var avatarBox = document.getElementById("avatarBox");
            var $avatarBox = $(avatarBox);
            while (avatarBox.firstChild !== null)
                avatarBox.removeChild(avatarBox.firstChild);
            var height = 80;
            var upButton = document.getElementById("avatarUpButton");
            upButton.addEventListener("click", function () { UI.Chat.Avatar.moveScroll(-1); });
            var downButton = document.getElementById("avatarDownButton");
            downButton.addEventListener("click", function () { UI.Chat.Avatar.moveScroll(1); });
            var avatars = {};
            function getMe() {
                return avatars[Application.Login.getUser().id];
            }
            Avatar.getMe = getMe;
            function resetForConnect() {
                for (var id in avatars) {
                    avatars[id].reset();
                }
            }
            Avatar.resetForConnect = resetForConnect;
            function moveScroll(direction) {
                $avatarBox.finish();
                var currentHeight = avatarBox.scrollHeight;
                var currentScroll = avatarBox.scrollTop;
                var change = direction * height;
                if ((currentScroll + change) <= 0) {
                    upButton.classList.add("inactive");
                }
                else {
                    upButton.classList.remove("inactive");
                }
                if ((currentScroll + height + change) >= currentHeight) {
                    downButton.classList.add("inactive");
                }
                else {
                    downButton.classList.remove("inactive");
                }
                $avatarBox.animate({
                    scrollTop: (currentScroll + change) + "px"
                });
            }
            Avatar.moveScroll = moveScroll;
            function updatePosition() {
                var currentHeight = avatarBox.scrollHeight;
                var currentScroll = avatarBox.scrollTop;
                if (currentHeight <= height) {
                    avatarBox.scrollTop = 0;
                }
                else if (currentHeight <= (currentScroll + height)) {
                    avatarBox.scrollTop = currentHeight - height;
                }
                if (avatarBox.scrollTop === 0) {
                    upButton.classList.add("inactive");
                }
                else {
                    upButton.classList.remove("inactive");
                }
                if ((avatarBox.scrollTop + height) === currentHeight) {
                    downButton.classList.add("inactive");
                }
                else {
                    downButton.classList.remove("inactive");
                }
            }
            Avatar.updatePosition = updatePosition;
            function updateFromObject(obj, cleanup) {
                var cleanedup = [];
                for (var i = 0; i < obj.length; i++) {
                    if (avatars[obj[i]['id']] === undefined) {
                        avatars[obj[i]['id']] = new ChatAvatar();
                        avatarBox.appendChild(avatars[obj[i]['id']].getHTML());
                    }
                    avatars[obj[i]['id']].updateFromObject(obj[i]);
                    if (avatars[obj[i]['id']].isChangedOnline()) {
                        var msg = new ChatSystemMessage(true);
                        msg.addText(avatars[obj[i]['id']].getUser().getFullNickname() + " ");
                        if (avatars[obj[i]['id']].online) {
                            msg.addText("_CHATHASCONNECTED_");
                        }
                        else {
                            msg.addText("_CHATHASDISCONNECTED_");
                        }
                        UI.Chat.printElement(msg.getElement(), false);
                    }
                    cleanedup.push(obj[i]['id'].toString());
                }
                UI.Chat.updateScrollPosition(true);
                if (cleanup) {
                    for (var id in avatars) {
                        if (cleanedup.indexOf(id.toString()) === -1) {
                            avatarBox.removeChild(avatars[id].getHTML());
                            delete (avatars[id]);
                        }
                    }
                }
                updatePosition();
            }
            Avatar.updateFromObject = updateFromObject;
        })(Avatar = Chat.Avatar || (Chat.Avatar = {}));
    })(Chat = UI.Chat || (UI.Chat = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Chat;
    (function (Chat) {
        var Forms;
        (function (Forms) {
            var formState = new ChatFormState(document.getElementById("chatMessageStateIcon"));
            var formInput = document.getElementById("chatMessageInput");
            var diceTower = document.getElementById("chatDiceTower");
            diceTower.addEventListener("click", function () {
                if (this.classList.contains("icons-chatDiceTowerOn")) {
                    this.classList.remove("icons-chatDiceTowerOn");
                    this.classList.add("icons-chatDiceTower");
                }
                else {
                    this.classList.add("icons-chatDiceTowerOn");
                    this.classList.remove("icons-chatDiceTower");
                }
            });
            var diceForm = document.getElementById("diceFormBox");
            diceForm.addEventListener("submit", function (e) {
                UI.Chat.Forms.rollDice();
                e.preventDefault();
            });
            var diceAmount = document.getElementById("chatDiceAmount");
            var diceFaces = document.getElementById("chatDiceFaces");
            var diceMod = document.getElementById("chatDiceMod");
            var diceReason = document.getElementById("chatDiceReason");
            document.getElementById("chatMessageSendButton");
            var typing = false;
            var afk = false;
            var focused = true;
            var inputKeyHandler = function (e) { UI.Chat.Forms.handleInputKeyboard(e); };
            formInput.addEventListener("keyup", inputKeyHandler);
            formInput.addEventListener("keydown", inputKeyHandler);
            formInput.addEventListener("keydown", function (e) { UI.Chat.Forms.handleInputKeypress(e); });
            delete (inputKeyHandler);
            var lastWhisperFrom = null;
            addOnReady("ChatForms", "Dependency to same-level Module (UI.Chat.PersonaManager)", {
                handleEvent: function () {
                    UI.Chat.PersonaManager.addListener({
                        handleEvent: function (name, avatar) {
                            UI.Chat.Forms.updateFormState(name !== null);
                        }
                    });
                }
            });
            var olderTexts = [];
            var oldTextPosition = -1;
            function addOlderText() {
                var trimmed = formInput.value.trim();
                if (trimmed !== "") {
                    oldTextPosition = olderTexts.push(trimmed);
                }
            }
            Forms.addOlderText = addOlderText;
            function moveOlderText(direction) {
                if (oldTextPosition === olderTexts.length) {
                    var oldPos = oldTextPosition;
                    addOlderText();
                    oldTextPosition = oldPos;
                }
                oldTextPosition += direction;
                if (oldTextPosition < 0) {
                    oldTextPosition = 0;
                    if (olderTexts.length > 0)
                        formInput.value = olderTexts[oldTextPosition];
                }
                else if (oldTextPosition >= olderTexts.length) {
                    oldTextPosition = olderTexts.length;
                    formInput.value = "";
                }
                else {
                    formInput.value = olderTexts[oldTextPosition];
                }
            }
            Forms.moveOlderText = moveOlderText;
            function updateFormState(hasPersona) {
                if (hasPersona) {
                    formState.setState(ChatFormState.STATE_NORMAL);
                }
                else {
                    var room = UI.Chat.getRoom();
                    if (room !== null && room.getMe().isStoryteller()) {
                        formState.setState(ChatFormState.STATE_STORY);
                    }
                    else {
                        formState.setState(ChatFormState.STATE_OFF);
                    }
                }
            }
            Forms.updateFormState = updateFormState;
            function handleInputKeyboard(e) {
                setTyping(formInput.value !== "");
                if (e.shiftKey) {
                    formState.setState(ChatFormState.STATE_STORY);
                }
                else if (e.ctrlKey) {
                    if (UI.Chat.PersonaManager.getPersonaName() !== null) {
                        formState.setState(ChatFormState.STATE_ACTION);
                    }
                    else {
                        var room = UI.Chat.getRoom();
                        if (room !== null && room.getMe().isStoryteller()) {
                            formState.setState(ChatFormState.STATE_STORY);
                        }
                        else {
                            formState.setState(ChatFormState.STATE_OFF);
                        }
                    }
                }
                else if (e.altKey) {
                    formState.setState(ChatFormState.STATE_OFF);
                }
                else {
                    if (UI.Chat.PersonaManager.getPersonaName() !== null) {
                        formState.setState(ChatFormState.STATE_NORMAL);
                    }
                    else {
                        var room = UI.Chat.getRoom();
                        if (room !== null && room.getMe().isStoryteller()) {
                            formState.setState(ChatFormState.STATE_STORY);
                        }
                        else {
                            formState.setState(ChatFormState.STATE_OFF);
                        }
                    }
                }
                if (e.keyCode === 18) {
                    e.preventDefault();
                }
            }
            Forms.handleInputKeyboard = handleInputKeyboard;
            function handleInputKeypress(e) {
                if (e.keyCode === 9) {
                    if (formInput.value === "") {
                        if (e.shiftKey) {
                            diceReason.focus();
                        }
                        else {
                            diceAmount.focus();
                        }
                    }
                    e.preventDefault();
                }
                if (e.keyCode === 10 || e.keyCode === 13) {
                    UI.Chat.Forms.sendMessage();
                    e.preventDefault();
                    return;
                }
                if (e.keyCode === 38) {
                    UI.Chat.Forms.moveOlderText(-1);
                    e.preventDefault();
                    return;
                }
                if (e.keyCode === 40) {
                    UI.Chat.Forms.moveOlderText(1);
                    e.preventDefault();
                    return;
                }
                if (e.keyCode === 27) {
                    e.preventDefault();
                    return;
                }
                var trimmed = formInput.value.trim();
                if (e.keyCode === 9) {
                    if (MessageFactory.getConstructorFromText(trimmed) === MessageWhisper) {
                        var room = UI.Chat.getRoom();
                        if (room !== null) {
                            var index = trimmed.indexOf(',');
                            var index2 = trimmed.indexOf(" ");
                            if (index2 === -1) {
                                var target = "";
                                var message = "";
                            }
                            else {
                                if (index !== -1) {
                                    var target = trimmed.substr(index2 + 1, (index - index2 - 1)).trim();
                                    var message = trimmed.substr(index + 1).trim();
                                }
                                else {
                                    var target = trimmed.substr(index2 + 1).trim();
                                    var message = "";
                                }
                            }
                            var users = room.getUsersByName(target);
                            if (users.length === 1) {
                                setInput("/whisper " + users[0].getUniqueNickname() + ", " + message);
                            }
                            else {
                                var error = new ChatSystemMessage(true);
                                if (users.length === 0) {
                                    error.addText("_CHATWHISPERNOTARGETSFOUND_");
                                    error.addLangVar("a", target);
                                }
                                else {
                                    var clickF = function () {
                                        UI.Chat.Forms.setInput("/whisper " + this.target + ", " + this.message);
                                    };
                                    error.addText("_CHATMULTIPLETARGETSFOUND_");
                                    error.addText(": ");
                                    for (var i = 0; i < users.length; i++) {
                                        var listener = {
                                            target: users[i].getUniqueNickname(),
                                            message: message,
                                            handleEvent: clickF
                                        };
                                        error.addTextLink(users[i].getUniqueNickname(), false, listener);
                                        if ((i + 1) < users.length) {
                                            error.addText(", ");
                                        }
                                        else {
                                            error.addText(".");
                                        }
                                    }
                                }
                                UI.Chat.printElement(error.getElement());
                            }
                        }
                    }
                }
                if (e.keyCode === 9 || e.keyCode === 32) {
                    if (lastWhisperFrom !== null && MessageFactory.getConstructorFromText(trimmed) === SlashReply) {
                        setInput("/whisper " + lastWhisperFrom.getUniqueNickname() + ", ");
                    }
                }
            }
            Forms.handleInputKeypress = handleInputKeypress;
            function sendMessage() {
                var trimmed = formInput.value.trim();
                if (trimmed === "") {
                    var emptyMessage = new ChatSystemMessage(true);
                    emptyMessage.addText("_CHATEMPTYNOTALLOWED_");
                    UI.Chat.printElement(emptyMessage.getElement(), true);
                }
                else {
                    addOlderText();
                    var message = null;
                    if (trimmed.charAt(0) === "/") {
                        message = MessageFactory.createFromText(trimmed);
                    }
                    else {
                        if (formState.isNormal()) {
                            message = new MessageRoleplay();
                            message.receiveCommand("", trimmed);
                        }
                        else if (formState.isStory()) {
                            message = new MessageStory();
                            message.receiveCommand("/story", trimmed);
                        }
                        else if (formState.isAction()) {
                            message = new MessageAction();
                            message.receiveCommand("/me", trimmed);
                        }
                        else if (formState.isOff()) {
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
            Forms.sendMessage = sendMessage;
            function isTyping() {
                return typing;
            }
            Forms.isTyping = isTyping;
            function isFocused() {
                return focused;
            }
            Forms.isFocused = isFocused;
            function isAfk() {
                return afk;
            }
            Forms.isAfk = isAfk;
            function setTyping(newTyping) {
                if (typing !== newTyping) {
                    typing = newTyping;
                    sendStatus();
                }
            }
            Forms.setTyping = setTyping;
            function setFocused(newFocused) {
                if (focused !== newFocused) {
                    focused = newFocused;
                    sendStatus();
                }
            }
            Forms.setFocused = setFocused;
            function setAfk(newAfk) {
                if (afk !== newAfk) {
                    afk = newAfk;
                    sendStatus();
                }
            }
            Forms.setAfk = setAfk;
            function sendStatus() {
                Server.Chat.sendStatus({
                    afk: afk,
                    focused: focused,
                    typing: typing,
                    avatar: null,
                    persona: null
                });
            }
            function considerRedirecting(event) {
                if ((!event.ctrlKey && !event.altKey) || (event.ctrlKey && event.keyCode === 86)) {
                    if (UI.PageManager.getCurrentLeft() === UI.idChat) {
                        var focus = document.activeElement;
                        var focusTag = focus.tagName.toLowerCase();
                        if (focusTag !== "input" && focusTag !== "textarea" && focusTag !== "select") {
                            formInput.focus();
                        }
                    }
                }
            }
            Forms.considerRedirecting = considerRedirecting;
            function rollDice(faces) {
                var amount = parseInt(diceAmount.value);
                faces = faces === undefined ? parseInt(diceFaces.value) : faces;
                var mod = parseInt(diceMod.value);
                var reason = diceReason.value.trim();
                if (isNaN(amount))
                    amount = 1;
                if (isNaN(faces))
                    faces = 6;
                if (isNaN(mod))
                    mod = 0;
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
            Forms.rollDice = rollDice;
            function setInput(str) {
                formInput.value = str;
                formInput.focus();
            }
            Forms.setInput = setInput;
            function setLastWhisperFrom(user) {
                lastWhisperFrom = user;
            }
            Forms.setLastWhisperFrom = setLastWhisperFrom;
            document.addEventListener("keypress", function (e) {
                UI.Chat.Forms.considerRedirecting(e);
            });
            document.addEventListener("keydown", function (e) {
                if (e.ctrlKey && e.keyCode === 86) {
                    UI.Chat.Forms.considerRedirecting(e);
                }
            });
            document.addEventListener("keydown", function (e) {
                if (e.which === 8 && !$(e.target).is("input, textarea")) {
                    e.preventDefault();
                }
            });
            window.addEventListener("focus", function () { UI.Chat.Forms.setFocused(true); });
            window.addEventListener("blur", function () { UI.Chat.Forms.setFocused(false); });
            $(window).idle({
                onIdle: function () {
                    UI.Chat.Forms.setAfk(true);
                },
                onActive: function () {
                    UI.Chat.Forms.setAfk(false);
                },
                events: "mouseover mouseout click keypress mousedown mousemove blur focus",
                idle: 30000
            });
            var dices = [4, 6, 8, 10, 12, 20, 100];
            for (var i = 0; i < dices.length; i++) {
                document.getElementById("chatDiceD" + dices[i]).addEventListener("click", {
                    dice: dices[i],
                    handleEvent: function () {
                        UI.Chat.Forms.rollDice(this.dice);
                    }
                });
            }
            delete (dices, i);
        })(Forms = Chat.Forms || (Chat.Forms = {}));
    })(Chat = UI.Chat || (UI.Chat = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Chat;
    (function (Chat) {
        var Notification;
        (function (Notification) {
            var bar = document.getElementById("chatNotificationBar");
            while (bar.firstChild !== null)
                bar.removeChild(bar.firstChild);
            var reconnecting = new ChatNotificationIcon("icons-chatNotReconnecting", false);
            bar.appendChild(reconnecting.getElement());
            var disconnected = new ChatNotificationIcon("icons-chatNotDisconnected", true);
            disconnected.addText("_CHATDISCONNECTEDEXP_");
            bar.appendChild(disconnected.getElement());
            var icons = 0;
            function showReconnecting() {
                if (reconnecting.show()) {
                    icons++;
                    updateIcons();
                }
                hideDisconnected();
            }
            Notification.showReconnecting = showReconnecting;
            function hideReconnecting() {
                if (reconnecting.hide()) {
                    icons--;
                    updateIcons();
                }
            }
            Notification.hideReconnecting = hideReconnecting;
            function hideDisconnected() {
                if (disconnected.hide()) {
                    icons--;
                    updateIcons();
                }
            }
            Notification.hideDisconnected = hideDisconnected;
            function showDisconnected() {
                if (disconnected.show()) {
                    icons++;
                    updateIcons();
                }
                hideReconnecting();
            }
            Notification.showDisconnected = showDisconnected;
            function updateIcons() {
                if (icons === 0) {
                    bar.classList.remove("activeIcon");
                }
                else {
                    bar.classList.add("activeIcon");
                }
            }
        })(Notification = Chat.Notification || (Chat.Notification = {}));
    })(Chat = UI.Chat || (UI.Chat = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Chat;
    (function (Chat) {
        var PersonaManager;
        (function (PersonaManager) {
            var personaBox = document.getElementById("personaContainer");
            while (personaBox.firstChild !== null)
                personaBox.removeChild(personaBox.lastChild);
            var currentElement = null;
            var currentPersonaName = null;
            var currentPersonaAvatar = null;
            var changeTrigger = new Trigger();
            var personaShortcuts = {};
            var personaShortcutLastUsage = [];
            var currentRoom = null;
            UI.Chat.addRoomChangedListener({
                handleEvent: function (e) {
                    UI.Chat.PersonaManager.setRoom(e);
                }
            });
            function setRoom(room) {
                currentRoom = room;
                clearPersonas();
            }
            PersonaManager.setRoom = setRoom;
            function clearPersonas() {
                while (personaBox.firstChild !== null)
                    personaBox.removeChild(personaBox.firstChild);
                currentPersonaAvatar = null;
                currentPersonaName = null;
                currentElement = null;
                personaShortcutLastUsage = [];
                personaShortcuts = {};
            }
            function clearPersona(name, avatar) {
                if (personaShortcuts[name + ";" + avatar] !== undefined) {
                    personaShortcutLastUsage.splice(personaShortcutLastUsage.indexOf(personaShortcuts[name + ";" + avatar]), 1);
                    personaBox.removeChild(personaShortcuts[name + ";" + avatar]);
                    if (currentElement === personaShortcuts[name + ";" + avatar]) {
                        unsetPersona();
                    }
                    delete (personaShortcuts[name + ";" + avatar]);
                }
                else {
                    console.debug("[PERSONAMANAGER] Attempt to remove unknown persona: " + name + ";" + avatar);
                }
            }
            PersonaManager.clearPersona = clearPersona;
            function getRoom() {
                return currentRoom;
            }
            PersonaManager.getRoom = getRoom;
            function createPersonaButton(name, avatar) {
                var ele = document.createElement("div");
                ele.classList.add("personaButton");
                name = name.trim();
                avatar = avatar === null ? null : avatar.trim();
                var handler = {
                    name: name,
                    avatar: avatar,
                    element: ele,
                    handleEvent: function (e) {
                        UI.Chat.PersonaManager.setPersona(this.name, this.avatar, this.element);
                    }
                };
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
            function createAndUsePersona(name, avatar) {
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
            PersonaManager.createAndUsePersona = createAndUsePersona;
            function addListener(listener) {
                changeTrigger.addListener(listener);
            }
            PersonaManager.addListener = addListener;
            function triggerListeners() {
                changeTrigger.trigger(currentPersonaName, currentPersonaAvatar);
                if (Server.Chat.isConnected()) {
                    Server.Chat.sendPersona({
                        persona: currentPersonaName,
                        avatar: currentPersonaAvatar
                    });
                }
            }
            function setPersona(name, avatar, element) {
                if (currentElement !== null)
                    currentElement.classList.remove("active");
                var oldName = currentPersonaName;
                var oldAvatar = currentPersonaAvatar;
                if (currentElement === element) {
                    currentElement = null;
                    currentPersonaAvatar = null;
                    currentPersonaName = null;
                }
                else {
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
            PersonaManager.setPersona = setPersona;
            function getPersonaName() {
                return currentPersonaName;
            }
            PersonaManager.getPersonaName = getPersonaName;
            function getPersonaAvatar() {
                return currentPersonaAvatar;
            }
            PersonaManager.getPersonaAvatar = getPersonaAvatar;
            function unsetPersona() {
                setPersona(null, null, currentElement);
            }
            PersonaManager.unsetPersona = unsetPersona;
        })(PersonaManager = Chat.PersonaManager || (Chat.PersonaManager = {}));
    })(Chat = UI.Chat || (UI.Chat = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Chat;
    (function (Chat) {
        var PersonaDesigner;
        (function (PersonaDesigner) {
            var $designerBox = $(document.getElementById("personaDesignerBox")).hide();
            var target = document.getElementById("personaDesignerHolder");
            document.getElementById("personaAddButton").addEventListener("click", function () { UI.Chat.PersonaDesigner.callSelf(); });
            document.getElementById("personaDesignerCloseButton").addEventListener("click", function () { UI.Chat.PersonaDesigner.close(); });
            var open = false;
            var currentRoom = null;
            var personaName = document.getElementById("personaDesignerNameInput");
            var personaAvatar = document.getElementById("personaDesignerAvatarInput");
            var personaChoices = {};
            var lastMemory = [];
            UI.Chat.addRoomChangedListener({
                handleEvent: function (e) {
                    UI.Chat.PersonaDesigner.setRoom(e);
                }
            });
            document.getElementById("personaDesignerForm").addEventListener("submit", function (e) {
                UI.Chat.PersonaDesigner.createPersona();
                e.preventDefault();
            });
            function callSelf() {
                $designerBox.fadeIn(Application.Config.getConfig("animTime").getValue());
                open = true;
                setRoom(UI.Chat.getRoom());
            }
            PersonaDesigner.callSelf = callSelf;
            function close() {
                $designerBox.fadeOut(Application.Config.getConfig("animTime").getValue(), function () {
                    UI.Chat.PersonaDesigner.emptyOut();
                });
                open = false;
            }
            PersonaDesigner.close = close;
            function setRoom(room) {
                currentRoom = room;
                if (open) {
                    fillOut();
                }
            }
            PersonaDesigner.setRoom = setRoom;
            function fillOut() {
                emptyOut();
                loadMemory();
                for (var i = 0; i < lastMemory.length; i++) {
                    createPersona(lastMemory[i].name, lastMemory[i].avatar);
                }
            }
            PersonaDesigner.fillOut = fillOut;
            function emptyOut() {
                while (target.firstChild !== null)
                    target.removeChild(target.firstChild);
                personaChoices = {};
            }
            PersonaDesigner.emptyOut = emptyOut;
            function createPersona(name, avatar) {
                var name = name === undefined ? personaName.value.trim() : name;
                var avatar = avatar === undefined ? personaAvatar.value.trim() : avatar;
                personaName.value = "";
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
                        name: choice.nameStr,
                        avatar: choice.avatarStr
                    });
                    saveMemory();
                }
            }
            PersonaDesigner.createPersona = createPersona;
            function removeChoice(choice) {
                if (personaChoices[choice.id] !== undefined) {
                    target.removeChild(personaChoices[choice.id].getHTML());
                    delete (personaChoices[choice.id]);
                    lastMemory = [];
                    for (var id in personaChoices) {
                        lastMemory.push({
                            name: personaChoices[id].nameStr,
                            avatar: personaChoices[id].avatarStr
                        });
                    }
                    saveMemory();
                    UI.Chat.PersonaManager.clearPersona(choice.nameStr, choice.avatarStr);
                }
            }
            PersonaDesigner.removeChoice = removeChoice;
            function usePersona(name, avatar) {
                close();
                UI.Chat.PersonaManager.createAndUsePersona(name, avatar);
            }
            PersonaDesigner.usePersona = usePersona;
            function getMemoryString() {
                if (currentRoom === null) {
                    console.warn("[PERSONADESIGNER] Attempt to get memory string for null room.");
                    return "personaDesigner_0";
                }
                else {
                    return "personaDesigner_" + currentRoom.id;
                }
            }
            function loadMemory() {
                lastMemory = Application.LocalMemory.getMemory(getMemoryString(), []);
            }
            function saveMemory() {
                lastMemory.sort(function (a, b) {
                    var na = a.name.toLowerCase().latinise();
                    var nb = b.name.toLowerCase().latinise();
                    if (na < nb)
                        return -1;
                    if (nb < na)
                        return 1;
                    return 0;
                });
                Application.LocalMemory.setMemory(getMemoryString(), lastMemory);
            }
        })(PersonaDesigner = Chat.PersonaDesigner || (Chat.PersonaDesigner = {}));
    })(Chat = UI.Chat || (UI.Chat = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Pica;
    (function (Pica) {
        var $pictureWindow = $(document.getElementById("pictureWindow"));
        var $loadingWindow = $(document.getElementById("pictureLoading"));
        var pica = new PicaContainer(document.getElementById("pictureWindow"));
        function getPica() {
            return pica;
        }
        Pica.getPica = getPica;
        function loadImage(url) {
            pica.loadImage(url);
            callSelf();
        }
        Pica.loadImage = loadImage;
        function callSelf() {
            $pictureWindow.stop().animate({
                opacity: 1
            }, Application.Config.getConfig("animTime").getValue());
            $pictureWindow[0].style.pointerEvents = "auto";
        }
        Pica.callSelf = callSelf;
        function close() {
            $pictureWindow.stop().animate({
                opacity: 0
            }, Application.Config.getConfig("animTime").getValue());
            $pictureWindow[0].style.pointerEvents = "none";
        }
        Pica.close = close;
        function startLoading() {
            $loadingWindow.stop().fadeIn(Application.Config.getConfig("animTime").getValue());
        }
        Pica.startLoading = startLoading;
        function stopLoading() {
            $loadingWindow.stop().fadeOut(Application.Config.getConfig("animTime").getValue());
        }
        Pica.stopLoading = stopLoading;
    })(Pica = UI.Pica || (UI.Pica = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Sounds;
    (function (Sounds) {
        document.getElementById("soundsButton").addEventListener("click", function () { UI.Sounds.callSelf(); });
        document.getElementById("dropboxSoundsButton").addEventListener("click", function () { UI.Sounds.callDropbox(); });
        var bgmInput = document.getElementById("dropboxSoundsIsBGM");
        var target = document.getElementById("soundsTarget");
        var loadError = document.getElementById("soundsLoadError");
        var saveError = document.getElementById("soundsSaveError");
        target.removeChild(saveError);
        target.removeChild(loadError);
        var autoFolder = null;
        function emptyTarget() {
            while (target.firstChild !== null) {
                target.removeChild(target.lastChild);
            }
        }
        function callSelf() {
            UI.PageManager.callPage(UI.idSounds);
            var cbs = { handleEvent: function () {
                    UI.Sounds.printSounds();
                } };
            var cbe = { handleEvent: function (data) {
                    UI.Sounds.printError(data, true);
                } };
            Server.Storage.requestSounds(cbs, cbe);
        }
        Sounds.callSelf = callSelf;
        function printSounds() {
            emptyTarget();
            var sounds = DB.SoundDB.getSoundsByFolder();
            for (var i = 0; i < sounds.length; i++) {
                var folder = new SoundsFolder(sounds[i]);
                if (folder.getName() === autoFolder) {
                    folder.open();
                }
                target.appendChild(folder.getHTML());
            }
            autoFolder = null;
        }
        Sounds.printSounds = printSounds;
        function stayInFolder(name) {
            autoFolder = name;
        }
        Sounds.stayInFolder = stayInFolder;
        function printError(data, onLoad) {
            emptyTarget();
            if (onLoad) {
                target.appendChild(loadError);
            }
            else {
                target.appendChild(saveError);
            }
        }
        Sounds.printError = printError;
        function callDropbox() {
            var options = {
                success: function (files) {
                    UI.Sounds.addDropbox(files);
                },
                linkType: "preview",
                multiselect: true,
                extensions: ['.MP3', '.MP4', '.M4A', '.AAC', '.OGG', '.WAV', '.WAVE', '.OPUS'],
            };
            Dropbox.choose(options);
        }
        Sounds.callDropbox = callDropbox;
        function addDropbox(files) {
            var folders = [];
            var links = [];
            for (var i = 0; i < files.length; i++) {
                var originalName = files[i]['name'].substring(0, files[i]['name'].lastIndexOf('.'));
                ;
                var originalUrl = Server.URL.fixURL(files[i]['link']);
                var name;
                var folderName;
                var hiphenPos = originalName.indexOf("-");
                if (hiphenPos === -1) {
                    folderName = "";
                    name = originalName.trim();
                }
                else {
                    folderName = originalName.substr(0, hiphenPos).trim();
                    name = originalName.substr(hiphenPos + 1, originalName.length - (hiphenPos + 1)).trim();
                }
                var link = new SoundLink(name, originalUrl, folderName, bgmInput.checked);
                links.push(link);
                if (folders.indexOf(folderName) === -1) {
                    folders.push(folderName);
                }
            }
            DB.SoundDB.addSounds(links);
            if (folders.length === 1) {
                autoFolder = folders[0];
            }
            else {
                autoFolder = null;
            }
            printSounds();
        }
        Sounds.addDropbox = addDropbox;
    })(Sounds = UI.Sounds || (UI.Sounds = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Styles;
    (function (Styles) {
        document.getElementById("sheetsStyleButton").addEventListener("click", function () { UI.Styles.callSelf(); });
        var target = document.getElementById("styleListTarget");
        function callSelf() {
            UI.PageManager.callPage(UI.idStyles);
            var cbs = {
                handleEvent: function (styles) {
                    UI.Styles.printStyles(styles);
                }
            };
            Server.Sheets.updateStyles(cbs);
        }
        Styles.callSelf = callSelf;
        function emptyTarget() {
            while (target.firstChild)
                target.removeChild(target.firstChild);
        }
        Styles.emptyTarget = emptyTarget;
        function printStyles(styles) {
            emptyTarget();
            for (var i = 0; i < styles.length; i++) {
                var p = document.createElement("p");
                p.classList.add("mainWindowParagraph");
                p.classList.add("hoverable");
                p.classList.add("textLink");
                p.appendChild(document.createTextNode(styles[i].name));
                p.addEventListener("click", {
                    id: styles[i].id,
                    handleEvent: function () {
                        UI.Styles.open(this.id);
                    }
                });
                target.appendChild(p);
            }
        }
        Styles.printStyles = printStyles;
        function open(id) {
        }
        Styles.open = open;
    })(Styles = UI.Styles || (UI.Styles = {}));
})(UI || (UI = {}));
var Server;
(function (Server) {
    Server.IMAGE_URL = "http://img.redpg.com.br/";
    Server.APPLICATION_URL = "http://app.redpg.com.br/service/";
    Server.CLIENT_URL = "http://beta.redpg.com.br/";
    Server.WEBSOCKET_SERVERURL = "ws://app.redpg.com.br";
    Server.WEBSOCKET_CONTEXT = "/service/";
    Server.WEBSOCKET_PORTS = [80, 8080, 8081];
    Application.Config.registerConfiguration("wsPort", new WsportConfiguration(Server.WEBSOCKET_PORTS[0]));
    function getWebsocketURL() {
        return Server.WEBSOCKET_SERVERURL + ":" + Application.Config.getConfig("wsPort").getValue() + Server.WEBSOCKET_CONTEXT;
    }
    Server.getWebsocketURL = getWebsocketURL;
})(Server || (Server = {}));
var Server;
(function (Server) {
    var AJAX;
    (function (AJAX) {
        function requestPage(ajax, success, error) {
            var url = ajax.url;
            if (url.indexOf("://") === -1) {
                url = Server.APPLICATION_URL + url;
                if (Application.Login.hasSession()) {
                    url += ';jsessionid=' + Application.Login.getSession();
                }
            }
            var xhr = new XMLHttpRequest();
            var method = ajax.data !== null ? "POST" : "GET";
            xhr.open(method, url, true);
            xhr.responseType = ajax.responseType;
            xhr.addEventListener("loadend", {
                ajax: ajax,
                handleEvent: function (e) {
                    console.debug("AJAX request for " + this.ajax.url + " is complete.");
                    this.ajax.finishConditionalLoading();
                }
            });
            xhr.addEventListener("load", {
                xhr: xhr,
                ajax: ajax,
                success: success,
                error: error,
                handleEvent: function (e) {
                    if (this.xhr.status >= 200 && this.xhr.status < 300) {
                        console.debug("[SUCCESS " + this.xhr.status + "]: AJAX (" + this.ajax.url + ")...", this.xhr);
                        if (typeof this.success === 'function') {
                            this.success(this.xhr.response, this.xhr);
                        }
                        else {
                            this.success.handleEvent(this.xhr.response, this.xhr);
                        }
                    }
                    else {
                        console.error("[ERROR " + this.xhr.status + "]: AJAX (" + this.ajax.url + ")...", this.xhr);
                        if (this.xhr.status === 401) {
                            Server.Login.requestSession(false);
                        }
                        if (typeof this.error === 'function') {
                            this.error(this.xhr.response, this.xhr);
                        }
                        else {
                            this.error.handleEvent(this.xhr.response, this.xhr);
                        }
                    }
                }
            });
            xhr.addEventListener("error", {
                xhr: xhr,
                ajax: ajax,
                error: error,
                handleEvent: function (e) {
                    console.error("[ERROR] AJAX call for " + this.ajax.url + " resulted in network error. Event, XHR:", e, this.xhr);
                    if (typeof this.error === 'function') {
                        this.error(this.xhr.response, this.xhr);
                    }
                    else {
                        this.error.handleEvent(this.xhr.response, this.xhr);
                    }
                }
            });
            ajax.startConditionalLoading();
            if (ajax.data !== null) {
                var data = {};
                for (var key in ajax.data) {
                    if (typeof ajax.data[key] === "number" || typeof ajax.data[key] === "string") {
                        data[key] = ajax.data[key];
                    }
                    else {
                        data[key] = JSON.stringify(ajax.data[key]);
                    }
                }
                console.debug("Ajax request for " + url + " includes Data. Data:", data);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(data));
            }
            else {
                xhr.send();
            }
        }
        AJAX.requestPage = requestPage;
    })(AJAX = Server.AJAX || (Server.AJAX = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var Config;
    (function (Config) {
        var CONFIG_URL = "Account";
        function saveConfig(config, cbs, cbe) {
            var ajax = new AJAXConfig(CONFIG_URL);
            ajax.setData("action", "StoreConfig");
            ajax.setData("config", config);
            ajax.setTargetLeftWindow();
            ajax.setResponseTypeJSON();
            var success = {
                cbs: cbs,
                handleEvent: function (response, xhr) {
                    if (this.cbs !== null) {
                        if (typeof this.cbs === "function") {
                            this.cbs(response, xhr);
                        }
                        else {
                            this.cbs.handleEvent(response, xhr);
                        }
                    }
                }
            };
            var error = {
                cbe: cbe,
                handleEvent: function (response, xhr) {
                    if (this.cbe !== null) {
                        if (typeof this.cbe === "function") {
                            this.cbe(response, xhr);
                        }
                        else {
                            this.cbe.handleEvent(response, xhr);
                        }
                    }
                }
            };
            Server.AJAX.requestPage(ajax, success, error);
        }
        Config.saveConfig = saveConfig;
    })(Config = Server.Config || (Server.Config = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var Login;
    (function (Login) {
        var ACCOUNT_URL = "Account";
        function requestSession(silent, cbs, cbe) {
            var success = {
                cbs: cbs,
                cbe: cbe,
                handleEvent: function (response, xhr) {
                    if (response.user !== undefined || response.logged === true) {
                        if (response.user !== undefined) {
                            Application.Login.receiveLogin(response.user, response.session);
                            if (response.user.config !== undefined) {
                                Application.Config.updateFromObject(response.user.config);
                            }
                        }
                        else {
                            Application.Login.updateSessionLife();
                        }
                        if (this.cbs !== undefined) {
                            this.cbs.handleEvent(response, xhr);
                        }
                    }
                    else {
                        Application.Login.logout();
                        if (this.cbe !== undefined)
                            this.cbe.handleEvent(response, xhr);
                    }
                }
            };
            var error = {
                cbe: cbe,
                handleEvent: function (response, xhr) {
                    Application.Login.logout();
                    if (this.cbe !== undefined) {
                        this.cbe.handleEvent(response, xhr);
                    }
                }
            };
            var ajax = new AJAXConfig(ACCOUNT_URL);
            ajax.setResponseTypeJSON();
            if (silent) {
                ajax.data = { action: "requestSession" };
                ajax.setTargetNone();
            }
            else {
                ajax.data = { action: "login" };
                ajax.setTargetGlobal();
            }
            Server.AJAX.requestPage(ajax, success, error);
        }
        Login.requestSession = requestSession;
        function doLogin(email, password, cbs, cbe) {
            var success = {
                cbs: cbs,
                handleEvent: function (response, xhr) {
                    Application.Login.receiveLogin(response.user, response.session);
                    if (response.user !== undefined && response.user.config !== undefined) {
                        Application.Config.updateFromObject(response.user.config);
                    }
                    if (this.cbs !== undefined) {
                        this.cbs.handleEvent(response, xhr);
                    }
                }
            };
            var ajax = new AJAXConfig(ACCOUNT_URL);
            ajax.data = {
                login: email,
                password: password,
                action: "login"
            };
            ajax.setResponseTypeJSON();
            ajax.setTargetGlobal();
            Server.AJAX.requestPage(ajax, success, cbe);
        }
        Login.doLogin = doLogin;
        function doLogout(cbs, cbe) {
            var success = {
                cbs: cbs,
                handleEvent: function (response, xhr) {
                    Application.Login.logout();
                    if (this.cbs !== undefined) {
                        this.cbs.handleEvent(response, xhr);
                    }
                }
            };
            var error = {
                cbe: cbe,
                handleEvent: function (response, xhr) {
                    console.error("[ERROR] Failure while attempting to logout.");
                    if (this.cbe !== undefined) {
                        this.cbe.handleEvent(response, xhr);
                    }
                }
            };
            var ajax = new AJAXConfig(ACCOUNT_URL);
            ajax.data = { action: "logout" };
            ajax.setResponseTypeJSON();
            ajax.setTargetGlobal();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Login.doLogout = doLogout;
    })(Login = Server.Login || (Server.Login = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var Images;
    (function (Images) {
        var IMAGES_URL = "Image";
        var emptyCallback = function () { };
        function getImages(cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(IMAGES_URL);
            ajax.setResponseTypeJSON();
            ajax.data = { action: "list" };
            ajax.setTargetRightWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Images.getImages = getImages;
    })(Images = Server.Images || (Server.Images = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var Games;
    (function (Games) {
        var GAMES_URL = "Game";
        var INVITE_URL = "Invite";
        var ROOMS_URL = "Room";
        var emptyCallback = { handleEvent: function () { } };
        function updateLists(cbs, cbe) {
            var success = {
                cbs: cbs,
                handleEvent: function (response, xhr) {
                    DB.GameDB.updateFromObject(response, true);
                    if (this.cbs !== undefined)
                        this.cbs.handleEvent(response, xhr);
                }
            };
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(GAMES_URL);
            ajax.setResponseTypeJSON();
            ajax.data = { action: "list" };
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.updateLists = updateLists;
        function createRoom(room, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(ROOMS_URL);
            ajax.setResponseTypeJSON();
            ajax.data = room.exportAsNewRoom();
            ajax.setData("action", "create");
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.createRoom = createRoom;
        function createGame(game, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(GAMES_URL);
            ajax.setResponseTypeJSON();
            ajax.data = game.exportAsObject();
            ajax.setData("action", "create");
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.createGame = createGame;
        function editGame(game, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(GAMES_URL);
            ajax.setResponseTypeJSON();
            ajax.data = game.exportAsObject();
            ajax.setData("action", "edit");
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.editGame = editGame;
        function getInviteList(cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(INVITE_URL);
            ajax.setResponseTypeJSON();
            ajax.data = { action: "list" };
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.getInviteList = getInviteList;
        function sendInvite(gameid, nickname, nicknamesufix, message, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(INVITE_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "send");
            ajax.setData("gameid", gameid.toString());
            ajax.setData("nickname", nickname);
            ajax.setData("nicksufix", nicknamesufix);
            if (message !== "") {
                ajax.setData("message", message);
            }
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.sendInvite = sendInvite;
        function acceptInvite(gameid, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(INVITE_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "accept");
            ajax.setData("gameid", gameid.toString());
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.acceptInvite = acceptInvite;
        function rejectInvite(gameid, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(INVITE_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "reject");
            ajax.setData("gameid", gameid.toString());
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.rejectInvite = rejectInvite;
        function leaveGame(gameid, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(GAMES_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "leave");
            ajax.setData("id", gameid.toString());
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.leaveGame = leaveGame;
        function deleteGame(gameid, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(GAMES_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "delete");
            ajax.setData("id", gameid.toString());
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.deleteGame = deleteGame;
        function deleteRoom(roomid, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(ROOMS_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "delete");
            ajax.setData("id", roomid.toString());
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.deleteRoom = deleteRoom;
        function getPrivileges(gameid, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(GAMES_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "privileges");
            ajax.setData("id", gameid.toString());
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.getPrivileges = getPrivileges;
        function setPrivileges(gameid, cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(GAMES_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "setPrivileges");
            ajax.setData("privileges", "permissions");
            ajax.setData("id", gameid.toString());
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Games.setPrivileges = setPrivileges;
    })(Games = Server.Games || (Server.Games = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var URL;
    (function (URL) {
        function fixURL(url) {
            url = url.trim();
            if (url.indexOf("://") === -1) {
                url = "http://" + url;
            }
            if (url.indexOf("www.dropbox.com") !== -1) {
                url = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
                var interr = url.lastIndexOf("?dl");
                if (interr !== -1) {
                    url = url.substr(0, interr);
                }
            }
            return url;
        }
        URL.fixURL = fixURL;
    })(URL = Server.URL || (Server.URL = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var Chat;
    (function (Chat) {
        var ROOM_URL = "Room";
        Chat.CHAT_URL = "Chat";
        var emptyCallback = { handleEvent: function () { } };
        var socketController = new ChatWsController();
        var pollingController;
        Chat.currentController = socketController;
        var currentRoom = null;
        var openListener = undefined;
        var errorListener = undefined;
        var messageTrigger = new Trigger();
        var personaTrigger = new Trigger();
        var statusTrigger = new Trigger();
        var disconnectTrigger = new Trigger();
        var personaInfo = {
            afk: false,
            focused: true,
            typing: false,
            persona: null,
            avatar: null
        };
        var reconnecting = false;
        var reconnectAttempts = 0;
        var maxReconnectAttempts = 5;
        Application.Login.addListener(function (isLogged) {
            if (!isLogged) {
                Server.Chat.end();
            }
        });
        function isReconnecting() {
            return reconnecting;
        }
        Chat.isReconnecting = isReconnecting;
        function setConnected() {
            reconnectAttempts = 0;
            reconnecting = false;
            UI.Chat.Notification.hideDisconnected();
            UI.Chat.Notification.hideReconnecting();
        }
        Chat.setConnected = setConnected;
        function giveUpReconnect() {
            var reconnectPls = {
                room: currentRoom,
                handleEvent: function () {
                    Server.Chat.enterRoom(this.room.id);
                }
            };
            var reconnectForMe = new ChatSystemMessage(true);
            reconnectForMe.addText("_CHATYOUAREDISCONNECTED_");
            reconnectForMe.addText(" ");
            reconnectForMe.addTextLink("_CHATDISCONNECTEDRECONNECT_", true, reconnectPls);
            UI.Chat.printElement(reconnectForMe.getElement(), true);
            UI.Chat.Notification.hideReconnecting();
            UI.Chat.Notification.showDisconnected();
        }
        Chat.giveUpReconnect = giveUpReconnect;
        function reconnect() {
            if (currentRoom === null) {
                return;
            }
            UI.Chat.Notification.showReconnecting();
            if (reconnectAttempts++ <= maxReconnectAttempts && Application.Login.isLogged()) {
                reconnecting = true;
                enterRoom(currentRoom.id);
            }
            else {
                giveUpReconnect();
            }
        }
        Chat.reconnect = reconnect;
        function leaveRoom() {
            currentRoom = null;
            reconnecting = false;
            Chat.currentController.end();
        }
        Chat.leaveRoom = leaveRoom;
        function enterRoom(roomid) {
            currentRoom = DB.RoomDB.getRoom(roomid);
            if (currentRoom === null) {
                console.error("[CHAT] Entering an unknown room at id " + roomid + ". Risky business.");
            }
            UI.Chat.Notification.showReconnecting();
            if (Chat.currentController.isReady()) {
                Chat.currentController.enterRoom(roomid);
            }
            else {
                Chat.currentController.onReady = {
                    controller: Chat.currentController,
                    roomid: roomid,
                    handleEvent: function () {
                        this.controller.enterRoom(this.roomid);
                    }
                };
                Chat.currentController.start();
            }
        }
        Chat.enterRoom = enterRoom;
        function sendStatus(info) {
            if (Chat.currentController.isReady()) {
                Chat.currentController.sendStatus(info);
            }
        }
        Chat.sendStatus = sendStatus;
        function sendPersona(info) {
            if (Chat.currentController.isReady()) {
                Chat.currentController.sendPersona(info);
            }
            else {
                console.debug("[CHAT] Attempt to send Persona while disconnected. Ignoring.", info);
            }
        }
        Chat.sendPersona = sendPersona;
        function isConnected() {
            return Chat.currentController.isReady();
        }
        Chat.isConnected = isConnected;
        function sendMessage(message) {
            if (Chat.currentController.isReady()) {
                Chat.currentController.sendMessage(message);
                message.roomid = currentRoom.id;
            }
            else {
                console.warn("[CHAT] Attempt to send messages while disconnected. Ignoring. Offending Message:", message);
            }
        }
        Chat.sendMessage = sendMessage;
        function saveMemory(memory) {
            if (Chat.currentController.isReady()) {
                Chat.currentController.saveMemory(memory);
            }
            else {
                console.warn("[CHAT] Attempt to save memory while disconnected. Ignoring. Offending Memory:", memory);
            }
        }
        Chat.saveMemory = saveMemory;
        function hasRoom() {
            return currentRoom !== null;
        }
        Chat.hasRoom = hasRoom;
        function getRoom() {
            return currentRoom;
        }
        Chat.getRoom = getRoom;
        function getAllMessages(roomid, cbs, cbe) {
            if (!DB.RoomDB.hasRoom(roomid)) {
                console.warn("[CHAT] Attempted to load messages for undefined room.");
                if (cbe !== undefined)
                    cbe.handleEvent();
                return;
            }
            var success = {
                roomid: roomid,
                cbs: cbs,
                handleEvent: function (response, xhr) {
                    DB.RoomDB.getRoom(this.roomid).updateFromObject({ messages: response }, true);
                    if (this.cbs !== undefined)
                        this.cbs.handleEvent(response, xhr);
                }
            };
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(ROOM_URL);
            ajax.setResponseTypeJSON();
            ajax.data = { action: "messages", roomid: roomid };
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Chat.getAllMessages = getAllMessages;
        function end() {
            currentRoom = null;
            Chat.currentController.end();
        }
        Chat.end = end;
        function addStatusListener(f) {
            statusTrigger.addListener(f);
        }
        Chat.addStatusListener = addStatusListener;
        function triggerStatus(info) {
            statusTrigger.trigger(info);
        }
        Chat.triggerStatus = triggerStatus;
        function addPersonaListener(f) {
            personaTrigger.addListener(f);
        }
        Chat.addPersonaListener = addPersonaListener;
        function triggerPersona(f) {
            personaTrigger.trigger(f);
        }
        Chat.triggerPersona = triggerPersona;
        function addMessageListener(f) {
            messageTrigger.addListener(f);
        }
        Chat.addMessageListener = addMessageListener;
        function triggerMessage(f) {
            messageTrigger.trigger(f);
        }
        Chat.triggerMessage = triggerMessage;
        (function () {
            var getRoom = {
                handleEvent: function (e) {
                    var room = Server.Chat.getRoom();
                    var users = [];
                    for (var id in e[1]) {
                        e[1][id]['id'] = id;
                        users.push(e[1][id]);
                    }
                    UI.Chat.Avatar.resetForConnect();
                    room.updateFromObject({ users: users }, true);
                    Server.Chat.Memory.updateFromObject(e[2]);
                    room.updateFromObject({ messages: e[3] }, false);
                    if (!Server.Chat.isReconnecting()) {
                        UI.Chat.clearRoom();
                        UI.Chat.printGetAllButton();
                    }
                    Server.Chat.setConnected();
                    UI.Chat.Avatar.updateFromObject(users, true);
                    UI.Chat.printMessages(room.getOrderedMessages(), false);
                }
            };
            socketController.addMessageListener("getroom", getRoom);
            var status = {
                handleEvent: function (array) {
                    var info = {
                        id: array[1],
                        typing: array[2] === 1,
                        idle: array[3] === 1,
                        focused: array[4] === 1
                    };
                    UI.Chat.Avatar.updateFromObject([info], false);
                    Server.Chat.triggerStatus(info);
                }
            };
            socketController.addMessageListener("status", status);
            var persona = {
                handleEvent: function (array) {
                    var info = {
                        id: array[1],
                        persona: array[2]['persona'] === undefined ? null : array[2]['persona'],
                        avatar: array[2]['avatar'] === undefined ? null : array[2]['avatar'],
                    };
                    UI.Chat.Avatar.updateFromObject([info], false);
                    Server.Chat.triggerPersona(info);
                }
            };
            socketController.addMessageListener("persona", persona);
            var left = {
                handleEvent: function (array) {
                    var info = {
                        id: array[1],
                        online: false
                    };
                    UI.Chat.Avatar.updateFromObject([info], false);
                }
            };
            socketController.addMessageListener("left", left);
            var joined = {
                handleEvent: function (array) {
                    array[1].roomid = currentRoom.id;
                    DB.UserDB.updateFromObject([array[1]]);
                    UI.Chat.Avatar.updateFromObject([array[1]], false);
                }
            };
            socketController.addMessageListener("joined", joined);
            var message = {
                handleEvent: function (array) {
                    Server.Chat.getRoom().updateFromObject({ messages: [array[1]] }, false);
                    var message = DB.MessageDB.getMessage(array[1]['id']);
                    if (message.localid === null) {
                        UI.Chat.printMessage(message);
                    }
                    Server.Chat.triggerMessage(message);
                }
            };
            socketController.addMessageListener("message", message);
            var memory = {
                handleEvent: function (array) {
                    Server.Chat.Memory.updateFromObject(array[2]);
                }
            };
            socketController.addMessageListener("memory", memory);
            var reconnectF = {
                handleEvent: function () {
                    Server.Chat.reconnect();
                }
            };
            socketController.addCloseListener(reconnectF);
        })();
    })(Chat = Server.Chat || (Server.Chat = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var Chat;
    (function (Chat) {
        var Memory;
        (function (Memory) {
            var configList = {};
            var readableConfigList = {};
            var changeTrigger = new Trigger();
            Memory.version = 2;
            function addChangeListener(f) {
                changeTrigger.addListener(f);
            }
            Memory.addChangeListener = addChangeListener;
            function getConfig(id) {
                return configList[id];
            }
            Memory.getConfig = getConfig;
            function registerChangeListener(id, listener) {
                if (configList[id] === undefined) {
                    console.warn("[RoomMemory] Attempt to register a listener to unregistered configuration at " + id + ". Offending listener:", listener);
                    return;
                }
                configList[id].addChangeListener(listener);
            }
            Memory.registerChangeListener = registerChangeListener;
            function getConfiguration(name) {
                if (typeof readableConfigList[name] !== "undefined") {
                    return readableConfigList[name];
                }
                console.warn("[RoomMemory] Attempt to retrieve invalid memory " + name + ", returning", null);
                return null;
            }
            Memory.getConfiguration = getConfiguration;
            function registerConfiguration(id, name, config) {
                if (configList[id] !== undefined) {
                    console.warn("[RoomMemory] Attempt to overwrite registered Configuration at " + id + ". Offending configuration:", config);
                    return;
                }
                configList[id] = config;
                config.addChangeListener({
                    trigger: changeTrigger,
                    id: id,
                    handleEvent: function (memo) {
                        this.trigger.trigger(memo, id);
                        console.debug("[RoomMemory] Global change triggered by " + id + ".");
                    }
                });
                readableConfigList[name] = config;
            }
            Memory.registerConfiguration = registerConfiguration;
            function exportAsObject() {
                var result = {};
                for (var key in configList) {
                    var val = configList[key].exportAsObject();
                    if (val !== null) {
                        result[key] = val;
                    }
                }
                return result;
            }
            Memory.exportAsObject = exportAsObject;
            function updateFromObject(obj) {
                for (var key in configList) {
                    if (obj[key] === undefined) {
                        configList[key].reset();
                    }
                    else {
                        configList[key].storeValue(obj[key]);
                    }
                }
                console.debug("[RoomMemory] Updated values from:", obj);
            }
            Memory.updateFromObject = updateFromObject;
            function saveMemory() {
                var room = Server.Chat.getRoom();
                if (room !== null) {
                    var user = room.getMe();
                    if (user.isStoryteller()) {
                        var memoryString = JSON.stringify(exportAsObject());
                        console.debug("[RoomMemory] Memory string: " + memoryString);
                        Server.Chat.saveMemory(memoryString);
                    }
                }
            }
            Memory.saveMemory = saveMemory;
        })(Memory = Chat.Memory || (Chat.Memory = {}));
    })(Chat = Server.Chat || (Server.Chat = {}));
})(Server || (Server = {}));
Server.Chat.Memory.registerConfiguration("c", "Combat", new MemoryCombat());
Server.Chat.Memory.registerConfiguration("v", "Version", new MemoryVersion());
Server.Chat.Memory.registerConfiguration("p", "Pica", new MemoryPica());
var Server;
(function (Server) {
    var Storage;
    (function (Storage) {
        var STORAGE_URL = "Storage";
        var validStorage = ["sounds", "images", "custom1", "custom2"];
        var IMAGES_ID = "images";
        var SOUNDS_ID = "sounds";
        var ACTION_RESTORE = "restore";
        var ACTION_STORE = "store";
        var emptyCallback = { handleEvent: function () { } };
        function requestImages(cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            success = {
                success: success,
                handleEvent: function (data) {
                    DB.ImageDB.updateFromObject(data);
                    this.success.handleEvent(data);
                }
            };
            var ajax = new AJAXConfig(STORAGE_URL);
            ajax.setTargetRightWindow();
            ajax.setResponseTypeJSON();
            ajax.data = { action: ACTION_RESTORE, id: IMAGES_ID };
            Server.AJAX.requestPage(ajax, success, error);
        }
        Storage.requestImages = requestImages;
        function requestSounds(cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            success = {
                success: success,
                handleEvent: function (data) {
                    DB.SoundDB.updateFromObject(data);
                    this.success.handleEvent(data);
                }
            };
            var ajax = new AJAXConfig(STORAGE_URL);
            ajax.setTargetRightWindow();
            ajax.setResponseTypeJSON();
            ajax.data = { action: ACTION_RESTORE, id: SOUNDS_ID };
            Server.AJAX.requestPage(ajax, success, error);
        }
        Storage.requestSounds = requestSounds;
        function sendImages(cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(STORAGE_URL);
            ajax.setTargetRightWindow();
            ajax.setResponseTypeJSON();
            ajax.data = { action: ACTION_STORE, id: IMAGES_ID, storage: DB.ImageDB.exportAsObject() };
            Server.AJAX.requestPage(ajax, success, error);
        }
        Storage.sendImages = sendImages;
        function sendSounds(cbs, cbe) {
            var success = cbs === undefined ? emptyCallback : cbs;
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(STORAGE_URL);
            ajax.setTargetRightWindow();
            ajax.setResponseTypeJSON();
            ajax.data = { action: ACTION_STORE, id: SOUNDS_ID, storage: DB.SoundDB.exportAsObject() };
            Server.AJAX.requestPage(ajax, success, error);
        }
        Storage.sendSounds = sendSounds;
    })(Storage = Server.Storage || (Server.Storage = {}));
})(Server || (Server = {}));
var Server;
(function (Server) {
    var Sheets;
    (function (Sheets) {
        var SHEET_URL = "Sheet";
        var STYLE_URL = "Style";
        var emptyCallback = { handleEvent: function () { } };
        function updateStyles(cbs, cbe) {
            var success = {
                cbs: cbs,
                handleEvent: function (response, xhr) {
                    var ids = [];
                    var styles = [];
                    for (var i = 0; i < response.length; i++) {
                        if (ids.indexOf(response[i]['id']) === -1) {
                            ids.push(response[i]['id']);
                            styles.push(response[i]);
                        }
                    }
                    if (this.cbs !== undefined)
                        this.cbs.handleEvent(styles, xhr);
                }
            };
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(STYLE_URL);
            ajax.setResponseTypeJSON();
            ajax.data = { action: "listMine" };
            ajax.setTargetLeftWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Sheets.updateStyles = updateStyles;
        function updateLists(cbs, cbe) {
            var success = {
                cbs: cbs,
                handleEvent: function (response, xhr) {
                    DB.GameDB.updateFromObject(response, true);
                    if (this.cbs !== undefined)
                        this.cbs.handleEvent(response, xhr);
                }
            };
            var error = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(SHEET_URL);
            ajax.setResponseTypeJSON();
            ajax.data = { action: "list" };
            ajax.setTargetRightWindow();
            Server.AJAX.requestPage(ajax, success, error);
        }
        Sheets.updateLists = updateLists;
        function sendFolder(sheet, cbs, cbe) {
            cbs = cbs === undefined ? emptyCallback : cbs;
            cbe = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(SHEET_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "folder");
            ajax.setData("id", sheet.getId());
            ajax.setData("folder", sheet.getFolder());
            ajax.setTargetRightWindow();
            Server.AJAX.requestPage(ajax, cbs, cbe);
        }
        Sheets.sendFolder = sendFolder;
        function deleteSheet(sheet, cbs, cbe) {
            cbs = cbs === undefined ? emptyCallback : cbs;
            cbe = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(SHEET_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "delete");
            ajax.setData("id", sheet.getId());
            ajax.setTargetRightWindow();
            Server.AJAX.requestPage(ajax, cbs, cbe);
        }
        Sheets.deleteSheet = deleteSheet;
        function getSheetPermissions(sheet, cbs, cbe) {
            cbs = cbs === undefined ? emptyCallback : cbs;
            cbe = cbe === undefined ? emptyCallback : cbe;
            var ajax = new AJAXConfig(SHEET_URL);
            ajax.setResponseTypeJSON();
            ajax.setData("action", "listPerm");
            ajax.setData("id", sheet.getId());
            ajax.setTargetRightWindow();
            Server.AJAX.requestPage(ajax, cbs, cbe);
        }
        Sheets.getSheetPermissions = getSheetPermissions;
    })(Sheets = Server.Sheets || (Server.Sheets = {}));
})(Server || (Server = {}));
var change;
change = new Changelog(0, 8, 0);
change.addMessage("Implemented most of the application before Changelog implemented.", "en");
change.addMessage("Maior parte do aplicativo implementado antes da inclusão de Log de Mudanças.", "pt");
change = new Changelog(0, 9, 0);
change.addMessage("Implemented changelog.", "en");
change.addMessage("Log de Mudanças implementado.", "pt");
delete (change);
Changelog.finished();
UI.Language.searchLanguage();
UI.PageManager.readWindows();
UI.WindowManager.updateWindowSizes();
Application.Login.addListener({
    handleEvent: function () {
        if (Application.Login.isLogged()) {
            UI.WindowManager.callWindow(('mainWindow'));
            UI.PageManager.callPage(UI.idChangelog);
            UI.PageManager.callPage(UI.idHome);
        }
        else {
            UI.WindowManager.callWindow("loginWindow");
            UI.Login.resetState();
            UI.Login.resetFocus();
        }
    }
});
Application.Login.searchLogin();
UI.Login.resetState();
UI.WindowManager.callWindow("loginWindow");
if (Application.Login.hasSession()) {
    Server.Login.requestSession(false);
}
else {
    UI.Login.resetFocus();
}
allReady();
//# sourceMappingURL=Application.js.map