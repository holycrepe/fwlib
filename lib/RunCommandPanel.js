"use strict";
// ===========================================================================


if (typeof require === "function")
    delete require;

(function MyFwCommandPanel() {
    var panelInfo = fwlib.panel.getCurrentInfo();
    panelInfo.path = panelInfo.name.replace(/^(My )?(.+?)?$/g, '$2');
    panelInfo.key = panelInfo.name.replace(/^(My )?(.+?)( Fork)?$/g, '$2');
    panelInfo.id = panelInfo.key.replace(/ +/g, '');
    //alert(panelInfo);

    // save off the currentScriptDir before running fwrequire, since that will
    // set currentScriptDir to null
    var currentScriptDir = fw.currentScriptDir,
        contextPath = fw.appJsCommandsDir + "/" + panelInfo.path + "/",
        useCommonBaseDir = false,
        fwRequireOptions;

    if (useCommonBaseDir) {
        if (typeof require != "function" || !require.version) {
            fw.runScript(currentScriptDir + "/../Common/fwrequire.js");
        }
        fwRequireOptions = { baseUrl: "../Common", contextPath: contextPath };
    } else {
        if (typeof require != "function" || !require.version) {
            fw.runScript(contextPath + "lib/fwrequire.js");
        }
        fwRequireOptions = { contextPath: contextPath };
    }
    var all=[];
    require.onResourceLoad = function (context, map, depArray) {
        all.push(map.name);
    };

    require(fwRequireOptions, [
            panelInfo.id  + "Panel",
            //"dojo/json"
        ],
        /**
         *
         * @param {LinkedImages.LinkedImagesPanel} FwCommandPanel
         */
        function(
            FwCommandPanel
            //JSON
        )
        {
            //alert("Run Command Panel: " + panelInfo.name);
            //alert(JSON.stringify(panelInfo, null, '  '));
            FwCommandPanel.run(panelInfo);
        });

})();
