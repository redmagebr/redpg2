module UI.Chat.Notification {
    var bar = document.getElementById("chatNotificationBar");
    while (bar.firstChild !== null) bar.removeChild(bar.firstChild);

    var reconnecting = new ChatNotificationIcon("icons-chatNotReconnecting", false);
    bar.appendChild(reconnecting.getElement());

    var disconnected = new ChatNotificationIcon("icons-chatNotDisconnected", true);
    disconnected.addText("_CHATDISCONNECTEDEXP_");
    bar.appendChild(disconnected.getElement());

    var icons = 0;

    export function showReconnecting () {
        if (reconnecting.show()) {
            icons++;
            updateIcons();
        }
        hideDisconnected();
    }

    export function hideReconnecting () {
        if (reconnecting.hide()) {
            icons--;
            updateIcons();
        }
    }

    export function hideDisconnected () {
        if (disconnected.hide()) {
            icons--;
            updateIcons();
        }
    }

    export function showDisconnected () {
        if (disconnected.show()) {
            icons++;
            updateIcons();
        }
        hideReconnecting();
    }

    function updateIcons () {
        if (icons === 0) {
            bar.classList.remove("activeIcon");
        } else {
            bar.classList.add("activeIcon");
        }
    }
}