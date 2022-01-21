import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
//import { IKeyboardEvent } from 'dist/ot-editor/src/assets/monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { EditorService } from './service/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'java'};
  model: NgxEditorModel = {value : 'class A {\n\tString q;\n\n\tpublic A() {\n\t\t\n\t}\n}'};

  editor: any;
  subsc: any;

  isProgrammaticChange: boolean;

  constructor(private editorService: EditorService) { 
    this.isProgrammaticChange = false;
  }

  ngOnInit(): void {
    this.connect();
  }

  onInit(editorInit: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editorInit;
    this.subscriptions();
    
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  connect(): void {
    this.editorService.connectWebSocket();
  }

  disconnect(): void {
    this.editorService.disconnectWebSocket();
  }

  button() {
 
  }

  subscriptions(): void {
    // This subscription manages incoming changes from other clients
    this.editorService.stringChangeRequestSubject.subscribe(operation => {
      this.isProgrammaticChange = true;
      this.editor.getModel()?.applyEdits([{
        forceMoveMarkers: true,
        range: {
            startLineNumber: operation.range.startLineNumber,
            endLineNumber: operation.range.endLineNumber,
            startColumn: operation.range.startColumn,
            endColumn: operation.range.endColumn,
        },
        text: operation.text
      }]);
        this.isProgrammaticChange = false;
    }, err => {
      console.log(err);
    });

    // This subscription manages changes found on the local editor
    this.subsc = this.editor.getModel().onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => { 
      let opRange: monaco.IRange = event.changes[0].range;
      if (!this.isProgrammaticChange) {
        console.log("Manual change: " + event.changes[0].text);
        this.editorService.sendOperation(new StringChangeRequest(new Date().toISOString(), event.changes[0].text, this.editorService.identity, 
                                         new MonacoRange(opRange.endColumn, opRange.startColumn, opRange.endLineNumber, opRange.startLineNumber)));
      } else {
        console.log("Programattic change: " + event.changes[0].text);
      } 
    }); 
  }

}
