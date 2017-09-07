declare namespace Fw {
    export interface FwDocument {
        currentPageNum: number;
        pagesCount: number;
        pngText: PngText;
        docTitleWithoutExtension: string;
        javascriptString: string;
        pageName: string;
        guides: Guides;
        hasMasterPage(): boolean;
        addNewText(boundingRectangle: PixelRectangle, bInitFromPrefs?: boolean);
        addNewPage();
        reorderPages(origPos: number, newPos: number);
        changeCurrentPage(pageNum: number);
        deletePageAt(pageNum: number);
        setPageName(pageNum: number, newName: string);
        setElementName(name: string);
        setTextRuns(text);
        setExportOptions(options: ExportOptions);
        setMatteColor(bUseMatteColor:boolean, matteColor:string);
        selectAllOnLayer(layerIndex:number, bRememberSelection?:boolean, bToggleSelection?:boolean);
        setDocumentCanvasSize(boundingRectangle:PixelRectangle, currentPageOnly?:boolean);
        selectAll();
        selectParents();
        getSelectionBounds():PixelRectangle;
        addGuide(position:number, guidekind:GuideKind);
        removeAllGuides(guidekind?:GuideKind);
        setShowGuides(value:boolean);
        setTextLeading(leadingValue:number, leadingMode:TextLeadingMode);
        resizeSelection(width: number, height: number);
        moveSelectionBy(delta:Point, bMakeCopy?:boolean, doSubSel?:boolean);
        clipCopyJsToExecute(code:string);
    }
    type FwSelection = Element | Text;
    type FileBrowseType = 'open' | 'select' | 'save';
    type TextAttrLeadingMode = 'percentage';
    type TextLeadingMode = 'exact' | TextAttrLeadingMode;
    type GuideKind = 'horizontal' | 'vertical';
    export interface Guides {
        color: string;
        locked: boolean;
        hGuides: number[];
        vGuides: number[];
    }

    export interface ExportOptions extends Object {

    }
    export interface PngText {
        CreationTime: string;
        Software: string;
        [name: string]: string;
    }

    type TextTransformMode = 'paths' | 'pixels';
    type TextOrientation = "horizontal left to right" | "vertical right to left" | "horizontal right to left" | "vertical left to right";
    interface TextRuns extends Object {
        initialAttrs: TextAttrs;
        textRuns: SingleTextRun[];
    }
    interface SingleTextRun {

    }
    interface PathAttrs extends Object {
        brush: Brush;
        brushColor: string;
        brushPlacement: BrushPlacement;
        brushTexture: Texture;
    }
    type Texture = any;
    interface Brush {
        diameter: number;
        [name: string]: any;
    }
    type BrushPlacement = "inside" | "center"  | "outside";
    interface TextAttrs extends Object {
        leading: number;
        leadingMode: TextLeadingMode;
    }
    interface Effect extends Object {

    }
    interface EffectList {
        category: string;
        name: string;
        effects: Effect[]
    }
    export interface ElementMatrix {
        0: number,
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        6: number,
        7: number,
        8: number
    }

    export interface ElementTransform {
        matrix: ElementMatrix
    }
    export interface Layer {

    }
    export interface File {
        close();
        readline(): string;
        readlineUTF8(): string;
        write(textString: string): void;
        writeUTF8(textString: string): void;
    }
}

declare interface Object {
    __defineGetter__(properyName: string, getter: Function);
}

declare interface Exception {
    lineNumber: number;
    fileName: string;
}
declare interface FwModules {

}
declare global {
    export interface FwStatic {
        appName: string;
        version: number;
        modules: FwModules;
        commands: FwCommands;
        documents: Fw.FwDocument[];
        appJsCommandsDir: string;
        userJsCommandsDir: string;
        selection: Fw.FwSelection | Fw.FwSelection[];
        getDocumentDOM(): Fw.FwDocument;
        browseForFolderURL(title?: string, startFolder?: string | null): string;
        browseForFileURL(browseType: Fw.FileBrowseType, title?, previewArea?);
        getDocumentPath(document?: Fw.FwDocument): string;
        exportDocumentAs(document?: Fw.FwDocument | null, fileURL?: string | null, exportOptions?: Fw.ExportOptions | null);
        runScript(path: string);
        copy(code: string);
    }

    export interface Files {
        copy(docname1: string, docname2: string): boolean;
        createDirectory(dirname: string): boolean;
        createFile(fileURL: string, fileType: string, fileCreator: string): boolean;
        deleteFile(docOrDir: string): boolean;
        deleteFileIfExisting(docOrDir: string): boolean;
        enumFiles(docOrDir: string): string[];
        exists(docOrDir: string): boolean;
        getDirectory(docname: string): string;
        getExtension(docname: string): string;
        getFilename(docname: string): string;
        getLanguageDirectory(): string;
        getLastErrorString(): string;
        getTempFilePath(dirname?: string | null): string;
        isDirectory(dirname: string): boolean;
        makePathFromDirAndFile(dirname: string, plainFilename: string): string;
        open(docname: string, bWrite?: boolean): Fw.File;
        open(docname: string, encoding: string, bWrite?: boolean): Fw.File;
        rename(docname: string, newPlainFilename: string): string;
        setFilename(docname: string, newPlainFilename: string): string;
        swap(docname1: string, docname2: string): boolean;
    }
}
declare global {
    export const fw: FwStatic;
    export function alert(message?: any): void;
    export const Files: Files;
}

declare interface PixelRectangle {
    top: number,
    left: number,
    right: number,
    bottom: number
}
declare interface Point {
    x: number,
    y: number
}
declare interface Size {
    width: number,
    height: number
}
declare global {
    export interface FwElementImage {
        smartShapeCode?: string;
    }
    export interface FwElementUnknown {
        transform: Fw.ElementTransform,
        transformMode: string,
        urlText: string,
        javascriptString: string
        locked: boolean,
        targetText: string,
    }
    export interface Element extends FwElementImage, FwElementUnknown {
        altText: string,
        blendMode: string,
        customData: any,
        effectList: Fw.EffectList,
        height: number,
        isLayer: boolean,
        isSmartShape: boolean,
        left: number,
        mask: any,
        name: string,
        opacity: number,
        rawLeft: number,
        rawTop: number,
        rawWidth: number,
        rawHeight: number,
        top: number,
        pixelRect: PixelRectangle,
        visible: boolean,
        width: number,
    }
    export interface Instance extends Element {
        symbolID: string,
        symbolName: string,
        instanceType: string,
    }
    export interface Text extends Element {
        antiAliased: boolean,
        antiAliasMode: string,
        autoExpand: boolean,
        autoKern: boolean,
        orientation: Fw.TextOrientation,
        pathAttributes: Fw.PathAttrs,
        textRuns: Fw.TextRuns,
        textureOffset: Point
        transformMode: Fw.TextTransformMode,
    }

    export interface FwCommands {

    }
}
declare global {
    export function quit();
    export function clearInterval(handle: number): void;
    export function clearTimeout(handle: number): void;
    export function setInterval(handler: (...args: any[]) => void, timeout: number): number;
    export function setInterval(handler: any, timeout?: any, ...args: any[]): number;
    export function setTimeout(handler: (...args: any[]) => void, timeout: number): number;
    export function setTimeout(handler: any, timeout?: any, ...args: any[]): number;

}
declare interface FwArray<T> extends Array<T> {

}
