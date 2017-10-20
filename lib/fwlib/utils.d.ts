

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
    export type ColorRGBA = [number, number, number, number];
    interface RgbaArray {
        0: number;
        1: number;
        2: number;
        3: number;
    }
    export class Logger {
        constructor(section?: string|string[], verbosity?: number|boolean, defaultLogLevel?: number);
        private _sections: string[];
        private updatePrefixes();
        isActive(level?:number|boolean): boolean;

        /**
         * Checks if Logger is enabled
         * Uses the Logger's Current Verbosity and Default Log Level.
         */
        get active();

        /**
         * Log Level above which messages will be ignored.
         * If true or -1, messages are never ignored
         * If false or 0, messages are always ignored.
         */
        get verbosity(value: number|boolean);

        /**
         * Sets Verbosity: Log Level above which messages will be ignored.
         * If true or -1, messages are never ignored
         * If false or 0, messages are always ignored.
         */
        set verbosity(value: number|boolean);

        /**
         * Log Level used by log().
         * Default Level is 4
         */
        get level(): number;

        /**
         * Sets Level: Log Level used by log().
         * Default Level is 4
         */
        set level(value:number): number;

        /**
         * Gets the Sections of the Logger as a single string,
         * delimited by colons (': ')
         * @return {string}
         */
        get section(): string;

        /**
         * Sets the Sections of the Logger from a string.
         * @param value {string}
         */
        set section(value: string);

        /**
         * Gets the Sections of the Logger as an array of strings.
         * @return {string[]}
         */
        get sections(): string;

        /**
         * Sets the Sections of the Logger from a string or array of strings.
         * @param value {string|string[]}
         */
        set sections(value: string|string[]);

        /**
         * Gets the Groups of the Logger as an array of strings.
         * @return {string[]}
         */
        get groups(): string;


        group(name: string);
        ungroup();
        log(level?: number, ...args: any[]);
        important(...args: any[]);
        error(...args: any[]);
        warn(...args: any[]);
        info(...args: any[]);
        debug(...args: any[]);
        trace(...args: any[]);
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
        getCommonPrefix(strings: string[]): string;
        proxifyDom(dom?): string;
        proxify(obj?): object;

        defineClass<T>(inConstructor:Function, inPrototype:object, inSuper?: object): T;
        hexToRGBA(hex: string, alpha?: number): ColorRGBA;
        hexToRGBAString(hex: string, alpha?: number): string;
        parsePercentage(value:number, range?: number):number;
        reducePrecision(value:number):number;
        trim(subject:string):string;
        supplant(template:string, replacements?: object): string;

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