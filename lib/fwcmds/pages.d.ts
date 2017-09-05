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

declare namespace fwcmds {
    export interface pages {
        add(options?: AddPageOptions);
        getState(dom?): PageState;
        importTemplate(inPath: string, inName?: string, inCopyGuides?: boolean): PageState;
        setExportState(state: PageExportState, dom?);
        setSize(size: PageSize, dom?);
    }
}