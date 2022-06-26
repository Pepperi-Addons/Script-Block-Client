import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ScriptBlockClientModule } from './block/block.module';
import { ScriptBlockClientEditorModule } from './block-editor/block-editor.module';

@NgModule({
    imports: [
        BrowserModule,
        ScriptBlockClientModule,
        ScriptBlockClientEditorModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
