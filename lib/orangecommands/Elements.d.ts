
import Elements = OrangeCommands.Elements
export default interface ElementsStatic {
    getSymbol(element: Element, options?:Elements.SymbolDataOptions): Elements.Symbol|Elements.SymbolInfo;
    getSymbolInfo(elements: Element[], options?:Elements.SymbolDataOptions): Elements.SymbolInfo[];
    getSymbols(elements: Element[], options?:Elements.SymbolDataOptions): Elements.Symbol[];
}
