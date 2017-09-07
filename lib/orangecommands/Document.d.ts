
/** OC.Doc Interface **/
export default interface DocumentStatic extends OrangeCommands.OcElementData {
    OrangeCommandsModuleTest();
    ExportPagesFlags: ExportPagesFlags;
    renamePages(options: RenamePagesOptions);
    getExportPagesOptions(options?: ExportPagesOptions): ExportPagesOptions;
    processExportPagesOptions(options?: ExportPagesOptions): ExportPagesOptions;
    get_export_page_name(options?: ExportPagesOptions): ExportPageName;
    get_export_file_name(options?: ExportPagesOptions): ExportPageName;
    exportPages(options?: ExportPagesOptions);
    exportMainPages(options?: ExportPagesOptions);
    exportCurrentPage(options?: ExportPagesOptions);
    export_pages_in(options?: ExportPagesOptions);
    export_pages_with_prefix(options?: ExportPagesOptions);
    export_pages(options?: ExportPagesOptions);
    export_pages_auto(options?: ExportPagesOptions);
    export_page(options?: ExportPagesOptions, operationState?: OperationState);
    export_page_in(options?: ExportPagesOptions);
    export_in(path?: string, options?: ExportPagesOptions, operationState?: OperationState): void;
    is_master_page(): boolean;
    is_open(): boolean;
    is_saved(): boolean;
    is_new(): boolean;
    is_empty(): boolean;
    path(): string;
    dump();
}