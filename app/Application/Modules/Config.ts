/**
 * Created by Reddo on 15/09/2015.
 */
module Application.Config {
    var configList : { [id : string] : Configuration } = {};

    export function getConfig (id : string) : Configuration {
        return configList[id];
    }

    export function registerChangeListener (id : string, listener : Listener | Function) {
        if (configList[id] === undefined) {
            console.warn("[CONFIG] Attempt to register a listener to unregistered configuration at " + id + ". Offending listener:", listener);
            return;
        }
        configList[id].addChangeListener(listener);
    }

    export function registerConfiguration (id : string, config : Configuration) {
        if (configList[id] !== undefined) {
            console.warn("[CONFIG] Attempt to overwrite registered Configuration at " + id + ". Offending configuration:", config);
            return;
        }

        configList[id] = config;
    }

    export function exportAsObject () : { [id : string] : any } {
        var result : { [id : string] : any } = {};

        for (var key in configList) {
            result[key] = configList[key].getValue();
        }

        return result;
    }

    export function reset () {
        for (var key in configList) {
            configList[key].reset();
        }
    }

    export function updateFromObject (obj : {[id : string] : any}) {
        for (var key in obj) {
            if (configList[key] === undefined) {
                console.warn("[CONFIG] Unregistered configuration at " + key + ". It will be discarded. Value: ", obj[key]);
                continue;
            }
            configList[key].storeValue(obj[key]);
        }
        console.debug("[CONFIG] Updated configuration values from:", obj);
    }

    export function saveConfig (cbs? : Listener | Function, cbe? : Listener | Function) {
        Server.Config.saveConfig(exportAsObject(), cbs, cbe);
    }
}