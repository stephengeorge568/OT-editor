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
  model: NgxEditorModel = {value : ''};

  editor: any;
  subsc: any;

  previousModelValue: string = this.model.value;

  constructor() { 

  }

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
    
    let line = editorInit.getPosition();
    this.subsc = this.editor.getModel().onDidChangeContent(() => {
        // if positive, insertion. if 1, character insertion.
        
        

        
        
        this.previousModelValue = this.editor.getModel().getValue();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

}
