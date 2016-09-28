module Application.LocalMemory {
    function getMemoryName (id : string) {
        return "redpg_" + Application.Login.getUser().id + "_" + id;
    }

    export function getMemory (id : string, defaultValue : any) {
        if (Application.Login.isLogged()) {
            var value = localStorage.getItem(getMemoryName(id));
            if (value !== null) {
                return JSON.parse(value);
            }
        }
        return defaultValue;
    }

    export function setMemory (id : string, value : any) {
        if (Application.Login.isLogged()) {
            localStorage.setItem(getMemoryName(id), JSON.stringify(value));
        }
    }

    export function unsetMemory (id : string) {
        if (Application.Login.isLogged()) {
            localStorage.removeItem(getMemoryName(id));
        }
    }
}