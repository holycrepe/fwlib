
/** OC.Doc Interface **/
export default interface DocumentStatic extends OrangeCommands.OcElementData {
    OrangeCommandsModuleTest();
    ExportPagesFlags: ExportPagesFlags;
    importPages(path: string, options: RenamePagesOptions);
    importPage(path: string, pageNumber?: number);
    renamePages(options: RenamePagesOptions);
    getExportOptions(options?: ExportPagesOptions): ExportPagesOptions;
    exportAllPages(options?: ExportPagesOptions);
    exportMainPages(options?: ExportPagesOptions);
    exportCurrentPage(options?: ExportPagesOptions);
    exportPages(options?: ExportPagesOptions);
    // exportPagesAuto(options?: ExportPagesOptions);
    // exportPagesToFolder(options?: ExportPagesOptions);
    // exportPagesWithPrefix(options?: ExportPagesOptions);
    exportPage(path?: string, options?: ExportPagesOptions, operationState?: OperationState): void;
    exportPageAuto(options?: ExportPagesOptions, operationState?: OperationState);
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