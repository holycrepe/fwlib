declare namespace OrangeCommands.Pages {
    import SymbolInfo = OrangeCommands.Elements.SymbolInfo;

    export interface PageInfo {
        index: number;
        name: string;
    }

    interface PageEnumerationOptions {
        currentOnly?: boolean;
        skipMaster?: boolean;
        max?: number;
        start?: number;
        data?: PageDataOptions;
    }

    interface PageCollection<T> {
        [index: number]: T;
    }
    interface PageCollectionElements extends PageCollection<OrangeCommands.PageElementState> {

    }
    interface PageCollectionSummary extends PageCollection<PageSummary> {

    }
    interface PageSummary {
        number: number,
        name?: string;
        names?: string[],
        symbols?: OrangeCommands.Elements.SymbolInfo[]
    }
    interface PageSummaryOptions {
        excludeSymbols?: boolean;
        excludeNames?: boolean;
        flatten?: 'names' | 'symbols';
        map?: keyof PageSummary;
        distinct?: keyof SymbolInfo;
        sort?: keyof SymbolInfo | keyof PageSummary;
    }
    interface PagesSummaryOptions {
        pages?: PageEnumerationOptions;
        summary?:PageSummaryOptions;
    }

    interface PageDataOptions {
        symbols?: Elements.SymbolDataOptions,
        symbolInfo?: Elements.SymbolDataOptions
        asPageElement?: boolean;
    }
}