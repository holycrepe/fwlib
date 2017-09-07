

export default interface PagesStatic {
    lastPageIndex: number;
    count: number;
    info: Pages.PageInfo;
    getCount(): number;
    getInfo(): Pages.PageInfo;
    each(callback: (this: OrangeCommands.Page, page?: OrangeCommands.Page) => void, options?:Pages.PageEnumerationOptions);
    eachPageElements(callback: (this: OrangeCommands.PageElementState, page?: OrangeCommands.PageElementState) => void, options?:Pages.PageEnumerationOptions);
    withPage(callback: (this: OrangeCommands.Page, page?: OrangeCommands.Page) => void);
    withPageElements(callback: (this: OrangeCommands.PageElementState, page?: OrangeCommands.PageElementState) => void);
    getPageElements(options?:Pages.PageEnumerationOptions): Pages.PageCollectionElements;
    getPageElementsList(options?:Pages.PageEnumerationOptions): OrangeCommands.PageElementState[];
    getSummary(options?:Pages.PagesSummaryOptions): Pages.PageCollectionSummary;
    summarize(pages: Pages.PageCollectionElements, options?:Pages.PageSummaryOptions): Pages.PageCollectionSummary;
    summarizePage(page: OrangeCommands.PageElementState, options?:Pages.PageSummaryOptions): Pages.PageSummary;
    synchronizeSymbolNames(options?:Pages.PageEnumerationOptions): number[];
    setName(newName: string);
    setExportFormat(options?: ExportPageFormat);
    setExportFormatAsPNG24();
    setExportFormatAsPNG32();
    verticalTrim();
}