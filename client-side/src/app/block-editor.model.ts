

export interface IHostObject {
    pageParameters: {};
    configuration: IScriptClient;
    parameters: any;
}

export interface IScriptClient{
    scriptConfig: ScriptBlockEditor,
    scripts: Array<ScriptEditor>
}

export class ScriptBlockEditor {
    editIndex: string = '-1';
    hideLoader: boolean = false;
    matchContHeight: boolean = true;
    height: string = '15';
    minDelay: string = '0'
}

export class ScriptEditor {
    id: number;
    key: string = '';
    script: any;
    isDefaultScript: boolean = false;
}