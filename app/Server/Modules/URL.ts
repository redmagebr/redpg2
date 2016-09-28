module Server.URL {
    export function fixURL (url : string) {
        if (url.indexOf("://") === -1) {
            url = "http://" + url;
        }

        // Fix Dropbox links to be direct
        if (url.indexOf("www.dropbox.com") !== -1) {
            url = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
            var interr = url.indexOf("?dl");
            if (interr !== -1) {
                url = url.substr(0, interr);
            }
        }

        return url;
    }
}