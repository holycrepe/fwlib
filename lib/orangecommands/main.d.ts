///<reference path="../Fw/index.d.ts"/>


import Elements = OrangeCommands.Elements;
import Pages = OrangeCommands.Pages;
import Page = OrangeCommands.Page;
import PageElementState = OrangeCommands.PageElementState;

declare namespace OrangeCommands {
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
    import { DocumentStatic as Document  } from "./Document";
    import { ElementsStatic as Elements  } from "./Elements";
    import { PagesStatic as Pages } from "./Pages";
    import { PageClass as Page, PageData as PageElementState } from "./Page";
    import { Guides } from "./Guides";
    import { Selection } from "./Selection";

    export interface OrangeCommandsStatic {
        VERSION: string;
        params: any;
        /*** Color Static */
        Color: Color;
        /*** Document Static */
        Document: Document;
        /*** Pages Static */
        Pages: Pages;
        /*** Page Class Static */
        Page: Page;
        /*** Elements Static */
        Elements: Elements;
        /*** Selection Static */
        Selection: Selection;
        /*** Guides Static */
        Guides: Guides;
        /*** UI Static */
        UI: UI;
        /*** Sort Static */
        Sort: Sort;
        /*** File Static */
        File: File;
        /*** User Static */
        User: User;
        /*** FW Static */
        FW: FW;
    }
}

declare global {
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
}
declare namespace orangecommands {
    export const VERSION: string;
    export const params: {};
    export function run();
}
declare global {
    export interface FwStatic {
        orangecommands: OrangeCommands.OrangeCommandsStatic;
    }

    export interface FwModules {
        orangecommands: OrangeCommands.OrangeCommandsStatic;
    }
}