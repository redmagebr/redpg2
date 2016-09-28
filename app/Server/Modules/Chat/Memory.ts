module Server.Chat.Memory {
    var configList : { [id : string] : TrackerMemory } = {};
    var changeTrigger = new Trigger();

    export var version : number = 2;

    export function addChangeListener (f : Function | Listener) {
        changeTrigger.addListener(f);
    }

    export function getConfig (id : string) : TrackerMemory {
        return configList[id];
    }

    export function registerChangeListener (id : string, listener : Listener) {
        if (configList[id] === undefined) {
            console.warn("[ROOMMEMORY] Attempt to register a listener to unregistered configuration at " + id + ". Offending listener:", listener);
            return;
        }
        configList[id].addChangeListener(listener);
    }

    export function registerConfiguration (id : string, config : TrackerMemory) {
        if (configList[id] !== undefined) {
            console.warn("[ROOMMEMORY] Attempt to overwrite registered Configuration at " + id + ". Offending configuration:", config);
            return;
        }

        configList[id] = config;
        config.addChangeListener(<Listener> {
            trigger : changeTrigger,
            id : id,
            handleEvent : function (memo : TrackerMemory) {
                this.trigger.trigger(memo, id);
                console.debug("[ROOMMEMORY] Global change triggered by " + id + ".");
            }
        });
    }

    export function exportAsObject () : { [id : string] : any } {
        var result : { [id : string] : any } = {};

        for (var key in configList) {
            result[key] = configList[key].getValue();
        }

        return result;
    }

    export function updateFromObject (obj : {[id : string] : any}) {
        for (var key in configList) {
            if (obj[key] === undefined) {
                configList[key].reset();
            } else {
                configList[key].storeValue(obj[key]);
            }
        }
        console.debug("[ROOMMEMORY] Updated values from:", obj);
    }

    export function saveMemory () {
        var room = Server.Chat.getRoom();
        if (room !== null) {
            var user = room.getMe();
            if (user.isStoryteller()) {
                var memoryString : string = JSON.stringify(exportAsObject());
                console.warn(memoryString);
            }
        }
    }
}

Server.Chat.Memory.registerConfiguration("c", new MemoryCombat());
Server.Chat.Memory.registerConfiguration("v", new MemoryVersion());