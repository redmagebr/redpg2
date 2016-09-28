var onReady : Array<Listener> = [];

function addOnReady (caller : string, reason : string, listener : Listener) {
    console.debug("[ONREADY] Registered for " + caller + " because: " + reason + ". Listener:", listener);
    onReady.push(listener);
}

function allReady () {
    for (var i = 0; i < onReady.length; i++) {
        onReady[i].handleEvent();
    }
}