module UI.IFrame {
    var leftIFrame = <HTMLIFrameElement> document.getElementById("leftIFrameElement");
    var rightIFrame = <HTMLIFrameElement> document.getElementById("rightIFrameElement");

    var leftVideo = <HTMLVideoElement> document.getElementById("leftVideoElement");
    var rightVideo = <HTMLVideoElement> document.getElementById("rightVideoElement");

    export function openLeftIFrame (url : string) {
        UI.PageManager.callPage(UI.idLeftIFrame);
        leftIFrame.src = url;
    }

    export function openRightFrame (url : string) {
        UI.PageManager.callPage(UI.idRightIFrame);
        rightIFrame.src = url;
    }

    export function openLeftVideo (url : string) {
        UI.PageManager.callPage(UI.idLeftVideo);
        leftVideo.src = url;
    }

    export function openRightVideo (url : string) {
        UI.PageManager.callPage(UI.idRightVideo);
        rightVideo.src = url;
    }
}