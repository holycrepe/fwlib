declare namespace OrangeCommands.Pages {
    export interface PageInfo {
        index: number;
        name: string;
    }

    interface PageEnumerationOptions {
        currentOnly?: boolean;
        skipMaster?: boolean;
        max?: number;
        start?: number;
    }
    interface PageElementsCollection {
        [index: number]: OrangeCommands.PageElementState;
    }
}