
import Elements = OrangeCommands.Elements
export default interface ElementsStatic {
    reposition(element?: Fw.FwElement, dom?: Fw.FwDocument, options?:Elements.RepositionOptions);
    center(element?: Fw.FwElement, dom?: Fw.FwDocument, options?:Elements.RepositionOptions);
    fitCanvas(element?: Fw.FwElement, dom?: Fw.FwDocument, options?:Elements.RepositionOptions);
    trimCanvas(element?: Fw.FwElement, dom?: Fw.FwDocument, options?:Elements.RepositionOptions);
    fitAndCenter(element?: Fw.FwElement, dom?: Fw.FwDocument, options?:Elements.RepositionOptions);
    getSymbol(element: Fw.FwElement, options?:Elements.SymbolDataOptions): Elements.Symbol|Elements.SymbolInfo;
    getSymbolInfo(elements: Fw.FwElement[], options?:Elements.SymbolDataOptions): Elements.SymbolInfo[];
    getSymbols(elements: Fw.FwElement[], options?:Elements.SymbolDataOptions): Elements.Symbol[];
    renameSymbol(symbol: Elements.SymbolInfo, renamer?:RenameState): boolean;
}
export interface ElementId {
    id: string;
    symbol: string;
    name: string;
    value: string;
}

export class ElementIdentifier implements ElementId {
    id: string;
    symbol: string;
    name: string;
    value: string;
    constructor(element:Fw.FwElement);
    compareTo(other:string|ElementId): number;
    equals(other:string|ElementId): boolean;
    match(elements: Fw.FwElement[]): OrangeCommands.Elements.ElementIdentifierMatch;
    fromElement(element: Fw.FwElement): ElementIdentifier;
    fromElements(elements: Fw.FwElement[]): ElementIdentifier[];
    filter(elements: Fw.FwElement[], identifiers: ElementIdentifier|ElementIdentifier[]): Fw.FwElement[];
}