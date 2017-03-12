module UI.Pica.Toolbar {
    var container = document.createElement("div");
    container.id = "pictureToolsContainer";
    UI.Pica.getPictureWindow().appendChild(container);



    export function registerTool (tool : PicaTool) {
        container.appendChild(tool.getHTML());
    }
}