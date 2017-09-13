declare namespace OrangeCommands.Elements {
    export interface SymbolInfo {
        id: string;
        name: string;
        elementName: string;
    }
    export interface Symbol extends SymbolInfo {
        element: Element;
    }
    export interface SymbolDataOptions {
        full?: boolean;
        synchronizeNames?: boolean;
        includeElementReference?: boolean;
        layers?: LayerElementDataOptions;
    }
}