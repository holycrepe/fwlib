import {OrangeCommands} from "./Pages.Types";

declare global {

    import Pages = OrangeCommands.Pages;

    type ExportPageFormat = 'CURRENT' | 'PNG24' | 'PNG32' | object;

    interface Position {
        size: Size;
        bounds: PixelRectangle;
    }

    interface ImportPagesOptions {
        range?: Pages.PageEnumerationOptions;
        'import'?: ImportPageOptions;
    }

    interface ImportPageOptions {
        boundingRectangle?: PixelRectangle;
        maintainAspectRatio?:boolean;
        /**
         * Page Number, starting from 1
         */
        pageNumber?:number;
        insertAfterCurrentPage?:boolean;
        exportFormat?: ExportPageFormat;
    }

    interface InsertSymbolOptions {
        location?: Point;
        preserveNamePrefix?: boolean;
        ignoredNames?: string[];
        newPage?: boolean;
        fitToCanvas?: boolean;
        reverse?: boolean;
        reverseLayers?: boolean;
        exportFormat?: ExportPageFormat;
    }

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
        outputDirectory?: RegExp;
        outputDirectoryReplacement?: string;
    }
    export interface RegexRule {
        search: RegExp;
        replacement: string;
    }
    export interface RenameOptions {
        pattern: string;
        replacement: string;
        defaultPattern?: string;
        defaultReplacement?: string;
        debug?: {
            options?: boolean;
            newName?: boolean;
        };
    }

    export interface RenameState {
        enabled?: boolean;
        options?: RenameOptions,
        rule?: RegexRule | null
    }

    export interface RenamePagesOptions extends RenameOptions {
        currentPageOnly?: boolean;
        prompt?: boolean;
    }

    interface ExportPagesOptions {
        naming?: ExportPageNamingOptions;
        main?: boolean;
        simple?: boolean;
        format?: ExportPageFormat;
        currentPageOnly?: boolean;
        flags?: string[];
        debug?: {
            options?: boolean,
            processDocName?: boolean
            processFolderName?: boolean
            processPageName?: boolean
            exportName?: boolean;
            exportNameSummary?: boolean;
            exportNameResults?: boolean;
            exportNameTemplates?: boolean;
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
    }

    interface PageOperationState extends OperationState {
        page: Pages.PageInfo,
        extension?: string;
    }

    interface ExportPagesFlags {
        CURRENT_FORMAT: 'currentFormat',
        PNG32_FORMAT: 'png32Format',
        MAIN_PAGES: 'mainPages',
        CURRENT_PAGE: 'currentPage',
        PROMPT_PREFIX: 'promptPrefix',
        PROMPT_FOLDER: 'promptFolder'
    }
    interface ExportFormats {
        CURRENT: 'CURRENT',
        PNG24: 'PNG24',
        PNG32: 'PNG32'
    }
}
