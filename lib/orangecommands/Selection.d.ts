import {ElementIdentifier} from "./Elements";

export default interface Selection extends OrangeCommands.OcElementData {
    stored_selection: {};
    current: Fw.FwSelection[];
    first: Fw.FwSelection;
    all: Fw.FwSelection[];
    names: string[];
    identifiers: ElementIdentifier[];
    selectAll(): Fw.FwSelection[];
    getAll(persist?: boolean): Fw.FwSelection[];
    getCurrent(): Fw.FwSelection[];
    getFirst(): Fw.FwSelection;
    getNames(): string[];
    setNames(names: string[]);
    getIdentifiers(): ElementIdentifier[];
    setIdentifiers(identifiers: ElementIdentifier|ElementIdentifier[]);
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