declare namespace fwlib {
    export interface files {
        read(inFilePath:string|string[]):string|string[];
        readChunks(inFilePath:string|string[], inChunkSize: number, inCallback: Function):string|string[];
        write(inFilePath:string|string[], inText: string, inIncludeBOM?: boolean);
        append(inFilePath:string|string[], inText: string);
        readJSON<T>(inFilePath:string|string[], inDefaultData?: T):T;
        writeJSON<T>(inFilePath:string|string[], data: T, spacer?: string): void;
        getCreatedDate(inFilePath:string|string[]):Date;
        getModifiedDate(inFilePath:string|string[]):Date;
        getSize(inFilePath:string|string[], unit?: ''|'B'|'KB'|'MB'|'GB'|'TB'):number|string;
        copyDirectoryContents(fromPath:string|string[], sourcePath:string|string[]):void;
        getCurrentScriptUrl(errorFunction: Function): string;
        getCurrentScriptDirectory(errorFunction: Function): string;
        getCurrentScriptFilename(errorFunction: Function): string;
        createTempDirectory(): string;
        path(...paths: string[]): string;
        convertURLToOSPath(url: string, dontQuote?: boolean);
        getAbsolutePath(base: string, relative?: string);
        createDirectories(path: string): number;

    }
}