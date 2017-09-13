declare namespace OcInternal {
    type PropertyDefinition = string | string[];
    export function defineElementAccessors(module:any, propertyNames: PropertyDefinition[]): void;
    export function defineGetters(obj:any, propertyNames: PropertyDefinition[]): void;
}