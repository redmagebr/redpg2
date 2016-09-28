/**
 * Created by Reddo on 16/09/2015.
 */
class Configuration {
    private changeTrigger = new Trigger();
    protected value : any = null;
    public defValue : any = null;

    public setFunction : Function = null;
    public getFunction : Function = null;

    constructor (defV : any) {
        this.defValue = defV;
        this.value = defV;
    }

    public getDefault () {
        return this.defValue;
    }

    public reset () {
        this.storeValue(this.defValue);
    }

    public addChangeListener (listener : Listener | Function) {
        this.changeTrigger.addListener(listener);
    }

    public storeValue (value : any) {
        var oldValue = JSON.stringify(this.value);
        if (this.setFunction !== null) {
            this.setFunction(value);
        } else {
            this.value = value;
        }
        var newValue = JSON.stringify(this.value);

        if (newValue !== oldValue) {
            this.changeTrigger.trigger(this);
            return true;
        }
        return false;
    }

    public getValue () {
        if (this.getFunction !== null) {
            return this.getFunction();
        }
        return this.value;
    }
}