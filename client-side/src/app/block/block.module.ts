import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { ScriptBlockClientComponent } from './index';
import { config } from '../addon.config';
import { MatIconModule } from '@angular/material/icon';
import { PepIconModule, PepIconRegistry, pepIconSystemProcessing } from '@pepperi-addons/ngx-lib/icon';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';

const pepIcons = [
    pepIconSystemProcessing
];

export const routes: Routes = [
    {
        path: '',
        component: ScriptBlockClientComponent
    }
];

@NgModule({
    declarations: [ScriptBlockClientComponent],
    imports: [
        CommonModule,
        MatIconModule,
        PepIconModule,
        PepButtonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [ScriptBlockClientComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class ScriptBlockClientModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService,
        private pepIconRegistry: PepIconRegistry
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
        this.pepIconRegistry.registerIcons(pepIcons);
    }
}
