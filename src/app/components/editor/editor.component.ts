import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
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
  model: NgxEditorModel = {value : 'abcdefg'};

  editor: any;
  subsc: any;
  constructor(editorService: EditorService) { 
    this.editorService = editorService;

    this.editorService.stringChangeRequestSubject.subscribe( operation => {
      console.log(operation);
      //this.executeOperation(operation.text, operation.startingIndex);
    });
  }

  ngOnInit(): void {
    this.connect();
  }

  button() {
      setTimeout(() => {
        let pos: monaco.Position = this.editor.getPosition();    
        this.editor.setPosition(this.executeOperation('1\n', 3));
    }, 4000);
  
   
    
  }

  onInit(editorInit: monaco.editor.IStandaloneCodeEditor) {
    
    this.editor = editorInit;
    this.subsc = this.editor.getModel().onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => {
        console.log(event);
        this.editorService.sendOperation(new StringChangeRequest(new Date().toISOString(), event.changes[0].text, event.changes[0].rangeOffset));
    });
  }

  // substring (i inclusive, j exlusive)
  executeOperation(text: string, index: number): monaco.Position {
    //if (text.length > 0) {
      // Insert

      let numberOfColumnsToMoveCursor: number = text.replace(/\r?\n?/g, '').length;
      let numOfLinesToMoveCursor: number = text.split('\n').length - 1;

      let currentModelValue: string = this.editor.getModel().getValue();
      let leftNode: string = currentModelValue.substring(0, index);
      let rightNode: string = text + currentModelValue.substring(index, currentModelValue.length + 1);
      console.log(numberOfColumnsToMoveCursor + ' , ' + numOfLinesToMoveCursor);
      console.log(this.editor.getPosition().column + ' , ' + this.editor.getPosition().lineNumber);

      let pos: monaco.Position = new monaco.Position(this.editor.getPosition().lineNumber + numOfLinesToMoveCursor, 
                                                     this.editor.getPosition().column + numberOfColumnsToMoveCursor); 
      this.editor.setValue(leftNode + rightNode);
      // adjust cursor position to reflect new changes. to include '\n'

      return pos;
    //} 
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
