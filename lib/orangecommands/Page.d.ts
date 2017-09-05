
export default interface PageData extends OrangeCommands.OcElementSnapshot {
    readonly originalName: string;
    readonly name: string;
    readonly index: number;
    readonly isMaster: boolean;
    readonly elementCount: number;
}

export default interface Page extends PageData, OrangeCommands.OcElementData {
    getInfo(asPageElements?:boolean): OrangeCommands.Page|OrangeCommands.PageElementState;
    getElementCount(): number;
    verticalTrim();
    setExportFormat(options?: ExportPageFormat);
    setExportFormatAsPNG24();
    setExportFormatAsPNG32();
    getSymbolInfo(): Elements.SymbolInfo[];
    getSymbols(): Elements.Symbol[];
}

export default class PageClass implements Page {
    readonly originalName: string;
    readonly name: string;
    readonly index: number;
    readonly isMaster: boolean;
    readonly elementCount: number;
    readonly symbolInfo: Elements.SymbolInfo[];
    readonly symbols: Elements.Symbol[];
    readonly elements: Element[];
    readonly elementData: LayerElementData;

    setName(newName: string);

    getInfo(asPageElements?:boolean): OrangeCommands.Page|OrangeCommands.PageElementState;
    getElementCount(): number;
    verticalTrim();
    setExportFormat(options?: ExportPageFormat);
    setExportFormatAsPNG24();
    setExportFormatAsPNG32();

    getElements(ignoreWebLayers?: boolean): Element[];
    getElementData(ignoreWebLayers?: boolean): LayerElementData;
    getSymbolInfo(): Elements.SymbolInfo[];
    getSymbols(): Elements.Symbol[];
}


//
// export default class PageElements implements PageData {
//     readonly originalName: string;
//     readonly name: string;
//     readonly index: number;
//     readonly isMaster: boolean;
//     readonly elementCount: number;
//     readonly symbolInfo: Elements.SymbolInfo[];
//     readonly symbols: Elements.Symbol[];
//     readonly elements: Element[];
//     readonly elementData: LayerElementData;
// }