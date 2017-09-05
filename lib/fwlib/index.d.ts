
import {Layer, LayerElementData} from "layers"
declare module fwlib {
    export interface layers {
        getElements(dom?:Fw.FwDocument, includeWebLayers?:boolean): Element[];
        getElementData(dom?:Fw.FwDocument, includeWebLayers?:boolean): LayerElementData;
        alertLayers (inDom:Fw.FwDocument, inJustReturnOutput: boolean): string;
        copyLayer(inLayer:Layer, inTargetDom:Fw.FwDocument, inSourceDom:Fw.FwDocument): void;
        copyLayerBetweenPages(inLayer:Layer, inSourcePageIndex:number, inTargetPageIndex:number): void;
        getLayerIndexByName(inLayerName:string, inDom:Fw.FwDocument): number;
        getTopLayerAncestorIndex(inLayerIndex:number, inDom:Fw.FwDocument):number;
        getTopLayerIndices(inDom:Fw.FwDocument):number[];
    }
}
global {
    import * as layers from "layers"
    export interface FwModules {
        layers: fwlib.layers
    }
}