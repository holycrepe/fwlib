declare namespace ActionScript {
    export interface FlexDataGrid<T> {
        items: T[]
        selectedItem: T
        selectedItems: T[]
        selectedIndex: number
        selectedIndices: number[]
    }
    export interface FlexEventResult extends Array<string> {

    }
    export interface FlexDataItem<T> {
        data?: T
    }
    export interface FlexEvent<T> {
        altKey?: boolean;
        keyCode?: number;
        item?: FlexDataItem<any>;
        itemData?: any;
        currentValues: T;
        result: FlexEventResult;
    }
}