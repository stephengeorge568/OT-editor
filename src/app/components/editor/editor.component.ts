import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { WebSocketAPI } from 'src/app/objects/WebSocket';
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
  webSocket: WebSocketAPI;

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  model: NgxEditorModel = {value : ''};

  editor: any;
  subsc: any;
  constructor(editorService: EditorService, webSocketService: WebSocketService) { 
    this.editorService = editorService;
    this.webSocketService = webSocketService;
    this.webSocket = new WebSocketAPI();
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

  send(): void {
    this.sendMessage();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  connect(): void {
    this.webSocket._connect();
  }

  disconnect(): void {
    this.webSocket._disconnect();
  }

  sendMessage(): void {
    this.webSocket._send({timestamp: "d", text: "dd", number: 1});
  }

  recieveMessage(message: any): void {
    console.log(message)
  }


}
