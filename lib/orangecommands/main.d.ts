///<reference path="../Fw/index.d.ts"/>


// import Elements = OrangeCommands.Elements;
//import Pages = OrangeCommands.Pages;
//import PageElementState = OrangeCommands.PageElementState;


import PageStaticImpl from "./Page";

export namespace OrangeCommands {
    /**
     * Color Interface
     */
    export interface Color {
        hex_to_rgba(hexstr:string);
    }
    export interface UI {
        prompt();
    }
    export interface Sort {
        by_y();
        by_x();
    }
    export interface File {
        create();
    }
    export interface User {
        getLanguage();
        getJSDir();
    }

    export interface FW {
        getTMP();
    }
    import DocumentStatic from "./Document";
    import ElementsStatic from "./Elements";
    import PagesStatic from "./Pages";
    import PageStatic from "./Page";
    import Guides from "./Guides";
    import Selection from "./Selection";

    export interface OrangeCommandsStatic {
        VERSION: string;
        params: any;
        /*** Document Static */
        Document: DocumentStatic;
        /*** Elements Static */
        Elements: ElementsStatic;
        /*** Page Class Static */
        Page: PageStatic;
        /*** Pages Static */
        Pages: PagesStatic;
        /*** Selection Static */
        Selection: Selection;
        /*** Color Static */
        Color: Color;
        /*** Guides Static */
        Guides: Guides;
        /*** File Static */
        File: File;
        /*** Sort Static */
        Sort: Sort;
        /*** UI Static */
        UI: UI;
        /*** User Static */
        User: User;
        /*** FW Static */
        FW: FW;
    }
}

global {
    export interface Element {
        resize(width: number, height: number): void;
        kind(): string;
        is_group(): boolean;
        each_in_group(callback:(Element)=>void): void;
        is_symbol(): boolean;
        is_text(): boolean;
        set_position(x: number, y: number): void;
    }
    export interface Text {
        resize();
        resize(width: number, height: number);
    }

    export interface FwCommands {
        orangecommands: {
            api: OrangeCommands.OrangeCommandsStatic
            state: {}
        };
    }

    export const Document: OrangeCommands.DocumentStatic;
    export const Elements: OrangeCommands.ElementsStatic;
    export const Page: PageStaticImpl;
    export const Pages: OrangeCommands.PagesStatic;
    export const Selection: OrangeCommands.Selection;
    export const Color: OrangeCommands.Color;
    export const Guides: OrangeCommands.Guides;
    export const Sort: OrangeCommands.Sort;
    export const UI: OrangeCommands.UI;
    export const User: OrangeCommands.User;
    export const FW: OrangeCommands.FW;
}
export namespace orangecommands {
    export const VERSION: string;
    export const params: {};
    export function run();
}
export global {
    export interface FwStatic {
        orangecommands: OrangeCommands.OrangeCommandsStatic;
    }

    export interface FwModules {
        orangecommands: OrangeCommands.OrangeCommandsStatic;
    }
}