
declare namespace fwlib.prefs {
    interface PrefsStorageOptions {
        debug?: boolean
    }
    interface UpdatePrefsCallback<T extends PrefsStorage<TPrefs>, TPrefs> {
        (prefs:Partial<T>): void;
    }
    export class PrefsStorage<T> {
        constructor(inName: string, inDefaults: T, options?: PrefsStorageOptions);
        save();
        remove();
    }
}
