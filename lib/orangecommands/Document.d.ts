
/** OC.Doc Interface **/
export default interface DocumentStatic extends OrangeCommands.OcElementData {
    OrangeCommandsModuleTest();
    ExportPagesFlags: ExportPagesFlags;
    ExportFormats: ExportFormats;

    readonly bounds: PixelRectangle;
    readonly size: Size;
    readonly position: Position;

    getBounds(container?: PixelRectangle): PixelRectangle;
    getSize(container?: Size): Size;
    getPosition(container?: Size): Position;
    importPages(path: string, options?: ImportPagesOptions);
    /**
     *
     * @param {string} path
     * @param {number} pageNumber Page Number, starting from 1
     * @param {ImportPageOptions} options
     */
    importPage(path: string, pageNumber?: number, options?: ImportPageOptions);
    renamePages(options: RenamePagesOptions);
    insertSymbols(names: string[], options?: InsertSymbolOptions);
    getExportOptions(options?: ExportPagesOptions): ExportPagesOptions;
    exportAllPages(options?: ExportPagesOptions);
    exportMainPages(options?: ExportPagesOptions);
    exportCurrentPage(options?: ExportPagesOptions);
    exportPages(options?: ExportPagesOptions);
    // exportPagesAuto(options?: ExportPagesOptions);
    // exportPagesToFolder(options?: ExportPagesOptions);
    // exportPagesWithPrefix(options?: ExportPagesOptions);
    exportPage(path?: string, options?: ExportPagesOptions, operationState?: PageOperationState): void;
    exportPageAuto(options?: ExportPagesOptions, operationState?: PageOperationState);
    // exportPageToFolder(options?: ExportPagesOptions);
    isMasterPage(): boolean;
    isOpen(): boolean;
    isSaved(): boolean;
    isNew(): boolean;
    isEmpty(): boolean;
    path(): string;
    dump();
}


interface DocumentInternal extends OrangeCommands.OcElementData {
    processExportPagesOptions(options?: ExportPagesOptions): ExportPagesOptions;
    getExportPageName(options?: ExportPagesOptions): ExportPageName;
    getExportFileName(options?: ExportPagesOptions): ExportPageName;
}