import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IScriptClient, ScriptBlockEditor, ScriptEditor, IHostObject} from '../block-editor.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class ScriptBlockClientComponent implements OnInit {
    
    @Input()
    set hostObject(value: IHostObject) {
        this._configuration = value?.configuration;
        this._parameters = value?.pageParameters || {};
    }

    private _parameters: any;

    private _configuration: IScriptClient;
    get configuration(): IScriptClient {
        return this._configuration;
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService, private routeParams: ActivatedRoute ) {

     }

    ngOnInit(): void {

        // When finish load raise block-loaded.
        this.hostEvents.emit({action: 'block-loaded'});
        // look for script_kes on the query , 
        // will not run the script without it
        if(this._parameters?.script_keys){
            //list of screen who should run (match key on the query string)
            let scriptToRun = [];
            // take the param json and change it to object
            let keys = this._parameters?.script_keys.split(',') || [];
            keys.forEach(key => {
                this.configuration.scripts.forEach(scr => {
                    if(key === scr.key){
                        scriptToRun.push(scr);
                    }
                })
            });

            setTimeout(() => {
                scriptToRun.forEach(scr => {
                     const runScriptData = scr?.script?.runScriptData || null;
                     if (runScriptData) {
                         // Implement script 
                         this.runScript(scr.script.runScriptData);
                     }
                 });
             },(parseInt(this.configuration?.scriptConfig?.minDelay || '1') * 1000));  
        } 
    }

    private getScriptParams(scriptData: any) {
        const res = {};
        const params = Object.entries(this._parameters) || [];
        if(this._parameters)
        params.forEach(([key, value]) => {
            if(key != 'script_keys'){
                res[key] = value; 
            } 
        });
        // if (scriptData) {
        //     // Go for all the script data and parse the params.
        //     Object.keys(scriptData).forEach(paramKey => {
        //         const scriptDataParam = scriptData[paramKey];
                
        //         // If the param source is dynamic get the value from the _parameters with the param value as key, else it's a simple param.
        //         if (scriptDataParam.Source === 'dynamic') {
        //             res[paramKey] = this._parameters[scriptDataParam.Value] || '';
        //         } else { // if (scriptDataParam.Source === 'static')
        //             res[paramKey] = scriptDataParam.Value;
        //         }
        //     });
        // }

        return res;
    }

    runScript(event) {
        // Parse the params if exist.
        const params = this.getScriptParams(event.ScriptData);
        
        this.hostEvents.emit({
            action: 'emit-event',
            eventKey: 'RunScript',
            eventData: {
                ScriptKey: event.ScriptKey,
                ScriptParams: params
            }
        });
    }

    ngOnChanges(e: any): void {
   
    }
}
