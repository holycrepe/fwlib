
export default interface PagesStatic {
    lastPageIndex: number;
    count: number;
    info: Pages.PageInfo;
    getCount(): number;
    getInfo(): Pages.PageInfo;


    getElements(options?:Pages.PageDataEnumerationOptions): Element[];
    getElementData(options?:Pages.PageDataEnumerationOptions): LayerElementData;

    each(callback: Pages.PageCallback, options?:Pages.PageDataEnumerationOptions);
    eachPageElements(callback: Pages.PageElementsCallback, options?:Pages.PageDataEnumerationOptions);
    withPage(callback: Pages.PageCallback);
    withPageElements(callback: Pages.PageElementsCallback);
    getPageElements(options?:Pages.PageDataEnumerationOptions): Pages.PageCollectionElements;
    getPageElementsList(options?:Pages.PageDataEnumerationOptions): OrangeCommands.PageElementState[];
    getSummary(options?:Pages.PagesSummaryOptions): Pages.PageCollectionSummary;
    summarize(pages: Pages.PageCollectionElements, options?:Pages.PageSummaryOptions): Pages.PageCollectionSummary;
    summarizePage(page: OrangeCommands.PageElementState, options?:Pages.PageSummaryOptions): Pages.PageSummary;
    synchronizeSymbolNames(options?:Pages.PageDataEnumerationOptions): number[];
    change(pageNumber: number): void;
    open(pageNumber: number, options?:Pages.PageStateOptions): void;
    setName(newName: string);
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