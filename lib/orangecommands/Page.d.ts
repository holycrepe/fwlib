
import {OrangeCommands} from "./Pages.Types";
import Pages = OrangeCommands.Pages;
import OcElementSnapshot = OrangeCommands.OcElementSnapshot;
import OcElementData = OrangeCommands.OcElementData;
import Elements = OrangeCommands.Elements;
import SymbolInfo = OrangeCommands.Elements.SymbolInfo;

export interface PageData extends OcElementSnapshot {
    readonly originalName: string;
    readonly name: string;
    readonly index: number;
    readonly number: number;
    readonly isMaster: boolean;
    readonly elementCount: number;
}

export interface PageStaticImpl extends PageData, OcElementData {
    getInfo(options?:Pages.PageStateOptions): PageClass|PageData;
    getElementCount(): number;
    verticalTrim();
    setExportFormat(options?: ExportPageFormat);
    setExportFormatAsPNG24();
    setExportFormatAsPNG32();
    getSymbolInfo(): SymbolInfo[];
    getSymbols(): Elements.Symbol[];

    synchronizeSymbolNames(options?:Pages.PageDataEnumerationOptions): string[];
    copySymbols(options?: InsertSymbolOptions);
}

export interface PageStatic extends PageStaticImpl {

}
export default class PageClass implements PageStatic {
    readonly originalName: string;
    readonly name: string;
    readonly index: number;
    readonly number: number;
    readonly isMaster: boolean;
    readonly elementCount: number;
    readonly symbolInfo: Elements.SymbolInfo[];
    readonly symbols: Elements.Symbol[];
    readonly elements: Fw.FwElement[];
    readonly elementData: LayerElementData;

    setName(newName: string);

    getInfo(options?:Pages.PageStateOptions): PageClass|PageData;
    getElementCount(): number;
    verticalTrim();
    setExportFormat(options?: ExportPageFormat);
    setExportFormatAsPNG24();
    setExportFormatAsPNG32();

    getElements(options?:LayerElementDataOptions): Fw.FwElement[];
    getElementData(options?:LayerElementDataOptions): LayerElementData;
    getSymbolInfo(options?:Elements.SymbolDataOptions): Elements.SymbolInfo[];
    getSymbols(options?:Elements.SymbolDataOptions): Elements.Symbol[];

    renameSymbols(options?:Elements.SymbolDataOptions): string[];
    synchronizeSymbolNames(options?:Elements.SymbolDataOptions): string[];
    copySymbols(options?: InsertSymbolOptions);
    copySymbolsReversed(options?: InsertSymbolOptions);
}



export class PageState implements PageData {
    originalName: string;
    name: string;
    index: number;
    number: number;
    isMaster: boolean;
    elementCount: number;
    elements: Fw.FwElement[];
    elementData: LayerElementData;
    symbolInfo: Elements.SymbolInfo[];
    symbols: Elements.Symbol[];

    constructor(options?:Pages.PageStateOptions);
}