import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
//import { IKeyboardEvent } from 'dist/ot-editor/src/assets/monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { EditorService } from './service/editor.service';
import { OperationalTransformationService } from './service/operational-transformation.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  model: NgxEditorModel = {value : '', language: 'java'};
  
  editor: any;
  subsc: any;
  isProgrammaticChange: boolean;
  
  constructor(private editorService: EditorService, private otService: OperationalTransformationService) { 
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
    console.log("revID: " + this.otService.revID);
  }

  subscriptions(): void {
    // This subscription manages incoming changes from other clients
    this.editorService.stringChangeRequestSubject.subscribe(operation => {
      this.isProgrammaticChange = true;
      // TODO change to other method

      let transformed: StringChangeRequest[] = this.otService.transform(operation);
      this.otService.insertRequestIntoHistory(transformed[0]);
      this.editor.getModel()?.applyEdits([{
        forceMoveMarkers: true,
        range: {
            startLineNumber: transformed[0].range.startLineNumber,
            endLineNumber: transformed[0].range.endLineNumber,
            startColumn: transformed[0].range.startColumn,
            endColumn: transformed[0].range.endColumn,
        },
        text: transformed[0].text
      }]);
    
      this.isProgrammaticChange = false;
    }, err => {
      console.log(err);
    });

    // This subscription manages changes found on the local editor
    this.subsc = this.editor.getModel().onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => { 
      let opRange: monaco.IRange = event.changes[0].range;
      let request: StringChangeRequest = new StringChangeRequest(
        new Date().toISOString(), 
        event.changes[0].text, 
        this.editorService.identity, 
        new MonacoRange(
          opRange.endColumn, 
          opRange.startColumn, 
          opRange.endLineNumber, 
          opRange.startLineNumber), 
        this.otService.revID);

      this.otService.insertRequestIntoHistory(request);
      if (!this.isProgrammaticChange) {
        this.editorService.insertChangeIntoQueue(request);
        if (!this.editorService.awaitingChangeResponse) {
          this.editorService.sendNextChangeRequest();
        }
      }
    }); 
  }

}
