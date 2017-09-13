import {CanvasColor, PageLocation} from "./PageEnums";
import {fwcmds} from "./pages.Types";
import AddPageOptions = fwcmds.pages.AddPageOptions;
import PageState = fwcmds.pages.PageState;
import PageExportState = fwcmds.pages.PageExportState;
import PageSize = fwcmds.pages.PageSize;

// declare namespace fwcmds {
//     export interface pages {
//         add(options?: AddPageOptions);
//         getState(dom?): PageState;
//         importTemplate(inPath: string, inName?: string, inCopyGuides?: boolean): PageState;
//         setExportState(state: PageExportState, dom?);
//         setSize(size: PageSize, dom?);
//     }
// }

export function add(options?: AddPageOptions);
export function getState(dom?): PageState;
export function importTemplate(inPath: string, inName?: string, inCopyGuides?: boolean): PageState;
export function setExportState(state: PageExportState, dom?);
export function setSize(size: PageSize, dom?);
export { CanvasColor, PageLocation };