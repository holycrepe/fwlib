

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
    getPageElements(options?:Pages.PageEnumerationOptions): Pages.PageElementsCollection;
    getPageElementsList(options?:Pages.PageEnumerationOptions): OrangeCommands.PageElementState[];
    setName(newName: string);
    setExportFormat(options?: ExportPageFormat);
    setExportFormatAsPNG24();
    setExportFormatAsPNG32();
    verticalTrim();
}