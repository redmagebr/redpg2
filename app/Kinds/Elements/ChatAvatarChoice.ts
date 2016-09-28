class ChatAvatarChoice {
    public id : string;
    private avatar : ChatAvatar = new ChatAvatar();

    private box : HTMLElement = document.createElement("div");
    private useButton : HTMLElement = document.createElement("a");
    private deleteButton : HTMLElement = document.createElement("a");

    public nameStr : String;
    public avatarStr : String;

    constructor (name : String, avatar : String) {
        var obj = {
            id : Application.Login.isLogged() ? Application.Login.getUser().id : undefined,
            persona : name,
            avatar : avatar
        };

        this.avatar.updateFromObject(obj);

        this.box.appendChild(this.avatar.getHTML());
        this.box.appendChild(this.useButton);
        this.box.appendChild(this.deleteButton);
        this.id = avatar + ";" + name;

        this.box.classList.add("chatAvatarChoiceBox");
        this.useButton.classList.add("chatAvatarChoiceBoxUse");
        this.deleteButton.classList.add("chatAvatarChoiceBoxDelete");

        this.useButton.addEventListener("click", <EventListenerObject> {
            name : name,
            avatar : avatar,
            handleEvent : function () {
                UI.Chat.PersonaDesigner.usePersona(this.name, this.avatar);
            }
        });

        this.deleteButton.addEventListener("click", <EventListenerObject> {
            choice : this,
            handleEvent : function () {
                UI.Chat.PersonaDesigner.removeChoice(this.choice);
            }
        });

        UI.Language.addLanguageTitle(this.useButton, "_CHATPERSONADESIGNERUSE_");
        UI.Language.addLanguageTitle(this.deleteButton, "_CHATPERSONADESIGNERDELETE_");

        this.nameStr = name;
        this.avatarStr = avatar;
    }

    public getHTML () : HTMLElement {
        return this.box;
    }
}