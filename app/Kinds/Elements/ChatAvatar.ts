class ChatAvatar {
    private element = document.createElement("div");
    private img = document.createElement("img");
    private typing = document.createElement("a");
    private afk = document.createElement("a");
    private name = document.createTextNode("????#????");

    private user : User = null;
    private persona : string = null;

    public online : boolean = false;
    private changedOnline : boolean = false;

    constructor () {
        var name = document.createElement("div");
        name.classList.add("avatarName");
        name.appendChild(this.name);

        this.typing.style.display = "none";
        this.typing.classList.add("avatarTyping");
        this.afk.style.display = "none";
        this.afk.classList.add("avatarAFK");
        this.img.classList.add("avatarImg");
        this.element.classList.add("avatarContainer");
        this.element.appendChild(this.img);
        this.element.appendChild(this.typing);
        this.element.appendChild(this.afk);
        this.element.appendChild(name);

        this.img.style.display = "none";
        this.element.classList.add("icons-chatAnon");

        this.img.addEventListener("error", {
            avatar : this,
            handleEvent : function () {
                this.avatar.img.style.display = "none";
                this.avatar.element.classList.add("icons-chatAnonError");
            }
        })
    }

    public getHTML () : HTMLElement {
        return this.element;
    }

    public getUser () {
        return this.user;
    }

    public setOnline (online : boolean) {
        if (online) {
            this.element.style.display = "";
        } else {
            this.element.style.display = "none";
        }

        if (online !== this.online) {
            this.changedOnline = true;
            this.online = online;
        }
    }

    // Fake "changed" if we are online for reconnect
    public reset () {
        this.setOnline(false);
        this.changedOnline = false;
    }

    public isChangedOnline () {
        var is = this.changedOnline;
        this.changedOnline = false;
        return is;
    }

    public setImg (img : String) {
        if (img === null) {
            this.img.style.display = "none";
            this.element.classList.add("icons-chatAnon");
            this.element.classList.remove("icons-chatAnonError");
        } else {
            this.img.style.display = "";
            this.element.classList.remove("icons-chatAnon");
            this.element.classList.remove("icons-chatAnonError");
            this.img.src = <string> img;
        }
    }

    public setName (name : string) {
        this.name.nodeValue = name;
    }

    public setFocus (focus : boolean) {
        if (!focus) {
            this.element.style.opacity = "0.7";
        } else {
            this.element.style.opacity = "1";
        }
    }

    public setTyping (typing : boolean) {
        if (typing) {
            this.typing.style.display = "";
        } else {
            this.typing.style.display = "none";
        }
    }

    public setAfk (afk : boolean) {
        if (afk) {
            this.afk.style.display = "";
        } else {
            this.afk.style.display = "none";
        }
    }

    public updateName () {
        if (this.persona === null) {
            if (this.user !== null) this.setName(this.user.getFullNickname());
        } else {
            this.setName(this.persona);
        }

        if (this.user !== null) {
            this.element.setAttribute("title", this.user.getFullNickname());
        } else if (this.persona !== null) {
            this.element.setAttribute("title", this.persona);
        } else {
            this.element.removeAttribute("title");
        }
    }

    public updateFromObject (obj : Object) {
        if (obj['id'] !== undefined) {
            this.user = DB.UserDB.getUser(obj['id']);
        }

        if (obj['idle'] !== undefined) this.setAfk(obj['idle']);
        if (obj['focused'] !== undefined) this.setFocus(obj['focused']);
        if (obj['online'] !== undefined) this.setOnline(obj['online']);
        if (obj['typing'] !== undefined) this.setTyping(obj['typing']);

        if (obj['persona'] !== undefined) this.persona = obj['persona'];
        if (obj['avatar'] !== undefined) this.setImg(obj['avatar']);

        this.updateName();
    }
}