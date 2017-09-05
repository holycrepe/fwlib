declare class DomStorage<T> {
    constructor(name: string, defaults: T, checkAllPages?: boolean);
    save(dontDirtyDocument?: boolean);
    remove();
}