import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { EditorService } from './service/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editorService: EditorService;

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  model: NgxEditorModel = {value : ''};

  editor: any;
  subsc: any;
  constructor(editorService: EditorService) { 
    this.editorService = editorService;
  }

  ngOnInit(): void {
    this.connect();
  }

  codeChange(change: any) {
    console.log(change);
  }

  onInit(editorInit: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editorInit;
    this.subsc = this.editor.getModel().onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => {
        console.log(event);
        this.editorService.collectChange(event, new Date().toISOString());
    });
  }

  pushOperation(): void {
    
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  connect(): void {
    this.editorService.connectWebSocket();
  }

  disconnect(): void {
    this.editorService.disconnectWebSocket();
  }

  recieveMessage(message: any): void {
    console.log(message)
  }


}
