declare namespace OrangeCommands {
    interface OcSymbolSnapshot {
        readonly symbolInfo: Elements.SymbolInfo[];
        readonly symbols: Elements.Symbol[];
    }
    interface OcSymbolInfo extends OcSymbolSnapshot {
        getSymbolInfo(): Elements.SymbolInfo[];
        getSymbols(): Elements.Symbol[];
    }
    interface OcElementSnapshot extends OcSymbolSnapshot {
        readonly elements: Element[];
        readonly elementData: LayerElementData,
    }
    interface OcElementData extends OcSymbolInfo, OcElementSnapshot {
        getElements(ignoreWebLayers?:boolean): Element[];
        getElementData(ignoreWebLayers?:boolean): LayerElementData;
    }
}