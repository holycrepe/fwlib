declare class FwPanel {
    get name():string;
    get contextPath():string;
    get scriptDirectory():string;
    get commandPanelDirectory():string;
    get toggleButtons():string[];
    get textInputs():string[];
    options: FwPanelOptions;

    constructor(panelName:string, scriptDir?:string);
    getButtonIcons(buttonName:string);
    getButtonIcon(buttonName:string):string;
    getSettingName(elementName:string):string;
}
declare interface FwPanelOptions {
    inputSize?: number;
    labelSize?: number;
}