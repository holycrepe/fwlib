export interface SvgOpenFileOptions {
    prompt?: boolean;
    path?: string;
}
declare module Svg {
    export interface SvgFile {
        insert(options?:SvgOpenFileOptions, dom?: Fw.FwDocument): Fw.FwElement;
        open(options?:SvgOpenFileOptions): Fw.FwElement;
    }
}