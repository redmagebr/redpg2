module Application {
    export function getMe() {
        return Application.Login.getUser();
    }

    export function isMe (id : number) {
        if (!Application.Login.isLogged()) return false;
        return Application.Login.getUser().id === id;
    }

    export function getMyId () : number {
        if (getMe() !== null) {
            return getMe().id;
        }
        return 0;
    }
}