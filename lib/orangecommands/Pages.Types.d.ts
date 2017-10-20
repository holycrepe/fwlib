
import PageStatic, {default as PageData} from "./Page";

declare namespace OrangeCommands.Pages {
    import SymbolInfo = OrangeCommands.Elements.SymbolInfo;

    export interface PageInfo {
        index: number;
        name: string;
    }

    interface PageRange {
        start?: number;
        end?: number;
    }
    interface PageRangeOptions extends PageRange {
        offset?: number;
        max?: number;
    }
    interface PageEnumerationOptions extends PageRangeOptions {
        currentOnly?: boolean;
        skipMaster?: boolean;
    }

    interface PageDataEnumerationOptions extends PageEnumerationOptions {
        data?: PageStateOptions;
        currentOnly?: boolean;
    }
    // type PageCallback = Function |
    //     ((this: OrangeCommands.Page, page: OrangeCommands.Page) => void);
    // type PageElementsCallback = Function |
    //     ((this: OrangeCommands.PageElementState, page: OrangeCommands.PageElementState) => void);
    interface PageCallbackInterface extends Function {
        (this: PageStatic): void;
        (this: PageStatic, page: PageStatic): void;
    }

    interface PageElementsCallbackInterface extends Function{
        (this: PageData): void;
        (this: PageData, page: PageData): void;
    }
    type PageCallback = Function | PageCallbackInterface;
    type PageElementsCallback = Function | PageElementsCallbackInterface;

    type PageCallbacks = Function | PageCallback | PageElementsCallback;

    interface PageCollection<T> {
        [index: number]: T;
    }
    interface PageCollectionElements extends PageCollection<PageData> {

    }
    interface PageCollectionSummary extends PageCollection<PageSummary> {

    }
    interface PageSummary {
        number: number,
        name?: string;
        names?: string[],
        symbols?: SymbolInfo[]
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
        pages?: PageDataEnumerationOptions;
        summary?:PageSummaryOptions;
    }

    interface PageStateOptions {
        symbols?: Elements.SymbolDataOptions,
        symbolInfo?: Elements.SymbolDataOptions
        asPageElement?: boolean;
        layers?: LayerElementDataOptions;
    }
}