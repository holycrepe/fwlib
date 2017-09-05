//import {Fw} from "../Fw/index";

// declare module fwlib {
//     export interface layers {
//         getElements(dom?:Fw.Document, includeWebLayers?:boolean): Element[];
//         getElementData(dom?:Fw.Document, includeWebLayers?:boolean): LayerElementData;
//         alertLayers (inDom:Fw.Document, inJustReturnOutput: boolean): string;
//         copyLayer(inLayer:Layer, inTargetDom:Fw.Document, inSourceDom:Fw.Document): void;
//         copyLayerBetweenPages(inLayer:Layer, inSourcePageIndex:number, inTargetPageIndex:number): void;
//         getLayerIndexByName(inLayerName:string, inDom:Fw.Document): number;
//         getTopLayerAncestorIndex(inLayerIndex:number, inDom:Fw.Document):number;
//         getTopLayerIndices(inDom:Fw.Document):number[];
//     }
// }
// declare namespace fwlib.layers2 {
//
//     interface LayerElementData {
//         count: number
//         names: string[],
//         elements: Element[]
//     }
//     export class Layer {
//         constructor(inConfig);
//         [attribute: string]: any;
//         disclosure: boolean;
//         locked: boolean;
//         name: string;
//         visible: boolean;
//         index: number;
//         sublayerIndex: number;
//         parent: Layer;
//         readonly allElements: Element[];
//         readonly elements: Element[];
//         readonly elemsandsublayers: Array;
//         readonly elemsIndex: number;
//         readonly isTopLayer: boolean;
//         readonly isWebLayer: boolean;
//         readonly layer: Fw.Layer;
//         readonly layerAbove: Fw.Layer;
//         readonly layerBelow: Fw.Layer;
//         readonly topLayerAbove: Fw.Layer;
//         readonly topLayerAncestor: Fw.Layer;
//         readonly topLayerBelow: Fw.Layer;
//         readonly sublayers: Layer[];
//
//         deleteAllElements();
//         deleteElements();
//         remove();
//         selectAllElements();
//         setElementLocked(inIndex:number, inLocked:boolean);
//         setElementVisible(inIndex:number, inVisible:boolean);
//         sublayer(inIndex:number): Layer;
//         sublayerByElemsIndex(inIndex:number): Layer;
//     }
//     export class LayerTree {
//         constructor(inDOM?:Fw.Document, inIgnoreWebLayers?:boolean);
//         currentLayer: Layer;
//         currentTopLayer: Layer;
//         readonly elementData: LayerElementData;
//         readonly elements: Element[];
//         readonly layers: Layer[];
//         readonly topLayers: Layer[];
//         readonly webLayer: Layer;
//         readonly webLayers: Layer[];
//         getContainingLayer(inElement:Element): Layer;
//         layer(inIndex:number|string): Layer;
//         refresh(): void;
//     }
//     export function getElements(dom?:Fw.Document, includeWebLayers?:boolean): Element[];
//     export function getElementData(dom?:Fw.Document, includeWebLayers?:boolean): LayerElementData;
//     export function alertLayers (inDom:Fw.Document, inJustReturnOutput: boolean): string;
//     export function copyLayer(inLayer:Layer, inTargetDom:Fw.Document, inSourceDom:Fw.Document): void;
//     export function copyLayerBetweenPages(inLayer:Layer, inSourcePageIndex:number, inTargetPageIndex:number): void;
//     export function getLayerIndexByName(inLayerName:string, inDom:Fw.Document): number;
//     export function getTopLayerAncestorIndex(inLayerIndex:number, inDom:Fw.Document):number;
//     export function getTopLayerIndices(inDom:Fw.Document):number[];
// }

export interface LayerElementData {
    count: number
    names: string[],
    elements: Element[]
}
export class Layer {
    constructor(inConfig);
    [attribute: string]: any;
    disclosure: boolean;
    locked: boolean;
    name: string;
    visible: boolean;
    index: number;
    sublayerIndex: number;
    parent: Layer;
    readonly allElements: Element[];
    readonly elements: Element[];
    readonly elemsandsublayers: Array;
    readonly elemsIndex: number;
    readonly isTopLayer: boolean;
    readonly isWebLayer: boolean;
    readonly layer: Fw.Layer;
    readonly layerAbove: Fw.Layer;
    readonly layerBelow: Fw.Layer;
    readonly topLayerAbove: Fw.Layer;
    readonly topLayerAncestor: Fw.Layer;
    readonly topLayerBelow: Fw.Layer;
    readonly sublayers: Layer[];

    deleteAllElements();
    deleteElements();
    remove();
    selectAllElements();
    setElementLocked(inIndex:number, inLocked:boolean);
    setElementVisible(inIndex:number, inVisible:boolean);
    sublayer(inIndex:number): Layer;
    sublayerByElemsIndex(inIndex:number): Layer;
}
export class LayerTree {
    constructor(inDOM?:Fw.FwDocument, inIgnoreWebLayers?:boolean);
    currentLayer: Layer;
    currentTopLayer: Layer;
    readonly elementData: LayerElementData;
    readonly elements: Element[];
    readonly layers: Layer[];
    readonly topLayers: Layer[];
    readonly webLayer: Layer;
    readonly webLayers: Layer[];
    getContainingLayer(inElement:Element): Layer;
    layer(inIndex:number|string): Layer;
    refresh(): void;
}


export function getElements(dom?:Fw.FwDocument, includeWebLayers?:boolean): Element[];
export function getElementData(elementsOrDom?:Fw.FwDocument|Element[], includeWebLayers?:boolean): LayerElementData;
export function alertLayers (inDom:Fw.FwDocument, inJustReturnOutput: boolean): string;
export function copyLayer(inLayer:Layer, inTargetDom:Fw.FwDocument, inSourceDom:Fw.FwDocument): void;
export function copyLayerBetweenPages(inLayer:Layer, inSourcePageIndex:number, inTargetPageIndex:number): void;
export function getLayerIndexByName(inLayerName:string, inDom:Fw.FwDocument): number;
export function getTopLayerAncestorIndex(inLayerIndex:number, inDom:Fw.FwDocument):number;
export function getTopLayerIndices(inDom:Fw.FwDocument):number[];