///<reference path="panel.d.ts"/>
///<reference path="../Fw/index.d.ts"/>
import FlexEventResult = ActionScript.FlexEventResult;
import FlexEventResults = ActionScript.FlexEventResults;
import FlexEvent = ActionScript.FlexEvent;
import PanelInfo = fwlib.panel.PanelInfo;
// noinspection TypeScriptCheckImport
import {fwlib} from "./prefs";
import PrefsStorage = fwlib.prefs.PrefsStorage;
import UpdatePrefsCallback = fwlib.prefs.UpdatePrefsCallback;

declare interface FwPanelElements {
    text?: string[];
    toggles?: string[];
}
declare interface FwPanelOptions {
    inputWidth?: number;
    labelWidth?: number;
    toggleSize?: Size;
}
declare interface FwPanelFormItemOptions {
    name?: string;
    title?: string;
    description?: string;
}
declare interface FwPanelFormTextOptions extends FwPanelFormItemOptions {
    numLabels?: number;
    percentWidth?: number;
    widthOffset?: number;
}
declare interface FwPanelFormButtonOptions extends FwPanelFormItemOptions {
    action?: string;
    target?: string;
    icon?: string;
}
declare interface FwPanelFormToggleOptions extends FwPanelFormButtonOptions {

}
declare interface FwPanelFormEntryOptionsBase {

}
declare interface FwPanelFormEntryToggleOptions {
    sibling?: object;
    siblings?: object[];
    toggle?: FwPanelFormToggleOptions|boolean
    toggles?: FwPanelFormToggleOptions[]
}
declare interface FwPanelFormEntryOptions extends FwPanelFormEntryToggleOptions {
    text?: FwPanelFormTextOptions
}
declare interface FwPanelContainerOptions {
    includeSeparators?: boolean
}

declare class FwPanel {
    get name():string;
    get contextPath():string;
    get scriptDirectory():string;
    get commandPanelDirectory():string;
    get elements():FwPanelElements;
    get vRule():object;
    jsml: object;
    options: FwPanelOptions;
    result: FlexEventResult;
    onSettingUpdated:UpdatePrefsCallback;

    constructor(panelInfo: PanelInfo,
                prefs?:PrefsStorage,
                onSettingUpdated?:UpdatePrefsCallback,
                elements?: FwPanelElements,
                options?:FwPanelOptions);
    getTopRow(...groups:object[][]);
    getTopRow(includeSeparators:boolean, ...groups:object[][]);
    getFormHeading(heading:string);
    getFormEntry(title:string, options?:FwPanelFormEntryOptions);
    getFormToggleEntry(title:string, options?:FwPanelFormEntryOptions);
    getFormTextEntry(title:string, options?:FwPanelFormTextOptions);
    getToggleFormItem(title:string, options?:FwPanelFormToggleOptions);
    getTextItem(title:string, options?:FwPanelFormTextOptions);
    getToggleItem(title:string, options?:FwPanelFormToggleOptions);
    getToggleFormItem(title:string, options?:FwPanelFormToggleOptions);
    getToggleFormItems(target:string, ...toggles:FwPanelFormToggleOptions[]);
    getButtonIcons(buttonName:string);
    getButtonIcon(buttonName:string):string;
    getSettingName(elementName:string):string;

    log(source:string, message:string);
    addEventResult(results:FlexEventResults, result:FlexEventResult, enabled?:boolean);

    initializeElements(inEvent:FlexEvent, prefs?:PrefsStorage);
}