import {CanvasColor, PageLocation} from "./PageEnums";

interface PageSize {
    width: number;
    height: number;
}
interface AddPageOptions {
    name?: string;
    canvas?: CanvasColor;
    customColor?: string;
    templatePath?: string;
    copyGuides?: boolean;
    location?: PageLocation;
    insertClipboard?: boolean;
    size?: PageSize;
}
interface PageExportState {
    options: object;
    settings: object;
    matte: string;
}
interface PageState {
    background: string;
    number: number;
    name: string;
    size: PageSize;
    guides: object;
    'export': PageExportState;
}
export function add(options?:AddPageOptions);
export function getState(dom?):PageState;
export function importTemplate(inPath:string,inName?:string,inCopyGuides?:boolean):PageState;
export function setExportState(state:PageExportState, dom?);
export function setSize(size:PageSize, dom?);

