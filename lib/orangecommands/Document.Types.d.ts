declare global {
    import PageInfo = OrangeCommands.Pages.PageInfo;
    type ExportPageFormat = 'CURRENT' | 'PNG24' | 'PNG32' | object;

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

    export interface RenamePagesOptions {
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
        page: PageInfo,
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
}
