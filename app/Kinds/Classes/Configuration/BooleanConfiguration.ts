class BooleanConfiguration extends Configuration {
    constructor (bool : boolean) {
        super(bool ? 1 : 0);
    }

    public setFunction = function (value : string) {
        if (typeof value !== "string") value = value.toString().toLowerCase();
        var bool = value === "1" || value === "true";
        if (bool) this.value = 1;
        else this.value = 0;
    };

    public getFunction  = function () {
        return this.value === 1;
    };
}