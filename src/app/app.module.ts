import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from './components/editor/editor.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MonacoComponent } from './components/monaco/monaco.component'; 
import { RouterModule, Routes } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'OT-editor/assets', // configure base path cotaining monaco-editor directory after build default: './assets'
  defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    MonacoComponent
  ],
  imports: [
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    BrowserAnimationsModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
