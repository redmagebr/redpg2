class MessageSheetdamage extends Message {
    public module : string = "sheetdm";

    public createHTML () {
        var p = document.createElement("p");
        p.classList.add("chatMessageSheetdamage");
        p.classList.add(this.getType());

        var a = document.createElement("a");
        a.classList.add("icons-chatDamage" + this.getType());
        a.classList.add("chatMessageDamageIcon");
        p.appendChild(a);

        p.appendChild(document.createTextNode(this.getSheetName() + ":"));

        var span = document.createElement("span");
        span.classList.add("chatMessageDamageBubble");
        span.classList.add(this.getType());
        span.appendChild(document.createTextNode(this.getAmount() + " " + this.getType()));
        p.appendChild(span);

        return p;
    }

    public getType () : string {
        var type = this.getSpecial("type", "HP");
        if (type === "HP" || type === "MP" || type ==="Exp") {
            return type;
        }
        return "HP";
    }

    public setTypeHP () {
        this.setSpecial("type", "HP");
    }

    public setTypeMP () {
        this.setSpecial("type", "MP");
    }

    public setTypeExp () {
        this.setSpecial("type", "Exp");
    }

    public setLog (log : string) {
        this.setSpecial("log", log);
    }

    public getLog () : String {
        return this.getSpecial("log", null);
    }

    public setSheetName (name : string) {
        this.msg = name;
    }

    public getSheetName () :string {
        var old = this.getSpecial("sheetname", null);

        if (old === null) {
            old = this.msg;
        }

        return old;
    }

    public setAmount (amount : number) {
        this.setSpecial("amount", amount);
    }

    public getAmount () : string {
        var amount = this.getSpecial("amount", null);
        if (amount === null) {
            return "0?";
        }
        if (typeof amount === "string") {
            amount = parseInt(amount);
        }
        if (amount > 0) {
            return "+ " + amount.toString();
        }
        return "- " + (amount * -1).toString();
    }
}

MessageFactory.registerMessage(MessageSheetdamage, "sheetdm", []);