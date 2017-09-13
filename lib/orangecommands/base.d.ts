declare namespace OrangeCommands {
    interface OcSymbolSnapshot {
        readonly symbolInfo: OrangeCommands.Elements.SymbolInfo[];
        readonly symbols: Elements.Symbol[];
    }
    interface OcSymbolInfo extends OcSymbolSnapshot {
        getSymbolInfo(options?:Elements.SymbolDataOptions): Elements.SymbolInfo[];
        getSymbols(options?:Elements.SymbolDataOptions): Elements.Symbol[];
    }
    interface OcElementSnapshot extends OcSymbolSnapshot {
        readonly elements: Element[];
        readonly elementData: LayerElementData,
    }
    interface OcElementData extends OcSymbolInfo, OcElementSnapshot {
        getElements(options?:LayerElementDataOptions): Element[];
        getElementData(options?:LayerElementDataOptions): LayerElementData;
    }
}