
import Elements = OrangeCommands.Elements
export default interface ElementsStatic {
    getSymbol(element: Fw.FwElement, options?:Elements.SymbolDataOptions): Elements.Symbol|Elements.SymbolInfo;
    getSymbolInfo(elements: Fw.FwElement[], options?:Elements.SymbolDataOptions): Elements.SymbolInfo[];
    getSymbols(elements: Fw.FwElement[], options?:Elements.SymbolDataOptions): Elements.Symbol[];
    renameSymbol(symbol: Elements.SymbolInfo, renamer?:RenameState): boolean;
}
