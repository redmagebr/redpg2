function startDebugging() {
    console.debug = console.log;
}
function stopDebugging() {
    console.debug = function () {
    };
}
if (window.location.hash.substr(1).toUpperCase().indexOf("DEBUG") !== -1) {
    startDebugging();
} else {
    stopDebugging();
}