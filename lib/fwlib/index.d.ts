declare interface ElementMatrix {
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
declare interface ElementTransform {
    matrix: ElementMatrix
}
declare interface PixelRectangle {
    top: number,
    left: number,
    right: number,
    bottom: number
}
declare interface FwElement {
    targetText: string,
    urlText: string,
    altText: string,
    instanceType: string,
    transform: ElementTransform,
    transformMode: string,
    symbolName: string,
    symbolID: string,
    isSmartShape: boolean,
    customData: any,
    effectList: any[],
    locked: boolean,
    mask: any,
    name: string,
    blendMode: string,
    opacity: number,
    visible: boolean,
    pixelRect: PixelRectangle,
    height: number,
    left: number,
    width: number,
    top: number,
    isLayer: boolean,
    javascriptString: string
}