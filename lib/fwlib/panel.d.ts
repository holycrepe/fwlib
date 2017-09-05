declare namespace fwlib {
    namespace panel {
        interface PanelInfo {
            id?: string;
            key?: string;
            path?: string;
            name: string;
            directory: string;
        }
        interface PanelJsml extends Object {

        }
    }
    export interface panel {
        register(panelJSML:panel.PanelJsml);
        getCurrentInfo():panel.PanelInfo;
    }
}