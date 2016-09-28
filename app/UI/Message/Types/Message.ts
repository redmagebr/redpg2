/**
 * 'destination', 'id', 'module', 'msg', 'origin', 'roomid', 'date'
 message;
 {"localid":0,
 "destination":null,
 "message":"",
 "module":"dice",
 "special":{"dice":[8],"mod":null,"persona":null},
 "clone":false}
 */
class Message extends SlashCommand {
    public id : number = 0;
    public localid : number = null;
    public roomid : number = null;
    public date : string = null;
    public module : string = "";
    public msg : string = "";
    public special : { [id : string] : any } | string = {};
    private sending : Number = null;

    public origin : number = 0;
    public destination : Number | Array<number> = null;

    private updatedTrigger = new Trigger();

    protected html : HTMLElement = null;

    public clone : boolean = false;

    public getDate () {
        if (this.date === "" || this.date === null) {
            return null;
        }
        return this.date;
    }

    public onPrint () {};

    public setPersona (name : string) {
        this.setSpecial("persona", name);
    }

    public getPersona () : string {
        return this.getSpecial("persona", "???");
    }

    public findPersona () {}

    /**
     * Assigns this message a localId
     */
    public getLocalId () {
        if (this.localid === null) DB.MessageDB.registerLocally(this);
    }

    /**
     * Returns the UserRoomContext for the sender. ALWAYS returns a user, even if Origin is invalid (returns a new UserRoomContext() in this case).
     * @returns {UserRoomContext}
     */
    public getUser() : UserRoomContext {
        var user = DB.UserDB.getAUser(this.origin);
        var context = user.getRoomContext(this.roomid);
        if (context === null) {
            context = new UserRoomContext(user);
            context.roomid = this.roomid;
            if (this.origin !== 0) { // Origin 0 means this is a mockup, warnings are not necessary
                console.warn("[MESSAGE] Could not find user Room Context for " + this.origin + ", creating a new one.");
            }
        }
        return context;
    }

    public addDestinationStorytellers (room : Room) {
        if (room === null) {
            return;
        }
        var storytellers = room.getStorytellers();
        for (var i = 0; i < storytellers.length; i++) {
            this.addDestination(storytellers[i].getUser());
        }
    }

    public addDestination (user : User) {
        if (this.destination === null) {
            this.destination = <Array<number>> [user.id];
        } else if (typeof this.destination === "number") {
            this.destination = <Array<number>> [this.destination, user.id];
        } else if (Array.isArray(this.destination)) {
            (<Array<number>> this.destination).push(user.id);
        } else {
            console.warn("[MESSAGE] Attempt to add user to unknown destination type? What gives? Offending user and message:", user, this);
        }
    }

    public getDestinations () : Array<UserRoomContext> {
        if (Array.isArray(this.destination)) {
            var users = [];
            for (var i = 0; i < (<Array<number>> this.destination).length; i++) {
                var user = DB.UserDB.getAUser(this.destination[i]);
                var context = user.getRoomContext(this.roomid);
                if (context === null) {
                    context = new UserRoomContext(user);
                    context.roomid = this.roomid;
                    console.warn("[MESSAGE] Could not find user Room Context for " + this.destination[i] + ", creating a new one.");
                }
                users.push(context);
            }
            return users;
        } else {
            var user = DB.UserDB.getAUser(<number> this.destination);
            var context = user.getRoomContext(this.roomid);
            if (context === null) {
                context = new UserRoomContext(user);
                context.roomid = this.roomid;
                console.warn("[MESSAGE] Could not find user Room Context for " + this.destination + ", creating a new one.");
            }
            return [context];
        }
    }

    /**
     * Returns an Array of Messages meant for testing. This array should include all variations of this message type. Should include self for optimization.
     * @returns {Message[]}
     */
    public makeMockUp() : Array<Message> {
        this.msg = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat orci nulla, et dictum turpis commodo a. Duis iaculis neque lectus, ac sodales diam varius id.";
        return [this];
    }

    /**
     * Returns whether this is a whisper or not.
     * @returns {boolean}
     */
    public isWhisper () : boolean {
        if (Array.isArray(this.destination)) {
            return (<Array<number>> this.destination).length > 0;
        }
        return this.destination !== null && this.destination !== 0;
    }

    /**
     * Was this message sent by the current user?
     * @returns {boolean}
     */
    public isMine () : boolean {
        return this.origin === Application.getMyId();
    }

