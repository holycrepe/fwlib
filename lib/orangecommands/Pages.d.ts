
import {OrangeCommands} from "./Pages.Types";
import Pages = OrangeCommands.Pages;
import PageInfo = Pages.PageInfo;
import PageData from "./Page";

export default interface PagesStatic {
    lastPageIndex: number;
    count: number;
    info: PageInfo;
    getCount(): number;
    getInfo(): PageInfo;


    getElements(options?:Pages.PageDataEnumerationOptions): Fw.FwElement[];
    getElementData(options?:Pages.PageDataEnumerationOptions): LayerElementData;

    each(callback: Pages.PageCallback, options?:Pages.PageDataEnumerationOptions);
    eachPageElements(callback: Pages.PageElementsCallback, options?:Pages.PageDataEnumerationOptions);
    withPage(callback: Pages.PageCallback);
    withPageElements(callback: Pages.PageElementsCallback);
    getPageElements(options?:Pages.PageDataEnumerationOptions): Pages.PageCollectionElements;
    getPageElementsList(options?:Pages.PageDataEnumerationOptions): PageData[];
    getSummary(options?:Pages.PagesSummaryOptions): Pages.PageCollectionSummary;
    summarize(pages: Pages.PageCollectionElements, options?:Pages.PageSummaryOptions): Pages.PageCollectionSummary;
    summarizePage(page: PageData, options?:Pages.PageSummaryOptions): Pages.PageSummary;
    renameSymbols(options?:Pages.PageDataEnumerationOptions): number[];
    synchronizeSymbolNames(options?:Pages.PageDataEnumerationOptions): number[];
    change(pageNumber: number): void;
    open(pageNumber: number, options?:Pages.PageStateOptions): void;
    setName(newName: string, dom?: Fw.FwDocument);
    fitCanvas(dom?: Fw.FwDocument);
    trimCanvas(dom?: Fw.FwDocument);
    setExportFormat(options?: ExportPageFormat);
    setExportFormatAsPNG24();
    setExportFormatAsPNG32();
    verticalTrim();
}

export default interface PagesInternal {
    getRange(options:Pages.PageRangeOptions, count?: number): Pages.PageRange;
    each(callback: Pages.PageCallbacks, options?:Pages.PageDataEnumerationOptions);
    withPage(callback: Pages.PageCallbacks, options?:Pages.PageStateOptions);
}