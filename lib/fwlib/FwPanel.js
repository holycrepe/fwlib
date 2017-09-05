"use strict";

/**
 * @module fwlib/FwPanel
 * @exports FwPanel
 */
define("fwlib/FwPanel", [
    "fwlib/utils"
],
    /**
     *
     * @param {fwlib.utils} utils
     */
    function(
    utils
)
{
    /**
     *
     * @param {String|fwlib.panel.PanelInfo} panelName The name of the panel's subdirectory
     * @param {string} [scriptDirectory] The path of the Command Panel's script
     * @param {String[]} [toggleButtons]
     * @param {String[]} [textInputs]
     * @param {FwPanelOptions} [options]
     * @constructor
     */
    function FwPanel(panelName, scriptDirectory, toggleButtons, textInputs, options) {
        /** @type {fwlib.panel.PanelInfo} **/
        var info;
        if (typeof panelName === 'object') {
            info = panelName;
            //noinspection JSValidateTypes
            options = textInputs;
            textInputs = toggleButtons;
            //noinspection JSValidateTypes
            toggleButtons = scriptDirectory;
        } else {
            //noinspection JSValidateTypes
            info = {
                directory: scriptDirectory,
                id: panelName.replace(/ +/g, ''),
                name: panelName,
                path: panelName,
            };
        }
        var contextPath = fw.appJsCommandsDir + "/" + info.path + "/";
        var commandPanelDirectory = info.directory + "/" + info.path + "/";

        if (!toggleButtons)
            toggleButtons = [];
        if (!textInputs)
            textInputs = [];
        if (typeof options !== "object")
            options = {};
        options.inputSize = options.inputSize || 220;
        options.labelSize = options.labelSize || 45;

        this.__defineGetter__("name", function() { return info.name; });
        this.__defineGetter__("path", function() { return info.path; });
        this.__defineGetter__("directory", function() { return info.directory; });
        this.__defineGetter__("scriptDirectory", function() { return info.directory; });
        this.__defineGetter__("commandPanelDirectory", function() { return commandPanelDirectory; });
        this.__defineGetter__("contextPath", function() { return contextPath; });
        this.__defineGetter__("toggleButtons", function() { return toggleButtons; });
        this.__defineGetter__("textInputs", function() { return textInputs; });
        /** @type {FwPanelOptions} **/
        this.options = options;
        this.results = [];
    }
    FwPanel.prototype.log = function(source, message) {
        message = message ? source + ": " + message : source;
        utils.log("FwPanel: " + this.name + ": " + message);
    };
    FwPanel.prototype.addEventResult = function (results, result, enabled) {
        this.results.push(result);
        if (enabled !== false)
            results.push(result);
    };
    FwPanel.prototype.initializeElements = function (inEvent, prefs) {
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
    FwPanel.prototype.initializeToggleButtons = function (results, prefs, elementNames) {
        if (typeof elementNames === 'undefined')
            elementNames = this.toggleButtons;
        for (var i = 0, j = elementNames.length; i < j; i++) {
            var elementName = elementNames[i];
            var settingName = utils.toCamelCase(elementName);
            this.addEventResult(results, [elementName, "selected", !!prefs[settingName]], true);
        }
    };
    FwPanel.prototype.initializeTextInputs = function (results, prefs, elementNames) {
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
    FwPanel.prototype.getFormHeading = function(heading) {
        return {
            FormHeading: {
                label: heading + ":",
                    style: {
                    fontWeight: 'bold',
                        fontSize: 12
                }
            }
        }
    };
    FwPanel.prototype.getButtonIcons = function(buttonName) {
        var self = this;
        var prefix = this.path + "/Icons/" + buttonName + "-icon",
            missing = false;

        function getButtonIconPath(buttonType) {
            return prefix + (buttonType ? "-" + buttonType : "") + ".png";
        }
        function getButtonIcon() {
            /** @type {string[]} **/
            var buttonTypes = [].slice.call(arguments, 0),
                path;
            buttonTypes.push('');
            for (var i=0,j=buttonTypes.length;i<j;i++) {
                var buttonType = buttonTypes[i];
                path = getButtonIconPath(buttonType);
                var fullPath  = self.directory + path;
                if (Files.exists(fullPath)) {
                    return path;
                }
                missing = true;
                //self.log('Button Icon: ' + buttonName + ' → ' + buttonType + ' @ ' + fullPath + ' not found');
            }
            return path;
        }

        var buttons = {
            normal: getButtonIcon(),
            hover: getButtonIcon('hover', 'active'),
            active: getButtonIcon('active', 'hover'),
            disabled: getButtonIcon('disabled')
        };
        //if (missing)
        //    self.log('Button Icons: ' + buttonName + ' \u2192 \n' + utils.stringify(buttons));
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

    FwPanel.prototype.getButtonIcon = function(buttonName) {
        var icons = this.getButtonIcons(buttonName);
        return icons.icon;
    };

    FwPanel.prototype.getTextInputSize = function(labels) {
        if (typeof labels === 'undefined')
            labels = 1;
        return this.options.inputSize - ((labels - 1) * this.options.labelSize);
    };

    return FwPanel;
});
