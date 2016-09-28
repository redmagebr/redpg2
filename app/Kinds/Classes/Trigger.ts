class Trigger {
    private functions : Array <Function> = [];
    private objects : Array <Listener> = [];

    public removeListener (f : Function | Listener) {
        if (typeof f === "function") {
            var i = this.functions.indexOf(<Function> f);
            if (i !== -1) {
                this.functions.splice(i, 1);
            }
        } else {
            var i = this.objects.indexOf(<Listener> f);
            if (i !== -1) {
                this.objects.splice(i, 1);
            }
        }
    }

    public addListener (f : Function | Listener) {
        if (typeof f === "function") {
            this.functions.push(<Function> f);
        } else {
            this.objects.push(<Listener> f);
        }
    }

    public trigger (...args : any[]) {
        for (var i = 0; i < this.functions.length; i++) {
            this.functions[i].apply(null, args);
        }

        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].handleEvent.apply(this.objects[i], args);
        }
    }
}