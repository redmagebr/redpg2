class ChatFormState {
    private element : HTMLElement;

    private state : number = -1;

    public static STATE_NORMAL = 0;
    public static STATE_ACTION = 1;
    public static STATE_STORY = 2;
    public static STATE_OFF = 3;

    constructor (element : HTMLElement) {
        this.element = element;
        this.setState(ChatFormState.STATE_NORMAL);
    }

    public getState () {
        return this.state;
    }

    public isNormal () {
        return this.state === ChatFormState.STATE_NORMAL;
    }

    public isAction () {
        return this.state === ChatFormState.STATE_ACTION;
    }

    public isStory () {
        return this.state === ChatFormState.STATE_STORY;
    }

    public isOff () {
        return this.state === ChatFormState.STATE_OFF;
    }

    public setState (state : number) {
        if (this.state === state) {
            return;
        }

        var stateClass = ["icons-chatFormStateNormal", "icons-chatFormStateAction", "icons-chatFormStateStory", "icons-chatFormStateOff"];
        this.element.classList.remove(stateClass[this.state]);
        this.element.classList.add(stateClass[state]);
        this.state = state;
    }
}