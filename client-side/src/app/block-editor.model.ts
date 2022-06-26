

export interface IHostObject {
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
    matchContHeight: boolean = false;
    height: string = '15';
    minDelay: string = '1'
}

export class ScriptEditor {
    id: number;
    key: string = '';
    script: any;
}