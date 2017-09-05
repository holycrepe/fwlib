
import Elements = OrangeCommands.Elements
export default interface ElementsStatic {
    getSymbolInfo(elements: Element[]): Elements.SymbolInfo[];
    getSymbols(elements: Element[]): Elements.Symbol[];
}
