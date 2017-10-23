declare namespace orangecommands {
}
declare namespace User {
    export function getLanguage();

    export function getJSDir();
}
declare namespace Document {
    export type ExportPageFormat = 'CURRENT' | 'PNG24' | 'PNG32' | object;

    interface ExportPageNamingOptions {
        template?: string;
        folder?: string;
        isAbsoluteFolder?: boolean;
        prefix?: string;
        page?: string;
        separator?: string;
        defaultType?: string;
        mainTypes?: { [prefix: string]: string[] };
        autoFolder?: boolean;
        promptPrefix?: boolean;
        promptFolder?: boolean;
        enableSeparator?: boolean;
        enablePrefix?: boolean;
        enableFolder?: boolean;
        delimiters?: RegExp;
    }

    interface RenamePagesOptions {
        pattern: string;
        replacement: string;
        defaultPattern?: string;
        defaultReplacement?: string;
        debug?: {
            options?: boolean;
            newName?: boolean;
        };
        currentPageOnly?: boolean;
    }

    interface ExportPagesOptions {
        naming?: ExportPageNamingOptions;
        main?: boolean;
        simple?: boolean;
        format?: ExportPageFormat;
        currentPageOnly?: boolean;
        debug?: {
            options?: boolean,
            processPageName?: boolean
            processDocName?: boolean
        }
    }

    interface ExportPageNamingResult {
        isMain: boolean;
        type: string;
        separator: string;
        size?: number;
        page: string;
        main: string;
        name: string;
        prioritySeparator: string;
        priority: string;
    }

    interface ExportPageName extends ExportPageNamingResult {
        prefix: string;
        suffix: string;
        document: string;
        docMain: string;
        file: string;
        folder: string;
        path: string;
    }

    interface OperationState {
        completed: number,
        number: number,
        page: Pages.PageInfo,
        extension?: string;
    }

    export function testOrangeCommandsDocumentNamespace();

    export function renamePages(options: RenamePagesOptions);

    export function getExportPagesOptions(options?: ExportPagesOptions): ExportPagesOptions;

    export function get_export_page_name(options?: ExportPagesOptions): ExportPageName;

    export function get_export_file_name(options?: ExportPagesOptions): ExportPageName;

    export function exportAllPages(options?: ExportPagesOptions);

    export function exportMainPages(options?: ExportPagesOptions);

    export function exportCurrentPage(options?: ExportPagesOptions);

    export function export_pages_in(options?: ExportPagesOptions);

    export function export_pages_with_prefix(options?: ExportPagesOptions);

    export function export_pages(options?: ExportPagesOptions);

    export function export_pages_auto(options?: ExportPagesOptions);

    export function export_page(options?: ExportPagesOptions, operationState?: OperationState);

    export function export_page_in(options?: ExportPagesOptions);

    export function export_in(path?: string, options?: ExportPagesOptions, operationState?: OperationState): void;

    export function set_export_format(options?: ExportPageFormat);

    export function set_export_as_png_24();

    export function set_export_as_png_32();

    export function is_master_page(): boolean;

    export function is_open(): boolean;

    export function is_saved(): boolean;

    export function is_new(): boolean;

    export function is_empty(): boolean;

    export function path(): string;

    export function dump();
}

declare namespace Guides {
    export function clear();

    export function get();

    export function add();

    export function remove();

    export function addVertical();

    export function addHorizontal();

    export function vertical_grid();

    export function horizontal_grid();
}
declare namespace Selection {
    export const stored_selection: {};

    export function all(): any[];

    export function clone(): any[];

    export function get_bounds();

    export function width(): number;

    export function height(): number;

    export function left(): number;

    export function right(): number;

    export function top(): number;

    export function bottom(): number;

    export function each(): Selection;

    export function save(): Selection;

    export function forget(): Selection;

    export function restore(): Selection;

    export function join(delimiter?: string): Selection;
}
declare namespace FW {
    export function getTMP();
}
declare namespace File {
    export function create();
}

declare interface PageClass {
    readonly originalName: string;
    readonly name: string;
    readonly index: number;
    readonly isMaster: boolean;

    getElementCount(): number;
    setName(newName: string);
    verticalTrim();
}
declare interface Page {
    readonly originalName: string;
    readonly name: string;
    readonly index: number;
    readonly isMaster: boolean;

    getElementCount(): number;
    setName(newName: string);
    verticalTrim();
}

declare namespace Pages {
    export interface PageInfo {
        index: number;
        name: string;
    }
    interface PageEnumerationOptions {
        currentOnly?: boolean;
        skipMaster?: boolean;
    }

    export function count(): number;

    export function info(): PageInfo;

    export function each(callback: (this: PageClass, page?: PageClass) => void, currentPageOnly?: boolean);
    export function withPage(callback: (this: PageClass, page?: PageClass) => void);


    export function getElementCount(): number;
    export function setName(newName: string);
    export function vertical_trim();
}

declare namespace Sort {
    export function by_y();

    export function by_x();
}
declare namespace Color {
    export function hex_to_rgba();
}
declare namespace UI {
    export function prompt();
}
declare namespace Text {

}
declare namespace Element {

}


declare namespace orangecommands {
    export const VERSION: string;
    export const params: {};

    export function run();
}