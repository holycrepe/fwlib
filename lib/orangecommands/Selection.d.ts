export default interface Selection extends OrangeCommands.OcElementData {
    stored_selection: {};
    current: Fw.FwSelection[];
    all: Fw.FwSelection[];
    selectAll(): Fw.FwSelection[];
    getAll(persist?: boolean): Fw.FwSelection[];
    getCurrent(): Fw.FwSelection[];
    clone(): Fw.FwSelection[];
    get_bounds(): PixelRectangle;
    width(): number;
    height(): number;
    left(): number;
    right(): number;
    top(): number;
    bottom(): number;
    each(callback:(selection:Fw.FwSelection)=>void): Selection;
    save(): Selection;
    forget(): Selection;
    restore(): Selection;
    join(delimiter?: string): Selection;
}