export module utils {
    export function update<T>(inTarget?:T, ...sources:object[]):T;
    export function copyObject<T>(inObject?:T):T;
    export function log(...args:object[]);
    export function isArray(arg:any):boolean;
    export function getDate(...args:object[]):Date;
    export function getFile(...args:object[]):File;
}