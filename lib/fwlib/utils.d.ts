declare module fwlib {
    export interface utils {
        update<T>(inTarget?: T, ...sources: object[]): T;

        copyObject<T>(inObject?: T): T;
        clone<T>(obj?: T): T;

        log(...args: object[]): boolean;

        stringify(obj): string;

        logify(header, data): void;

        toCamelCase(subject: string): string;

        capitalizeFirstLetter(subject: string): string;

        proxifyDom(dom?): string;

        proxify(obj?): object;

        isArray(arg: any): boolean;

        getDate(...args: object[]): Date;

        getFile(...args: object[]): File;

        getTimestamp(): string;

        Date: Date;
        File: File;
    }
}