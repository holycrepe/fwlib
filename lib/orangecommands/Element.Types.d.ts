declare namespace OrangeCommands.Elements {
    export interface ElementIdentifierMatch {
        success: boolean;
        value?: Fw.FwElement;
    }
    export interface SymbolInfo {
        id: string;
        name: string;
        elementName: string;
        type: Fw.SymbolType;
        originalName?: string;
    }
    export interface Symbol extends SymbolInfo {
        element: Fw.FwElement;
    }
    export interface SymbolDataOptions {
        full?: boolean;
        synchronizeNames?: boolean;
        includeElementReference?: boolean;
        layers?: LayerElementDataOptions;
        rename?: RenameState
    }
    export type AlignmentMode = Fw.AlignmentMode | 'center';
    export type FitToCanvasMode = 'grow' | 'shrink' | 'both';
    export interface RepositionOptions {
        align?: boolean;
        alignment?: AlignmentMode
        fitToCanvas?: boolean;
        fitToCanvasMode?: FitToCanvasMode;
    }
}