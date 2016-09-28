class MessageCountdown extends Message {
    private counter : Text = document.createTextNode("99999");
    public module : string = "countdown";
    public static timeout : Number = null;
    public static lastTimeout : MessageCountdown;

    constructor () {
        super();

        this.addUpdatedListener(function (e : MessageCountdown) {
            var target = e.getTarget();
            if (target !== null) {
                var msg : MessageCountdown = <MessageCountdown> DB.MessageDB.getMessage(target);
                if (msg !== null) {
                    msg.updateCounter(e.getCounter());
                }
            } else {
                e.updateCounter(parseInt(e.getMsg()));
            }
        });
    }

    public createHTML () {
        if (this.getMsg() === "") {
            return null;
        }

        var p = document.createElement("p");

        var counter = parseInt(this.getMsg());
        this.updateCounter(counter);

        var span = document.createElement("span");
        if (counter > 0) {
            span.classList.add("chatMessageCounterSpan");
            span.appendChild(this.counter);
            p.classList.add("chatMessageCounter");
        } else {
            span.classList.add("chatMessageCounterEndSpan");
            p.classList.add("chatMessageCounterEnd");
        }

        p.appendChild(span);

        return p;
    }

    public receiveCommand (slash : string, msg : string) : boolean {
        if (MessageCountdown.timeout !== null) {
            clearTimeout(<number> MessageCountdown.timeout);
            MessageCountdown.timeout = null;
            var message = new MessageCountdown();
            message.setTarget(MessageCountdown.lastTimeout.id);
            message.setMsg("0");
            message.setCounter(0);
            UI.Chat.sendMessage(message);
            MessageCountdown.lastTimeout = null;
        }

        var counter = parseInt(msg);
        if (isNaN(counter)) {
            return false;
        }

        this.setMsg(counter.toString());

        var func = function () {
            if (this.target.id === 0) {
                MessageCountdown.timeout = setTimeout(this['func'], 1000);
                return;
            }
            var msg : MessageCountdown;
            if (this.current > 0) {
                msg = new MessageCountdown();
                msg.setTarget(this.target.id);
                msg.setCounter(this.current--);
                MessageCountdown.timeout = setTimeout(this['func'], 1000);
            } else if (this.current <= 0) {
                msg = new MessageCountdown();
                msg.setTarget(this.target.id);
                msg.setCounter(this.current);
                msg.setMsg(this.current.toString());
                MessageCountdown.timeout = null;
                MessageCountdown.lastTimeout = null;
            }

            UI.Chat.sendMessage(msg);
        };

        var counterObj = {
            current : counter - 1,
            target : this
        };

        counterObj['func'] = func.bind(counterObj);

        MessageCountdown.lastTimeout = this;
        MessageCountdown.timeout = setTimeout(counterObj['func'], 1000);

        return true;
    }

    public getTarget () {
        return this.getSpecial("target", null);
    }

    public setTarget (id : number) {
        this.setSpecial("target", id);
    }

    public setCounter (e : number) {
        this.setSpecial("counter", e);
    }

    public getCounter () : number {
        return this.getSpecial("counter", 0);
    }

    public updateCounter (e : number) {
        var curr = parseInt(this.counter.nodeValue);
        // Protection against lag and desync. Counters are only supposed to go down.
        if (e < curr) {
            this.counter.nodeValue = e.toString();
        }
    }
}

MessageFactory.registerMessage(MessageCountdown, "countdown", ["/countdown", "/count"]);