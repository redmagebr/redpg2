module UI.SoundController {
    var trackNameContainer = <HTMLElement> document.getElementById("musicPlayerTrackName");
    while (trackNameContainer.firstChild) trackNameContainer.removeChild(trackNameContainer.firstChild);
    var trackNameMarquee = document.createElement("p");
    trackNameMarquee.classList.add("marquee");
    var trackName = document.createTextNode("");
    trackNameMarquee.appendChild(trackName);
    trackNameContainer.appendChild(trackNameMarquee);
    var diceSound = <HTMLAudioElement> document.getElementById("soundDiceRoll");
    var alertSound = <HTMLAudioElement> document.getElementById("soundAlert");
    var bgmSound = <HTMLAudioElement> document.getElementById("soundPlayerBGM");
    var seSound = <HTMLAudioElement> document.getElementById("soundPlayerSE");
    var lastURL : String = null;
    var lastSEURL : String = null;

    var startedPlaying = false;
    

    diceSound.parentNode.removeChild(diceSound);
    alertSound.parentNode.removeChild(alertSound);
    bgmSound.parentNode.removeChild(bgmSound);
    seSound.parentNode.removeChild(seSound);

    Application.Config.getConfig("seVolume").addChangeListener(function (e : NumberConfiguration) { UI.SoundController.updateSEVolume(e.getValue())});
    Application.Config.getConfig("bgmVolume").addChangeListener(function (e : NumberConfiguration) { UI.SoundController.updateBGMVolume(e.getValue())});

    export function updateSEVolume (newVolume : number) {
        var volume : number;
        if (newVolume > 100) {
            volume = 1;
        } else if (newVolume < 0) {
            volume = 0;
        } else {
            volume = (newVolume / 100);
        }

        diceSound.volume = volume;
        alertSound.volume = volume;
        seSound.volume = volume;
    }

    export function updateBGMVolume (newVolume : number) {
        var volume : number;
        if (newVolume > 100) {
            volume = 1;
        } else if (newVolume < 0) {
            volume = 0;
        } else {
            volume = (newVolume / 100);
        }
        bgmSound.volume = volume;
    }

    bgmSound.addEventListener("error", function (e : ErrorEvent) {
        var msg = new ChatSystemMessage(true);
        msg.addText("_CHATBGMERROR_");

        UI.Chat.printElement(msg.getElement());
    });

    seSound.addEventListener("error", function () {
        var msg = new ChatSystemMessage(true);
        msg.addText("_CHATSEERROR_");

        UI.Chat.printElement(msg.getElement());
    });

    export function getBGM () {
        return bgmSound;
    }

    export function playDice () {
        diceSound.currentTime = 0;
        diceSound.play();
    }

    export function playAlert () {
        alertSound.currentTime = 0;
        alertSound.play();
    }

    bgmSound.addEventListener("canplay", function () {
        if (UI.SoundController.isAutoPlay()) {
            this.play();
        }
    });

    seSound.addEventListener("canplay", function () {
        this.play();
    });

    export function isAutoPlay () {
        var r = startedPlaying;
        startedPlaying = false;
        return r;
    }

    export function playBGM (url : string) {
        if (lastURL !== null) {
            URL.revokeObjectURL(<string> lastURL);
            lastURL = null;
        }

        startedPlaying = true;
        var found = false;
        var isLink = url.indexOf("://") !== -1;
        url = Server.URL.fixURL(url);

        var filename = decodeURI(url.substring(url.lastIndexOf('/')+1));
        trackName.nodeValue = filename;

        bgmSound.src = url;
    }

    export function playSE (url: string) {
        if (lastSEURL !== null) {
            URL.revokeObjectURL(<string> lastSEURL);
            lastSEURL = null;
        }

        var found = false;
        var isLink = url.indexOf("://") !== -1;
        url = Server.URL.fixURL(url);

        seSound.src = url;
    }
}