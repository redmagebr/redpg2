class ChatInfo {
    private floater : HTMLElement;
    private textNode : Text = document.createTextNode("null");
    private senderBold : HTMLElement = document.createElement("b");
    private senderTextNode : Text = document.createTextNode("_CHATSENDER_");
    private storyteller : boolean = false;


    constructor (floater : HTMLElement) {
        this.floater = floater;
        this.floater.style.display = "none";
        while (this.floater.firstChild !== null) this.floater.removeChild(this.floater.firstChild);
        this.senderBold.appendChild(this.senderTextNode);
        this.senderBold.appendChild(document.createTextNode(": "));
        this.floater.appendChild(this.senderBold);
        this.floater.appendChild(this.textNode);
        UI.Language.markLanguage(this.senderBold);
    }

    public showFor ($element : JQuery, message? : Message) {
        this.floater.style.display = "";
        var offset = $element.offset().top;
        var height = window.innerHeight;
        if (message !== undefined) {
            this.floater.style.bottom = (height - offset) + "px";
            this.textNode.nodeValue = message.getUser().getUser().getFullNickname();
            if (message.getUser().isStoryteller() !== this.storyteller) {
                this.senderTextNode.nodeValue = message.getUser().isStoryteller() ? "_CHATSENDERSTORYTELLER_" : "_CHATSENDER_";
                this.storyteller = message.getUser().isStoryteller();
                UI.Language.markLanguage(this.senderBold);
            }
        }
    }

    public hide () {
        this.floater.style.display = "none";
    }

    public bindMessage (message : Message, element : HTMLElement) {
        if (message instanceof MessageSystem) {
            return; // we don't bind system messages
        }

        var $element = $(element);
        element.addEventListener("mouseenter", {
            chatInfo : this,
            message : message,
            $element : $element,
            handleEvent : function () {
                this.chatInfo.showFor(this.$element, this.message);
            }
        });
        element.addEventListener("mousemove", {
            chatInfo : this,
            $element : $element,
            handleEvent : function () {
                this.chatInfo.showFor(this.$element);
            }
        });
        element.addEventListener("mouseleave", {
            chatInfo : this,
            handleEvent : function () {
                this.chatInfo.hide();
            }
        });
    }
}