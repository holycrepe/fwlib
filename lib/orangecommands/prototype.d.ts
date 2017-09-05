declare interface ArrayConstructor<T> {
    includes(value:T): boolean;
    includesCaseInsensitive(value:T): boolean;
}
declare interface Array<T> {
    includes(value:T): boolean;
    includesCaseInsensitive(value:T): boolean;
}
declare interface Object {
    assign<T, TResult>(target:T, ...properties:Partial<TResult>[]): TResult;
}
declare interface Number {
    times(this: number, callback:(current:number)=>void);
}