class NumberConfiguration extends Configuration {
    private min : number = 0;
    private max : number = 100;

    constructor (defValue, min : number, max : number) {
        super(defValue);
        this.min = min;
        this.max = max;
    }

    public setFunction = function (value : number) {
        if (!isNaN(<number> value)) {
            value = Number(value);
            if (value < this.min) {
                value = this.min;
            }

            if (value > this.max && this.max != 0) {
                value = this.max;
            }

            this.value = value;
        }
    };

    public getFunction = function () {
        // if ($.browser.mobile) {
        //     return 0;
        // }
        //WTF!?!?!?
        return this.value;
    }
}