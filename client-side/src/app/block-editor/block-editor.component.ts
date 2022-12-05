import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PageConfiguration, PageConfigurationParameterBase } from '@pepperi-addons/papi-sdk';
import { IScriptClient, ScriptBlockEditor, ScriptEditor, IHostObject} from '../block-editor.model';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class ScriptBlockClientEditorComponent implements OnInit {
    
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    currentScriptIndex: number;
    blockLoaded = false;

    //@ViewChild('availableScriptsContainer', { read: ElementRef }) availableBlocksContainer: ElementRef;

    @Input()
    set hostObject(value: any) {
        if (value && value.configuration && Object.keys(value.configuration).length) {
                this._configuration = value.configuration;
                if(value.configurationSource && Object.keys(value.configuration).length > 0){
                    this.configurationSource = value.configurationSource;
                }
        } else {
            // TODO - NEED TO ADD DEFAULT CARD
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }

        this._pageParameters = value?.pageParameters || {};
        this._pageConfiguration = value?.pageConfiguration || this.defaultPageConfiguration;
    }

  
    public configurationSource: IScriptClient;
    private _pageParameters: any;
    get pageParameters(): any {
        return this._pageParameters;
    }

    private defaultPageConfiguration: PageConfiguration = { "Parameters": [] };
    private _pageConfiguration: PageConfiguration = this.defaultPageConfiguration;

    private _configuration: IScriptClient;
    get configuration(): IScriptClient {
        return this._configuration;
    }

    constructor(private translate: TranslateService, private dialogService: PepDialogService) {

    }

    async ngOnInit(): Promise<void> {
        
        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        const desktopTitle = await this.translate.get('EDITOR.DESC1').toPromise();
        
        this.blockLoaded = true;
    }

    ngOnChanges(e: any): void {

    }

    public onHostObjectChange(event) {
        if(event && event.action) {
            if (event.action === 'set-configuration') {
                this._configuration = event.configuration;
                this.updateHostObject();

                // Update page configuration only if updatePageConfiguration
                if (event.updatePageConfiguration) {
                    this.updatePageConfigurationObject();
                }
            }
            else if(event.action === 'show-modal') {
                

                const data = new PepDialogData({
                    title: event.title || '',
                    content: event.message || '',
                });

                this.dialogService.openDefaultDialog(data);
            }
        }
    }

    private updateHostObject() {
        
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }

    private updateHostObjectField(fieldKey: string, value: any) {
        
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey,
            value: value
        });
    }

    private getPageConfigurationParametersNames(): Array<string> {
        const parameters = new Set<string>();

        // Go for all cards scripts and add parameters to page configuration if Source is dynamic.
        for (let index = 0; index < this._configuration.scripts.length; index++) {
            const script = this._configuration.scripts[index];
            
            // if (script?.script?.runScriptData) {
            //     Object.keys(card.script.runScriptData?.ScriptData).forEach(paramKey => {
            //         const param = card.script.runScriptData.ScriptData[paramKey];
        
            //         if (!parameters.has(param.Value) && param.Source === 'dynamic') {
            //             parameters.add(param.Value);
            //         }
            //     });
            // }
        }

        // Return the parameters as array.
        return [...parameters];
    }

    private updatePageConfigurationObject() {
        //const params = this.getPageConfigurationParametersNames();
        this._pageConfiguration = this.defaultPageConfiguration;

        this._pageConfiguration.Parameters.push({
            Key: '*',
            Type: 'String',
            Consume: true,
            Produce: false
        });
        
        // Add the parameter to page configuration.
        /*for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
            const param = params[paramIndex];
            
            this._pageConfiguration.Parameters.push({
                Key: param,
                Type: 'String',
                Consume: true,
                Produce: false
            });
        }*/

        this.hostEvents.emit({
            action: 'set-page-configuration',
            pageConfiguration: this._pageConfiguration
        });
    }
    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
    }

    private getDefaultHostObject(): IScriptClient {
        return { scriptConfig: new ScriptBlockEditor(), scripts: [this.getDefaultScript()] };
    }

    private getDefaultScript(): ScriptEditor {
        let script = new ScriptEditor();
        script.id = 0;

        return script;
    }

    addNewScriptClick() {
        let script = new ScriptEditor();
        script.id = (this.configuration.scripts.length);

        this.configuration.scripts.push( script); 
        this.updateHostObject();  
    }

    onScriptEditClick(event){
       
        if(this.configuration.scriptConfig.editIndex === event.id){ //close the editor
            this.configuration.scriptConfig.editIndex = "-1";
        }
        else{ 
            this.currentScriptIndex = this.configuration.scriptConfig.editIndex = event.id;
        }

        this.updateHostObject();
    }

    onScriptRemoveClick(event){
        this.configuration.scripts.splice(event.id, 1);
        this.configuration.scripts.forEach(function(script, index, arr) {script.id = index; });
        this.updateHostObject();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
         moveItemInArray(this.configuration.scripts, event.previousIndex, event.currentIndex);
         for(let index = 0 ; index < this.configuration.scripts.length; index++){
            this.configuration.scripts[index].id = index;
         }
          this.updateHostObject();
        } 
    }

    // drop(event: CdkDragDrop<string[]>) {
    //     if (event.previousContainer === event.container) {
    //      moveItemInArray(this.configuration.cards, event.previousIndex, event.currentIndex);
    //      for(let index = 0 ; index < this.configuration.cards.length; index++){
    //         this.configuration.cards[index].id = index;
    //      }
    //       this.updateHostObject();
    //     } 
    // }

    onDragStart(event: CdkDragStart) {
        this.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        this.changeCursorOnDragEnd();
    }

    changeCursorOnDragStart() {
        document.body.classList.add('inheritCursors');
        document.body.style.cursor = 'grabbing';
    }

    changeCursorOnDragEnd() {
        document.body.classList.remove('inheritCursors');
        document.body.style.cursor = 'unset';
    }

    onScriptBlockFieldChange(key, event){

        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
       
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.scriptConfig[keyObj[0]][keyObj[1]] = value;
        }
        else {
            this.configuration.scriptConfig[key] = value;
        }
        
        //this.updateHostObject();
        this.updateHostObjectField(`scriptConfig.${key}`, value);
    }
}
