declare namespace OrangeCommands.Elements {
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
}