

import {LoDashStatic} from "../typings/lodash/index";

declare module fwlib {
    export interface FwLibLogger {
        (...args: object[]): boolean;
        (verbosity:number, ...args: object[]): boolean;
    }
    export interface ExtensionCommand {
        name: string;
        method?: Function;
        action?: string;
        title?: string;
        error?: string;
    }
    export interface ExtensionCommandMapping {
        [commandTitle: string]: string | Function
    }
    export interface ExtensionState {
        command: {
            name: string;
        }
    }
    export interface ExtensionInfo {
        title: string;
        api: object;
        methods: ExtensionCommandMapping;
        state: ExtensionState;
    }
    export class Logger {
        constructor(section?: string|string[], verbosity?: number|boolean, defaultLogLevel?: number);
        group(name: string);
        ungroup();
        log(level?: number, ...args: any[]);
        important(...args: any[]);
        error(...args: any[]);
        warn(...args: any[]);
        info(...args: any[]);
        debug(...args: any[]);
        noop(...args: any[]);
    }
    export interface utils {
        runCommand(extension: ExtensionInfo, cmdName?: string): boolean|string;
        // runCommand(cmdName: string, extensionInfo: ExtensionInfo): boolean|string;
        update<T>(inTarget?: T, ...sources: object[]): T;
        copyObject<T>(inObject?: T): T;
        clone<T>(obj?: T): T;
        Logger: Logger,
        log(...args: object[]): boolean;
        getLogger(section?: string|string[], verbosity?: number|boolean, defaultLogLevel?: number): Logger;
        noop(...args: object[]): boolean;
        stringify(obj): string;
        logify(header, data): void;
        toCamelCase(subject: string): string;
        capitalizeFirstLetter(subject: string): string;
        capitalize(subject: string): string;
        capitalizeWords(subject: string): string;
        proxifyDom(dom?): string;
        proxify(obj?): object;
        dump(obj): void;
        benchmark(func:Function);
        isArray(arg: any): boolean;
        getDate(...args: object[]): Date;
        getFile(...args: object[]): File;
        getTimestamp(): string;
        Date: Date;
        File: File;
    }
}
export interface FwModules {
    utils: fwlib.utils;
    JSON: JSON;
    _: LoDashStatic
}
export interface FwStatic {
    utils: fwlib.utils;
}