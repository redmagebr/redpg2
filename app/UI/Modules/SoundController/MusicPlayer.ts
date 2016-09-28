module UI.SoundController.MusicPlayer {
    var bgm = UI.SoundController.getBGM();

    
    var button = document.getElementById("musicPlayerButton");
    var parent = button.parentNode;
    var container = document.getElementById("musicPlayerContainer");
    var bar = <HTMLProgressElement> document.getElementById("musicPlayerProgress");
    var playpause = <HTMLElement> document.getElementById("musicPlayerPlayPause");
    var stop = <HTMLElement> document.getElementById("musicPlayerStop");
    var repeat = <HTMLElement> document.getElementById("musicPlayerRepeat");

    var soundListButtonText = document.createTextNode("0");

    document.getElementById("musicPlayerLocal").addEventListener("click", function (e) {
        UI.SoundController.getSoundList().click();
    });

    document.getElementById("musicPlayerLocal").appendChild(soundListButtonText);

    UI.SoundController.getSoundList().addEventListener("change", {
        button : soundListButtonText,
        list : UI.SoundController.getSoundList(),
        handleEvent : function () {
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
        } else {
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

    Application.Config.getConfig("bgmLoop").addChangeListener(<Listener> {
        repeat : repeat,
        handleEvent : function (e : BooleanConfiguration) {
            if (e.getValue()) {
                this.repeat.classList.add("icons-soundPlayerRepeatActive");
                this.repeat.classList.remove("icons-soundPlayerRepeat");
            } else {
                this.repeat.classList.add("icons-soundPlayerRepeat");
                this.repeat.classList.remove("icons-soundPlayerRepeatActive");
            }
        }
    });

    bgm.addEventListener("error", function () {
        UI.SoundController.MusicPlayer.stopPlaying();
    });

    bgm.addEventListener("play", {
        playpause : playpause,
        handleEvent : function () {
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
    delete(updateSeekerF);

    bgm.addEventListener("ended", function () {
        var loop = Application.Config.getConfig("bgmLoop").getValue();
        if (loop) {
            this.currentTime = 0;
            this.play();
        } else {
            UI.SoundController.MusicPlayer.stopPlaying();
        }
    });

    bar.addEventListener("click", function (e : MouseEvent) {
        var offset = $(this).offset();
        var x = e.pageX - offset.left;
        var width = this.clientWidth;

        var bgm = UI.SoundController.getBGM();
        bgm.currentTime = bgm.duration * (x / width);
    });

    button.addEventListener("mouseover", function () { UI.SoundController.MusicPlayer.showContainer(); });
    button.addEventListener("mouseout", function (event) {
        var e = <Node> (event.toElement || event.relatedTarget);
        var parent = <Node> e;
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

    export function showContainer () {
        button.appendChild(container);
    }

    export function hideContainer() {
        if (container.parentNode !== null) button.removeChild(container);
    }

    export function showButton () {
        parent.appendChild(button);
    }

    export function hideButton () {
        if (button.parentNode === parent) parent.removeChild(button);
    }

    export function updateSeeker (perc : number) {
        bar.value = perc;
    }

    export function stopPlaying () {
        hideContainer();
        hideButton();
        bgm.pause();
        bgm.currentTime = 0;
    }
}