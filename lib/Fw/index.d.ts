declare namespace Fw {
    export interface FwDocument extends Size, PixelRectangle {
        currentPageNum: number;
        docTitleWithoutExtension: string;
        guides: Guides;
        javascriptString: string;
        pageName: string;
        pagesCount: number;
        pngText: PngText;
        addGuide(position:number, guidekind:GuideKind);
        addNewSymbol(type:SymbolType, name:string, bAddToDoc?:boolean, nineSliceScalingStatus?:boolean);
        addNewPage();
        addNewText(boundingRectangle: PixelRectangle, bInitFromPrefs?: boolean);
        align(alignmode:AlignmentMode, alignToCanvas?:boolean);
        changeCurrentPage(pageNum: number);
        clipCopyJsToExecute(code:string);
        clipPaste();
        deletePageAt(pageNum: number);
        exitSymbolEdit(level?:number)
        flattenSelection();
        getSelectionBounds():PixelRectangle;
        hasMasterPage(): boolean;
        importFile(fileURL:string, boundingRectangle?:PixelRectangle, bMaintainAspectRatio?:boolean, pageNumber?:number, insertAfterCurrentPage?:boolean);
        importSymbol(fileURL:string, addToDoc?:boolean, allowUISelection?:boolean);
        InsertPageForImport(fileURL:string, pageNumber?:number);
        insertSymbolAt(symbolName:string, locationPoint:Point);
        moveSelectionBy(delta:Point, bMakeCopy?:boolean, doSubSel?:boolean);
        /**
         *
         * @param {Point} delta A point that specifies the x,y coordinate values by which the handle is moved
         * @param {Fw.VectorFillHandle} whichHandle Specifies which handle to move and can be one of the following values: "start", "end1", "end2", "rotate1", or "rotate2". (Some fills ignore "end2".) Use "rotate1" or "rotate2" to rotate the end1 or end2 point around the start point.
         * @param {boolean} [constrainMovement] If true, movement is constrained to 45º increments
         * @param {boolean} [moveJustOneHandle] If true, only the specified handle moves. If false, other handles might move in sync when the specified handle is moved.
         */
        moveFillVectorHandleBy(delta:Point, whichHandle:VectorFillHandle, constrainMovement?:boolean, moveJustOneHandle?:boolean);
        removeAllGuides(guidekind?:GuideKind);
        setMasterPage(pageNumber: number);
        reorderPages(origPos: number, newPos: number);
        resizeSelection(width: number, height: number);
        selectAll();
        selectAllOnLayer(layerIndex:number, bRememberSelection?:boolean, bToggleSelection?:boolean);
        selectParents();
        setDocumentCanvasColor(color:FwColorString);
        setDocumentCanvasSize(boundingRectangle:PixelRectangle, currentPageOnly?:boolean);
        setDocumentCanvasSizeToDocumentExtents(bGrowCanvas:boolean);
        setDocumentCanvasSizeToSelection();
        setDocumentImageSize(boundingRectangle:PixelRectangle, resolution: Resolution, currentPageOnly?:boolean);
        setDocumentResolution(resolution:Resolution);
        /**
         *
         * @param {number} frameNum A zero-based integer that specifies the frame that contains the element or elements to be locked. To specify the current frame, pass -1.
         * @param {number} layerNum A zero-based integer that specifies the layer that contains the element or elements to be locked. To specify the current layer, pass -1.
         * @param {number} objectIndex A zero-based integer that specifies the element or elements to lock or unlock. 0 represents the topmost element in the specified layer. To lock or unlock all the elements in the specified layer, pass -1.
         * @param {boolean} lock If true, the element or elements are to be locked; if false, the elements are unlocked.
         * @param {boolean} allLayers If true, all layers are specified; false otherwise.
         * @param {boolean} lockLayers If true, locks all layers; false otherwise.
         */
        setElementLocked(frameNum:number, layerNum:number, objectIndex:number, lock:boolean, allLayers:boolean, lockLayers:boolean);
        setElementName(name: string);
        setElementVisibleByName(name: string, bShow:boolean);
        setExportOptions(options: ExportOptions);
        setExportSettings(options: ExportSettings);
        setMatteColor(bUseMatteColor:boolean, matteColor:string);
        setPageName(pageNum: number, newName: string);
        setShowGuides(value:boolean);
        setSymbolProperties(currentName:string, symbolType:SymbolType, newName:string, nineSliceScalingStatus?: boolean)
        setTextLeading(leadingValue:number, leadingMode:TextLeadingMode);
        setTextRuns(text);
    }
    type VectorFillHandle = 'start' | 'end1' | 'end2' | 'rotate1' | 'rotate2';
    type AlignmentMode = "left"| "right"| "top"| "bottom"| "center vertical"|"center horizontal";
    type SymbolType = 'graphic' | 'button' | 'animation';
    type ResolutionUnits = 'inch' | 'cm';
    interface Resolution {
        pixelsPerUnit: number,
        units: ResolutionUnits
    }
    type FwColorString = string;

    export interface ImageElement extends Element {
        smartShapeCode?: string;
    }
    export interface UnknownElement extends Element  {
        transform: Fw.ElementTransform,
        transformMode: string,
        urlText: string,
        javascriptString: string
        locked: boolean,
        targetText: string,
    }
    interface FwElement extends Element, Instance, Text, ImageElement, UnknownElement{

    }
    type FwSelection = FwElement;
    type FileBrowseType = 'open' | 'select' | 'save';
    type FileFormatName = "ADOBE AI3" | "Fireworks JavaScript" | "kMoaCfFormat_BMP" | "kMoaCfFormat_FreeHand7and8" | "kMoaCfFormat_GIF" | "kMoaCfFormat_JPEG" | "kMoaCfFormat_PICT" | "kMoaCfFormat_RTF" | "kMoaCfFormat_Text" | "kMoaCfFormat_TIFF" | "PNG" | "PS30";
    type TextAttrLeadingMode = 'percentage';
    type TextLeadingMode = 'exact' | TextAttrLeadingMode;
    type GuideKind = 'horizontal' | 'vertical';
    export interface Guides {
        color: FwColorString;
        locked: boolean;
        hGuides: number[];
        vGuides: number[];
    }

    export interface ExportOptions extends Object {

    }
    export interface ExportSettings extends Object {

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
    __defineGetter__(propertyName: string, getter: Function);
    __defineSetter__(propertyName: string, setter: Function);
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
        createFireworksDocument(size:Point, resolution:Fw.Resolution, backgroundColor: Fw.FwColorString);
        browseForFolderURL(title?: string, startFolder?: string | null): string;
        browseForFileURL(browseType: Fw.FileBrowseType, title?, previewArea?);
        locateDocDialog(maxNumDocs: number, formatList:Fw.FileFormatName[]);
        getDocumentPath(document?: Fw.FwDocument): string;
        exportDocumentAs(document?: Fw.FwDocument | null, fileURL?: string | null, exportOptions?: Fw.ExportOptions | null);
        runScript(path: string);
        copy(code: string);
        yesNoDialog(promptString:string): boolean;
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
        /**
         * Returns extension with leading period, e.g. '.png'
         * @param {string} docname
         * @return {string}
         */
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
    export interface Element {
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
        instanceType: Fw.SymbolType,
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
    export function prompt(promptText?: string, defaultValue?: string|number): string | null;
}
declare interface FwArray<T> extends Array<T> {

}
