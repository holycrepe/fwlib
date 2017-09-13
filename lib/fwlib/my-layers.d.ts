declare interface LayerElementData {
    count: number
    names: string[],
    elements: Fw.FwElement[]
}
declare interface LayerElementDataOptions {
    includeWebLayers?: boolean;
}