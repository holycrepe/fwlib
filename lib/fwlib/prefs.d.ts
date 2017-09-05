import {Fw} from "../Fw/index";

declare namespace fwlib.prefs {
    interface PrefsStorageOptions {
        debug?: boolean
    }

    export class PrefsStorage<T> {
        test: Fw.FwDocument
        constructor(inName: string, inDefaults: T, options?: PrefsStorageOptions);
        save();
        remove();
    }
}
