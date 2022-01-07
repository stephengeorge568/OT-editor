import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  x: NgxEditorModel = {value : 'function x()'};
  editor: any;
  constructor() { }

  ngOnInit(): void {
    
  }

  yell(): void {
    console.log(this.editor.getModel()?.getValue());
  }

  codeChange(change: any) {
    console.log(change);
  }

  onInit(editorInit: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editorInit;
    console.log(editorInit.constructor.name)
    //console.log(1);
    let line = editorInit.getPosition();
    console.log(line);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

}
