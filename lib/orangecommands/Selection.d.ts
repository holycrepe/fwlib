export default interface Selection extends OrangeCommands.OcElementSnapshot {
    stored_selection: {};
    current: Element[];
    all: Element[];
    selectAll(): Element[];
    getAll(persist?: boolean): Element[];
    getCurrent(): Element[];
    clone(): Element[];
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