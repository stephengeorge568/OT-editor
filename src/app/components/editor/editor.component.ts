import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { APISocket } from 'src/app/objects/APISocket';
import { EditorService } from './service/editor.service';
import { WebSocketService } from './service/web-socket.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editorService: EditorService;
  webSocketService: WebSocketService;
  webSocket: APISocket;

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  model: NgxEditorModel = {value : ''};

  editor: any;
  subsc: any;
  constructor(editorService: EditorService, webSocketService: WebSocketService) { 
    this.editorService = editorService;
    this.webSocketService = webSocketService;
    this.webSocket = new APISocket();
  }

  ngOnInit(): void {
    this.connect();
    //this.sendMessage();
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

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  connect(): void {
    this.webSocket.connect();
  }

  disconnect(): void {
    this.webSocket.disconnect();
  }

  recieveMessage(message: any): void {
    console.log(message)
  }


}
