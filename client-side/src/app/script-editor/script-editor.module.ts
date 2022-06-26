import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptEditorComponent } from './script-editor.component'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { PepFileService, PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { config } from '../addon.config';
import { MatDialogModule } from '@angular/material/dialog';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib/';
import { pepIconTextAlignCenter, pepIconTextAlignLeft, pepIconTextAlignRight, pepIconArrowBackRight, pepIconArrowBackLeft, pepIconArrowBack, pepIconArrowLeftAlt,pepIconArrowDown, pepIconArrowUp, PepIconModule, pepIconNumberPlus, PepIconRegistry, pepIconSystemBin, pepIconSystemBolt, pepIconSystemClose, pepIconSystemEdit, pepIconSystemMove } from '@pepperi-addons/ngx-lib/icon';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';

const pepIcons = [
    pepIconTextAlignCenter, 
    pepIconTextAlignLeft, 
    pepIconTextAlignRight, 
    pepIconArrowBackRight, 
    pepIconArrowBackLeft,
    pepIconArrowBack,
    pepIconSystemClose,
    pepIconNumberPlus,
    pepIconSystemBolt,
    pepIconSystemEdit,
    pepIconSystemMove,
    pepIconSystemBin,
    pepIconArrowLeftAlt,
    pepIconArrowDown,
    pepIconArrowUp
];

@NgModule({
    declarations: [ScriptEditorComponent],
    imports: [
        CommonModule,
        DragDropModule,
        PepButtonModule,
        PepMenuModule,
        PepTextboxModule,
        PepNgxLibModule,
        MatDialogModule,
        PepNgxCompositeLibModule,
        PepRemoteLoaderModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(addonService, ['ngx-lib', 'ngx-composite-lib'], config.AddonUUID),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [ScriptEditorComponent]
})

export class ScriptEditorModule {
    constructor(
        translate: TranslateService,
        private pepIconRegistry: PepIconRegistry,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
        this.pepIconRegistry.registerIcons(pepIcons);
    }
}
