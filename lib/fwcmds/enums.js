"use strict";
define("fwcmds/enums", [], function() {
    var enums = {};
    var PageLocation;
    (function (PageLocation) {
        PageLocation[PageLocation["Default"] = 0] = "Default";
        PageLocation[PageLocation["Master"] = 1] = "Master";
        PageLocation[PageLocation["Start"] = 2] = "Start";
        PageLocation[PageLocation["Before"] = 3] = "Before";
        PageLocation[PageLocation["After"] = 4] = "After";
        PageLocation[PageLocation["End"] = 5] = "End";
    })(PageLocation = enums.PageLocation || (enums.PageLocation = {}));
    var CanvasColor;
    (function (CanvasColor) {
        CanvasColor[CanvasColor["Original"] = 0] = "Original";
        CanvasColor[CanvasColor["Transparent"] = 1] = "Transparent";
        CanvasColor[CanvasColor["White"] = 2] = "White";
        CanvasColor[CanvasColor["Custom"] = 3] = "Custom";
    })(CanvasColor = enums.CanvasColor || (enums.CanvasColor = {}));
    return {
        PageLocation: PageLocation,
        CanvasColor: CanvasColor
    };
});