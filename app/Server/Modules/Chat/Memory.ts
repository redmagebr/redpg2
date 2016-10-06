module Server.Chat.Memory {
    var configList : { [id : string] : TrackerMemory } = {};
    var readableConfigList : { [id : string] : TrackerMemory } = {};
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
            console.warn("[RoomMemory] Attempt to register a listener to unregistered configuration at " + id + ". Offending listener:", listener);
            return;
        }
        configList[id].addChangeListener(listener);
    }

    export function getConfiguration (name : string) {
        if (typeof readableConfigList[name] !== "undefined") {
            return readableConfigList[name];
        }
        console.warn ("[RoomMemory] Attempt to retrieve invalid memory " + name + ", returning", null);
        return null;
    }

    export function registerConfiguration (id : string, name : string, config : TrackerMemory) {
        if (configList[id] !== undefined) {
            console.warn("[RoomMemory] Attempt to overwrite registered Configuration at " + id + ". Offending configuration:", config);
            return;
        }

        configList[id] = config;
        config.addChangeListener(<Listener> {
            trigger : changeTrigger,
            id : id,
            handleEvent : function (memo : TrackerMemory) {
                this.trigger.trigger(memo, id);
                console.debug("[RoomMemory] Global change triggered by " + id + ".");
            }
        });

        readableConfigList[name] = config;
    }

    export function exportAsObject () : { [id : string] : any } {
        var result : { [id : string] : any } = {};

        for (var key in configList) {
            var val = configList[key].exportAsObject();
            if (val !== null) {
                result[key] = val;
            }
        }

        return result;
    }

    // TODO: Trigger all changes at once
    export function updateFromObject (obj : {[id : string] : any}) {
        for (var key in configList) {
            if (obj[key] === undefined) {
                configList[key].reset();
            } else {
                configList[key].storeValue(obj[key]);
            }
        }
        console.debug("[RoomMemory] Updated values from:", obj);
    }

    // TODO: Don't save the same thing multiple times
    export function saveMemory () {
        var room = Server.Chat.getRoom();
        if (room !== null) {
            var user = room.getMe();
            if (user.isStoryteller()) {
                var memoryString : string = JSON.stringify(exportAsObject());
                console.debug("[RoomMemory] Memory string: " + memoryString);
                //this.sendAction("memory", JSON.stringify(this.room.memory.memory));
                Server.Chat.saveMemory(memoryString);
            }
        }
    }
}

Server.Chat.Memory.registerConfiguration("c", "Combat", new MemoryCombat());
Server.Chat.Memory.registerConfiguration("v", "Version", new MemoryVersion());
Server.Chat.Memory.registerConfiguration("p", "Pica", new MemoryPica());