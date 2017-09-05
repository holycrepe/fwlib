///<reference path="panel.d.ts"/>
declare interface FwPanelOptions {
    inputSize?: number;
    labelSize?: number;
}

declare class FwPanel {
    get name():string;
    get contextPath():string;
    get scriptDirectory():string;
    get commandPanelDirectory():string;
    get toggleButtons():string[];
    get textInputs():string[];
    options: FwPanelOptions;

    constructor(panelInfo: fwlib.panel.PanelInfo, toggleButtons?: string[], textInputs?: string[], options?:FwPanelOptions);
    getFormHeading(heading:string);
    getButtonIcons(buttonName:string);
    getButtonIcon(buttonName:string):string;
    getSettingName(elementName:string):string;

}