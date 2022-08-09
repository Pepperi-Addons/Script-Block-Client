import { BrowserModule } from '@angular/platform-browser';
import { Component, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';

import { AppComponent } from './app.component';
import { ScriptBlockClientComponent, ScriptBlockClientModule } from './block';
import { ScriptBlockClientEditorComponent, ScriptBlockClientEditorModule } from './block-editor';

import { config } from './addon.config';
@Component({
    selector: 'app-empty-route',
    template: '<div>Route is not exist.</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    { path: '**', component: EmptyRouteComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        ScriptBlockClientModule,
        ScriptBlockClientEditorModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }
        }),
        RouterModule.forRoot(routes),
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        TranslateStore,
        // Add here all used services.
    ],
    bootstrap: [
        // AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    constructor(
        private injector: Injector,
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }

    ngDoBootstrap() {
        customElements.define(`script-element-${config.AddonUUID}`, createCustomElement(ScriptBlockClientComponent, {injector: this.injector}));
        customElements.define(`script-editor-element-${config.AddonUUID}`, createCustomElement(ScriptBlockClientEditorComponent, {injector: this.injector}));
    }
}