    /**
     * Returns an HTMLElement representing the Message. Can be null for Messages that should not be seen.
     * @returns {HTMLElement|Null}
     */
    public createHTML () : HTMLElement {
        var p = document.createElement("p");
        p.appendChild(document.createTextNode("_CHATMESSAGEUNKNOWNTYPE_"));
        p.dataset['a'] = this.msg;

        return p;
    }

    public getHTML () : HTMLElement {
        if (this.html === null) {
            this.html = this.createHTML();
        }
        return this.html;
    }

    public prepareSending () {
        this.origin = Application.getMyId();
        this.getLocalId();

        var html = this.getHTML();
        if (html !== null && this.html === html) {
            this.html.classList.add("chatMessageSending");

            var timeoutFunction = (function (message:Message) {
                var html = message.getHTML();
                html.classList.remove("chatMessageSending");
                html.classList.add("chatMessageError");

                var errorMessage = new ChatSystemMessage(true);
                errorMessage.addText("_CHATMESSAGENOTSENT_");
                errorMessage.addText(" ");

                var click = <Listener> {
                    message : message,
                    error : errorMessage,
                    handleEvent : function () {
                        var error = this.error.getElement();
                        if (error.parentNode !== null) {
                            error.parentNode.removeChild(error);
                        }

                        var html = this.message.getHTML();
                        html.classList.remove("chatMessageError");
                        UI.Chat.sendMessage(this.message);
                    }
                };

                errorMessage.addTextLink("_CHATMESSAGENOTSENTRESEND_", true, click);

                if (html.parentNode !== null) {
                    html.parentNode.insertBefore(errorMessage.getElement(), html.nextSibling);
                    UI.Chat.updateScrollPosition(true);
                }
            }).bind(null, this);

            this.sending = setTimeout(timeoutFunction, 8000);
        }
    }

    /**
     * Returns the request Special Value. Returns defaultValue if the requested special is not found.
     * @param id
     * @param defaultValue
     * @returns {any}
     */
    public getSpecial (id : string, defaultValue? : any) : any {
        if (this.special[id] !== undefined) {
            return this.special[id];
        }

        if (defaultValue !== undefined) {
            return defaultValue;
        }

        return null;
    }

    /**
     * Stores a Special Value for the assigned Id.
     * @param id
     * @param value
     */
    public setSpecial (id : string, value : any) {
        this.special[id] = value;
    }

    /**
     * Receives values from an Object.
     * @param obj
     */
    public updateFromObject (obj : Object) {
        for (var id in this) {
            if (obj[id] === undefined) continue;
            if (id === "localid") continue;
            this[id] = obj[id];
        }

        if (typeof this.special === "string") {
            this.special = JSON.parse(<string> this.special);
        }

        this.triggerUpdated();
    }

    /**
     * Exports Message as an object (meant for server).
     * @returns {{}}
     */
    public exportAsObject () : Object {
        var result = {};
        var attributes = [
            'destination', 'module', 'origin', 'roomid', 'date', "clone", 'localid', 'special'
        ];
        for (var i = 0; i < attributes.length; i++) {
            if (this[attributes[i]] !== undefined) {
                result[attributes[i]] = this[attributes[i]];
            }
        }

        result["message"] = this.msg;

        //result['special'] = JSON.stringify(this.special);
        return result;
    }

    /**
     * Processes a received SlashCommand from the user.
     * If true is returned, the system will assume that the slashcommand was valid. If false, it'll assume it was invalid.
     * @param slashCommand
     * @param msg
     * @returns {boolean}
     */
    public receiveCommand (slashCommand : string, msg : string) : boolean {
        this.msg = msg;
        return true;
    }

    public setMsg (str : string) {
        this.msg = str;
    }

    public getMsg () : string {
        if (this.msg === null) {
            return "";
        }
        return this.msg;
    }

    public unsetSpecial (id : string) {
        delete (this.special[id]);
    }

    public addUpdatedListener (list : Listener | Function) {
        this.updatedTrigger.addListener(list);
    }

    public triggerUpdated () {
        this.updatedTrigger.trigger(this);

        if (this.sending !== null) {
            clearTimeout(<number> this.sending);
            this.html.classList.remove("chatMessageSending");
            this.sending =  null;
        }

        if (this.localid !== null) {
            DB.MessageDB.releaseLocalMessage(this.localid);
        }
    }

    public doNotPrint () : boolean {
        if (this.clone && this.destination !== null) {
            return true;
        }
        return false;
    }
}