module UI.Chat.Avatar {
    var avatarBox = document.getElementById("avatarBox");
    var $avatarBox = $(avatarBox);
    while (avatarBox.firstChild !== null) avatarBox.removeChild(avatarBox.firstChild);

    var height = 80;

    var upButton = document.getElementById("avatarUpButton");
    upButton.addEventListener("click", function () { UI.Chat.Avatar.moveScroll(-1); });

    var downButton = document.getElementById("avatarDownButton");
    downButton.addEventListener("click", function () { UI.Chat.Avatar.moveScroll(1); });

    var avatars : { [id : number] : ChatAvatar} = {};

    export function getMe () : ChatAvatar {
        return avatars[Application.Login.getUser().id];
    }

    export function resetForConnect () {
        for (var id in avatars) {
            avatars[id].reset();
        }
    }

    export function moveScroll (direction : number) {
        $avatarBox.finish();

        var currentHeight = avatarBox.scrollHeight;
        var currentScroll = avatarBox.scrollTop;
        var change = direction * height;

        if ((currentScroll + change) <= 0) {
            upButton.classList.add("inactive");
        } else {
            upButton.classList.remove("inactive");
        }

        if ((currentScroll + height + change) >= currentHeight) {
            downButton.classList.add("inactive");
        } else {
            downButton.classList.remove("inactive");
        }

        $avatarBox.animate({
            scrollTop : (currentScroll + change) + "px"
        });
    }

    export function updatePosition() {
        var currentHeight = avatarBox.scrollHeight;
        var currentScroll = avatarBox.scrollTop;

        if (currentHeight <= height) {
            avatarBox.scrollTop = 0;
        } else if (currentHeight <= (currentScroll + height)) {
            avatarBox.scrollTop = currentHeight - height;
        }

        if (avatarBox.scrollTop === 0) {
            upButton.classList.add("inactive");
        } else {
            upButton.classList.remove("inactive");
        }

        if ((avatarBox.scrollTop + height) === currentHeight) {
            downButton.classList.add("inactive");
        } else {
            downButton.classList.remove("inactive");
        }
    }

    export function updateFromObject (obj : Array<Object>, cleanup : boolean) {
        var cleanedup = [];

        for (var i = 0; i < obj.length; i++) {
            if (avatars[obj[i]['id']] === undefined) {
                avatars[obj[i]['id']] = new ChatAvatar();
                avatarBox.appendChild(avatars[obj[i]['id']].getHTML());
            }
            avatars[obj[i]['id']].updateFromObject(obj[i]);
            if (avatars[obj[i]['id']].isChangedOnline()) {
                var msg = new ChatSystemMessage(true);
                msg.addText(avatars[obj[i]['id']].getUser().getFullNickname() + " ");
                if (avatars[obj[i]['id']].online) {
                    msg.addText("_CHATHASCONNECTED_");
                } else {
                    msg.addText("_CHATHASDISCONNECTED_");
                }

                UI.Chat.printElement(msg.getElement(), false);
            }
            cleanedup.push(obj[i]['id'].toString());
        }
        UI.Chat.updateScrollPosition(true);

        if (cleanup) {
            for (var id in avatars) {
                if (cleanedup.indexOf(id.toString()) === -1) {
                    avatarBox.removeChild(avatars[id].getHTML());
                    delete(avatars[id]);
                }
            }
        }

        updatePosition();
    }
}