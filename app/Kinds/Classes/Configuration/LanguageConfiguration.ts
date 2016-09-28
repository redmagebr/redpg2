class LanguageConfiguration extends Configuration {
    constructor () {
        super(navigator.language);
    }

    public setFunction = function (value : string) {
        if (value.indexOf("_") !== -1) {
            value = value.replace("_", "-");
        }
        this.value = value;
    };
}