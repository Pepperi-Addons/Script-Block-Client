import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { ScriptEditorModule } from '../script-editor/script-editor.module';
import { CommonModule } from '@angular/common';
import { PepAddonService, PepCustomizationService, PepFileService, PepHttpService } from '@pepperi-addons/ngx-lib';
import { ScriptBlockClientEditorComponent } from './index';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';

import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';

import { config } from '../addon.config';

@NgModule({
    declarations: [ScriptBlockClientEditorComponent],
    imports: [
        CommonModule,
        DragDropModule,
        MatTabsModule,
        PepButtonModule,
        PepTextboxModule,
        PepCheckboxModule,
        ScriptEditorModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [ScriptBlockClientEditorComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class ScriptBlockClientEditorModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
