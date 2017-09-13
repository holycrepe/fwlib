import {CanvasColor, PageLocation} from "./enums";

namespace fwcmds.pages {
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
        options: Fw.ExportOptions;
        settings: Fw.ExportSettings;
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
}