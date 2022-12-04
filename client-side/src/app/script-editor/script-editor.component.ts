import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IScriptClient, ScriptBlockEditor, ScriptEditor} from '../block-editor.model';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { ScriptEditorModule } from './script-editor.module';


@Component({
    selector: 'script-editor',
    templateUrl: './script-editor.component.html',
    styleUrls: ['./script-editor.component.scss']
})
export class ScriptEditorComponent implements OnInit {

    @Input() configuration: IScriptClient;
    @Input() id: string;

    private _pageParameters: any = {};
    @Input()
    set pageParameters(value: any) {
        this._pageParameters = value;
    }

    public title: string;
    
    @Input() isDraggable = false;
    @Input() showActions = true;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() editClick: EventEmitter<any> = new EventEmitter();

    dialogRef: MatDialogRef<any>;
    
    constructor(
        private translate: TranslateService,
        private viewContainerRef: ViewContainerRef,
        private addonBlockLoaderService: PepAddonBlockLoaderService) {

    }

    async ngOnInit(): Promise<void> {
        //this.title = this.configuration?.scripts[this.id].titleContent;
        //this.configuration.galleryConfig.editIndex = -1;
        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();
        
    }

    onRemoveClick() {
        this.removeClick.emit({id: this.id});
    }

    onEditClick() {
        this.editClick.emit({id: this.id});
    }

    onScriptFieldChange(key, event){
        // check if key already exists in the block && not empry string ( client side check)
        if(key === 'key' && event != ''){
            if(this.configuration.scripts.filter(script => script.key === event).length){
                // already exits
                this.hostEvents.emit({
                    action: 'show-modal',
                    title: this.translate.instant('ACTIONS.NOTICE'),
                    message: this.translate.instant('EDITOR.KEY_ALREADY_EXIST')
                });

                event = '';
            }     
        };

        const value = key.indexOf('image') > -1 && key.indexOf('src') > -1 ? event.fileStr :  event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        
        if(key === 'isDefaultScript'){
            this.configuration.scripts.forEach(scr => {
                scr.isDefaultScript = scr.id !== parseInt(this.id) ?  false : value;
            });
        }

        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.scripts[this.id][keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.scripts[this.id][key] = value;
        }

        this.updateHostObject();
    }

    private updateHostObject(updatePageConfiguration = false) {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration,
            updatePageConfiguration: updatePageConfiguration
        });
    }

    onSlideshowFieldChange(key, event){
        if(event && event.source && event.source.key){
            this.configuration.scriptConfig[key] = event.source.key;
        }
        else{
            this.configuration.scriptConfig[key] = event;
        }

        this.updateHostObject();
    }

    onHostEvents(event: any) {
        if(event?.url) {
            this.configuration.scripts[this.id].assetURL = encodeURI(event.url);
            this.configuration.scripts[this.id].asset = event.key;
            this.updateHostObject();
        }     
    }

    openScriptPickerDialog() {
        const script = this.configuration.scripts[this.id]['script'] || {};
        const fields = {};
        Object.keys(this._pageParameters).forEach(paramKey => {
            fields[paramKey] = {
                Type: 'String'
            }
        });

        script['fields'] = fields;

        this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'ScriptPicker',
            size: 'large',
            hostObject: script,
            hostEventsCallback: (event) => { 
                if (event.action === 'script-picked') {
                    this.configuration.scripts[this.id]['script'] = event.data;
                    this.updateHostObject(true);
                    this.dialogRef.close();
                } else if (event.action === 'close') {
                    this.dialogRef.close();
                }
            }
        });
    }

}
