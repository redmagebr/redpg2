class MessageVote extends Message {
    public module : string = "vote";
    private voters : Array<UserRoomContext> = [];

    private voteAmountText : Text = document.createTextNode("0");
    private votersText : Text = document.createTextNode("");

    constructor () {
        super();
        this.addUpdatedListener(<Listener> {
            handleEvent : function (e : MessageVote) {
                if (e.getVoteTarget() !== null) {
                    var target = <MessageVote> DB.MessageDB.getMessage(e.getVoteTarget());
                    if (target !== null && target instanceof MessageVote) {
                        target.addVote(e.getUser());
                    }
                }
            }
        });
    }

    public setVoteTarget (id : number) {
        this.setSpecial("castvote", id);
    }

    public getVoteTarget () {
        return this.getSpecial("castvote", null);
    }

    public createHTML () {
        if (this.getVoteTarget() !== null) {
            return null;
        }

        var p = document.createElement("p");
        p.classList.add("chatMessageVote");

        var a = document.createElement("a");
        a.classList.add("chatMessageVoteAmount");
        a.appendChild(this.voteAmountText);
        p.appendChild(a);

        var reason = document.createElement("span");
        reason.classList.add("chatMessageVoteReason");
        reason.appendChild(document.createTextNode(this.getUser().getUniqueNickname() + " "));
        reason.appendChild(document.createTextNode("_CHATMESSAGEVOTECREATEDVOTE_"));
        reason.appendChild(document.createTextNode(": " + this.getMsg()));
        UI.Language.markLanguage(reason);
        p.appendChild(reason);

        var span = document.createElement("span");
        span.classList.add("chatMessageVoteVoters");
        span.appendChild(this.votersText);
        p.appendChild(span);

        var clickObj = <EventListenerObject> {
            message : this,
            handleEvent : function () {
                var vote = new MessageVote();
                vote.setVoteTarget(this.message.id);
                UI.Chat.sendMessage(vote);
            }
        };

        a.addEventListener("click", clickObj);

        return p;
    }

    public updateVoters () {
        this.voteAmountText.nodeValue = this.voters.length.toString();
        var voterNames = [];
        for (var i = 0; i < this.voters.length; i++) {
            voterNames.push(this.voters[i].getUniqueNickname());
        }
        if (this.voters.length > 0) {
            this.votersText.nodeValue = voterNames.join(", ") + ".";
        } else {
            this.votersText.nodeValue = "";
        }
    }

    public addVote (user : UserRoomContext) {
        if (this.voters.indexOf(user) === -1) {
            this.voters.push(user);
            this.updateVoters();
        } else {
            this.removeVote(user);
        }
    }

    public removeVote (user : UserRoomContext) {
        var index = this.voters.indexOf(user);
        if (index !== -1) {
            this.voters.splice(index, 1);
            this.updateVoters();
        }
    }
}

MessageFactory.registerMessage(MessageVote, "vote", ["/vote", "/voto", "/votar", "/vota"]);