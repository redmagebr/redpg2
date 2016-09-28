module DB.MessageDB {
    export var messageById : {[id : number] : Message} = {};
    var messageByLocalId : {[id : number] : Message} = {};
    var lastLocal : number = 0;

    export function releaseMessage (id : number) : boolean {
        if (hasMessage(id)) {
            delete (messageById[id]);
            return true;
        }
        return false;
    }

    export function releaseLocalMessage (id : number | string) : boolean {
        if (hasLocalMessage(id)) {
            messageByLocalId[id].localid = null;
            delete (messageByLocalId[id]);
            return true;
        }
        return false;
    }

    export function releaseAllLocalMessages () {
        for (var id in messageByLocalId) {
            releaseLocalMessage(id);
        }
    }

    export function hasMessage (id : number) {
        return messageById[id] !== undefined;
    }

    export function hasLocalMessage (id : number | string) {
        return messageByLocalId[id] !== undefined;
    }

    export function getMessage (id : number) {
        if (hasMessage(id)) return messageById[id];
        return null;
    }

    export function getLocalMessage (id : number) {
        if (hasLocalMessage(id)) return messageByLocalId[id];
        return null;
    }

    export function registerLocally (msg : Message) {
        msg.localid = lastLocal++;

        messageByLocalId[msg.localid] = msg;
    }

    export function updateFromObject (obj : Array<Object>) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i]['localid'] !== undefined && hasLocalMessage(obj[i]['localid'])) {
                messageById[obj[i]['id']] = getLocalMessage(obj[i]['localid']);
            } else if (!hasMessage(obj[i]['id'])) {
                messageById[obj[i]['id']] = MessageFactory.createMessageFromType(obj[i]['module']);
            }
            messageById[obj[i]['id']].updateFromObject(obj[i]);
        }
    }
}