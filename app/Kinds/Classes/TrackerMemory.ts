abstract class TrackerMemory {
    private changeTrigger = new Trigger();

    public abstract reset () : void;

    public abstract storeValue (value : any) : any;

    public abstract getValue () : any ;

    public abstract exportAsObject () : any ;

    public addChangeListener (listener : Listener | Function) {
        this.changeTrigger.addListener(listener);
    }

    protected triggerChange () {
        this.changeTrigger.trigger(this);
    }
}