module UI.Config {
    var error = document.getElementById("configError");
    var success = document.getElementById("configSuccess");
    var timeout : Number = null;
    error.style.display = "none";
    success.style.display = "none";

    document.getElementById("configButton").addEventListener("click", function () { UI.PageManager.callPage(UI.idConfig); });

    document.getElementById("configSave").addEventListener("click", function () {
        UI.Config.saveConfig();
    });

    document.getElementById("configReset").addEventListener("click", function () {
        Application.Config.reset();
    });

    export function bindInput (configName : string, input : HTMLInputElement) {
        Application.Config.getConfig(configName).addChangeListener(<Listener> {
            input : input,
            handleEvent : function (config : Configuration) {
                this.input.value = config.getValue().toString();
            }
        });

        input.addEventListener("change", <EventListenerObject> {
            configName : configName,
            input : input,
            handleEvent : function () {
                var cfg = Application.Config.getConfig(this.configName);
                cfg.storeValue(this.input.value);
                var str = cfg.getValue().toString();
                this.input.value = str;
            }
        });

        input.value = Application.Config.getConfig(configName).getValue().toString();
    }

    bindInput("chatfontfamily", <HTMLInputElement> document.getElementById("configChatFontFamily"));
    bindInput("chatMaxMessages", <HTMLInputElement> document.getElementById("configChatMaxMessages"));
    bindInput("chatfontsize", <HTMLInputElement> document.getElementById("configChatFontSize"));
    bindInput("chatshowhelp", <HTMLInputElement> document.getElementById("configChatShowHelp"));
    bindInput("chatAutoRolls", <HTMLInputElement> document.getElementById("configAutoRollApplication"));
    bindInput("chatzebra", <HTMLInputElement> document.getElementById("configChatZebra"));
    bindInput("uiDark", <HTMLInputElement> document.getElementById("configChatDark"));
    bindInput("animTime", <HTMLInputElement> document.getElementById("configAnimTime"));
    bindInput("autoBGM", <HTMLInputElement> document.getElementById("configChatAutoBGM"));
    bindInput("autoSE", <HTMLInputElement> document.getElementById("configChatAutoSE"));
    bindInput("autoImage", <HTMLInputElement> document.getElementById("configChatAutoImage"));
    bindInput("autoVIDEO", <HTMLInputElement> document.getElementById("configChatAutoVideo"));
    bindInput("bgmVolume", <HTMLInputElement> document.getElementById("configBGMVolume"));
    bindInput("seVolume", <HTMLInputElement> document.getElementById("configSEVolume"));
    bindInput("screeneffects", <HTMLInputElement> document.getElementById("configChatScreenEffects"));
    bindInput("hideGames", <HTMLInputElement> document.getElementById("configGamesHideGames"));
    bindInput("hideMessages", <HTMLInputElement> document.getElementById("configChatHideSomeMessages"));

    export function saveConfig () {
        var hide = function () {
            this.finish().fadeOut(Application.Config.getConfig("animTime").getValue());
        };

        var cbs = {
            hide : hide,
            success : success,
            handleEvent : function () {
                var $success = $(this.success);
                $success.finish().fadeIn(Application.Config.getConfig("animTime").getValue());

                UI.Config.setUniqueTimeout(this.hide.bind($success), 5000);
            }
        };

        var cbe = {
            hide : hide,
            error: error,
            handleEvent : function () {
                var $error = $(this.error);
                $error.finish().fadeIn(Application.Config.getConfig("animTime").getValue());

                UI.Config.setUniqueTimeout(this.hide.bind($error), 5000);
            }
        };


        success.style.display = "none";
        error.style.display = "none";
        Application.Config.saveConfig(cbs, cbe);
    }

    export function setUniqueTimeout (f : Function, t : number) {
        if (timeout !== null) {
            clearTimeout(<number> timeout);
        }
        timeout = setTimeout(f, t);
    }
}