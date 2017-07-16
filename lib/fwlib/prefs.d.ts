declare interface PrefsStorageOptions {
    debug?: boolean
}
declare class PrefsStorage {
    constructor(inName: string, inDefaults: object, options?: PrefsStorageOptions);
    save();
    remove();
}