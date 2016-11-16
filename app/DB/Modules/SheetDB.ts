module DB.SheetDB {
    var sheets : {[id : number] : SheetInstance} = {};
    var changeTrigger = new Trigger();

    export function addChangeListener (list : Listener | Function) {
        changeTrigger.addListener(list);
    }

    export function removeChangeListener (list : Listener | Function) {
        changeTrigger.removeListener(list);
    }

    export function triggerChanged (sheet : SheetInstance) {
        changeTrigger.trigger(sheet);
    }

    export function hasSheet (id : number) {
        return sheets[id] !== undefined;
    }

    export function getSheet (id : number) : SheetInstance {
        if (hasSheet(id)) {
            return sheets[id];
        }
        return null;
    }

    export function releaseSheet (id : number) {
        if (hasSheet(id)) {
            delete (sheets[id]);
        }
    }

    export function updateFromObject (obj : Array<Object>) {
        for (var i = 0; i < obj.length; i++) {
            if (sheets[obj[i]['id']] === undefined) {
                sheets[obj[i]['id']] = new SheetInstance();
            }
            sheets[obj[i]['id']].updateFromObject(obj[i]);
        }
        triggerChanged(null);
    }

    export function getSheetsByGame (game : Game) {
        var wanted = [];
        for (var id in sheets) {
            if (sheets[id].getGameid() === game.getId()) {
                wanted.push(sheets[id]);
            }
        }

        wanted.sort(function (a : SheetInstance, b : SheetInstance) {
            if (a.getName() < b.getName()) return -1;
            if (a.getName() > b.getName()) return 1;
            return 0;
        });

        return wanted;
    }

    export function getSheetsByFolder (sheets : Array<SheetInstance>) : Array<Array<SheetInstance>> {
        var folders : {[id : string] : Array<SheetInstance>} = {};
        var result : Array<Array<SheetInstance>> = [];
        for (var i = 0; i < sheets.length; i++) {
            if (folders[sheets[i].getFolder()] === undefined) {
                folders[sheets[i].getFolder()] = [sheets[i]];
                result.push(folders[sheets[i].getFolder()]);
            } else {
                folders[sheets[i].getFolder()].push(sheets[i]);
            }
        }

        result.sort(function (a : Array<SheetInstance>,b : Array<SheetInstance>) {
            if (a[0].getFolder() < b[0].getFolder()) return -1;
            if (a[0].getFolder() > b[0].getFolder()) return 1;
            return 0;
        });

        for (var i = 0; i < result.length; i++) {
            result[i].sort(function (a : SheetInstance, b : SheetInstance) {
                if (a.getName() < b.getName()) return -1;
                if (a.getName() > b.getName()) return 1;
                return 0;
            });
        }

        return result;
    }

    export function saveSheet (sheet : SheetInstance) {
        var cbs = <Listener> {
            sheet : sheet,
            handleEvent : function () {
                this.sheet.setSaved();
                var msg = new MessageSheetup();
                msg.setSheetId(this.sheet.id);

                UI.Chat.sendMessage(msg);
            }
        };

        var cbe = <Listener> {
            sheet : sheet,
            handleEvent : function () {
                alert("Sheet not saved! " + this.sheet.getName());
            }
        };

        Server.Sheets.sendSheet(sheet, cbs, cbe);
    }
}