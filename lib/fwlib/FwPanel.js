/**
 * @module fwlib/FwPanel
 * @exports FwPanel
 */
define("fwlib/FwPanel", [
    "fwlib/utils"
],
    /**
     *
     * @param {module:fwlib/utils} utils
     */
    function(
    utils
)
{
    /**
     *
     * @param {String} panelName The name of the panel's subdirectory
     * @param {String} [scriptDirectory] The path of the Command Panel's script
     * @param {String[]} [toggleButtons]
     * @param {String[]} [textInputs]
     * @param {FwPanelOptions} [options]
     * @constructor
     */
    function FwPanel(panelName, scriptDirectory, toggleButtons, textInputs, options) {
        var contextPath = fw.appJsCommandsDir + "/" + panelName + "/";
        var commandPanelDirectory = scriptDirectory + "/" + panelName;
        if (!toggleButtons)
            toggleButtons = [];
        if (!textInputs)
            textInputs = [];
        if (typeof options !== "object")
            options = {};
        options.inputSize = options.inputSize || 220;
        options.labelSize = options.labelSize || 45;

        this.__defineGetter__("name", function() { return panelName; });
        this.__defineGetter__("scriptDirectory", function() { return scriptDirectory; });
        this.__defineGetter__("commandPanelDirectory", function() { return commandPanelDirectory; });
        this.__defineGetter__("contextPath", function() { return contextPath; });
        this.__defineGetter__("toggleButtons", function() { return toggleButtons; });
        this.__defineGetter__("textInputs", function() { return textInputs; });
        /** @type {FwPanelOptions} **/
        this.options = options;
        this.results = [];
        this.log = function(source, message) {
            message = message ? source + ": " + message : source;
            utils.log("FwPanel: " + this.name + ": " + message);
        };
        this.addEventResult = function (results, result, enabled) {
            this.results.push(result);
            if (enabled !== false)
                results.push(result);
        };
        this.initializeElements = function (inEvent, prefs) {
            var results = inEvent.result;
            var source = "Initializing Elements";
            //this.log(source, "Start");
            //this.log(source, "Toggle Buttons");
            this.initializeToggleButtons(results, prefs);
            //this.log(source, "Text Inputs");
            this.initializeTextInputs(results, prefs);
            //this.log(source, "Complete");
            return results;
        };
        this.initializeToggleButtons = function (results, prefs, elementNames) {
            if (typeof elementNames === 'undefined')
                elementNames = this.toggleButtons;
            for (var i = 0, j = elementNames.length; i < j; i++) {
                var elementName = elementNames[i];
                var settingName = utils.toCamelCase(elementName);
                this.addEventResult(results, [elementName, "selected", !!prefs[settingName]], true);
            }
        };
        this.initializeTextInputs = function (results, prefs, elementNames) {
            if (typeof elementNames === 'undefined')
                elementNames = this.textInputs;
            for (var i = 0, j = elementNames.length; i < j; i++) {
                var elementName = elementNames[i];
                var settingName = utils.toCamelCase(elementName);
                var value = prefs[settingName];
                if (typeof value === "undefined")
                    continue;
                //this.log("Text Input: " + elementName + ": " + value);
                this.addEventResult(results, [elementName, "text",  value], true);
            }
        };
        this.getButtonIcons = function(buttonName) {

            var prefix = this.name + "/Icons/" + buttonName + "-icon";
            function getButtonIcon(buttonType) {
                return prefix + (buttonType ? "-" + buttonType : "") + ".png";
            }
            var buttons = {
                normal: getButtonIcon(),
                hover: getButtonIcon('hover'),
                active: getButtonIcon('active'),
                disabled: getButtonIcon('disabled')
            };
            return {
                icon: buttons.normal,
                overIcon: buttons.hover,
                downIcon: buttons.active,
                selectedDownIcon: buttons.active,
                selectedUpIcon: buttons.active,
                selectedOverIcon: buttons.hover,
                selectedDisabledIcon: buttons.disabled,
                disabledIcon: buttons.disabled
            }
        };

        this.getButtonIcon = function(buttonName) {
            var icons = this.getButtonIcons(buttonName);
            return icons.icon;
        };
    }

    return FwPanel;
});
