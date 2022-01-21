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
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  model: NgxEditorModel = {value : 'class A {\n\tString q;\n\n\tpublic A() {\n\t\t\n\t}\n}'};

  editor: any;
  subsc: any;
  subsc1: any;
  constructor(private editorService: EditorService) { 
    this.subscriptions();
  }

  ngOnInit(): void {
    this.connect();
  }

  subscriptions(): void {
    this.editorService.stringChangeRequestSubject.subscribe(operation => {
      console.log(operation);
      if (operation.identity != "") {

        setTimeout(() => {
          this.executeOperation(operation.text, operation.range);
        }, 1000);
      } 
    }, err => {
      console.log(err);
    });
  }

  onInit(editorInit: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editorInit;
    this.subsc = this.editor.getModel().onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => {
      console.log(event);
      /*
        There is no known way to distinguish between manual text insertions, and programmatic text insertions.
        Because I need to disregard recieved changes from other clients so that those same changes are not
        again propogated in a feedback loop, I must work around this. The solution at hand is to put incoming
        in a queue and dequeue when they are found here.

        Alternative is to use this.editor.onKeyDown to detect each key press. However, this solution fails for
        intellisense (potentially) when enter clicking options. There is a paste/redo/undo options for it as well. 
        Maybe this should be pursued? - cursor select and edit might be tricky.

        NOTE: may also need to consider checking for op.text
      */

      let opRange: monaco.IRange = event.changes[0].range;
      if (this.editorService.recievedEditsQueue.peek().text != event.changes[0].text && this.editorService.recievedEditsQueue.peek().index != event.changes[0].rangeOffset) {
        this.editorService.sendOperation(new StringChangeRequest(new Date().toISOString(), event.changes[0].text, this.editorService.identity, 
        new MonacoRange(opRange.endColumn, opRange.startColumn, opRange.endLineNumber, opRange.startLineNumber)));
      } else {
        this.editorService.recievedEditsQueue.dequeue();
      }
    }); 
  }

  // substring (i inclusive, j exlusive)
  executeOperation(text: string, range: MonacoRange): void {
    // //if (text.length > 0) { monaco.Position
    //   // Insert
      
    //   let numberOfColumnsToMoveCursor: number = text.replace(/\r?\n?/g, '').length;
    //   let numOfLinesToMoveCursor: number = text.split('\n').length - 1;

    //   let currentModelValue: string = this.editor.getModel().getValue();
    //   let leftNode: string = currentModelValue.substring(0, index);
    //   let rightNode: string = text + currentModelValue.substring(index, currentModelValue.length + 1);
    //   console.log(numberOfColumnsToMoveCursor + ' , ' + numOfLinesToMoveCursor);
    //   console.log(this.editor.getPosition().column + ' , ' + this.editor.getPosition().lineNumber);

     //  let pos: monaco.Position = new monaco.Position(this.editor.getPosition().lineNumber + numOfLinesToMoveCursor, 
    //                                                 this.editor.getPosition().column + numberOfColumnsToMoveCursor); 
    //   this.editor.setValue(leftNode + rightNode);
      //adjust cursor position to reflect new changes. to include '\n'
      //return new monaco.Position(1,1);

      // find range values

      let ok: any;
      this.editor.getModel()?.pushEditOperations([], [{
      forceMoveMarkers: true,
      range: {
          startLineNumber: range.startLineNumber,
          endLineNumber: range.endLineNumber,
          startColumn: range.startColumn,
          endColumn: range.endColumn,
      },
      text: text
  }], ok);










      //return pos;
    //} 
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

  recieveMessage(message: any): void {
    console.log(message)
  }

  button() {
    //   setTimeout(() => {
    //     let pos: monaco.Position = this.editor.getPosition();    
    //     this.editor.setPosition(this.executeOperation('1\n', 3));
    // }, 4000);
    
    let ok: any;
    this.editor.getModel()?.pushEditOperations([], [{
    forceMoveMarkers: true,
    range: {
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 2,
        endColumn: 0 + 7,
    },
    text: "@#$"
}], ok);
    
  }

}
