module UI.Pica.Toolbar {
    var container = document.createElement("div");
    container.classList.add("pictureToolsContainer");
    UI.Pica.getPictureWindow().appendChild(container);

    var tools : Array<PicaTool> = [];

    export function updateVisibility () {
        for (var i = 0; i < tools.length; i++) {
            tools[i].updateVisibility();
        }
    }

    export function registerTool (tool : PicaTool) {
        container.appendChild(tool.getHTML());
        tools.push(tool);
    }
}