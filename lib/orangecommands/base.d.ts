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
        readonly elements: Fw.FwElement[];
        readonly elementData: LayerElementData,
    }
    interface OcElementData extends OcSymbolInfo, OcElementSnapshot {
        getElements(options?:LayerElementDataOptions): Fw.FwElement[];
        getElementData(options?:LayerElementDataOptions): LayerElementData;
    }
}