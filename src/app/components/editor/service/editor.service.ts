import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
@Injectable({
  providedIn: 'root'
})
export class EditorService {
  
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  incomingURI: string = "/broker/string-change-request";
  stompClient: any;
  
  constructor() {

   }

  public collectChange(event: monaco.editor.IModelContentChangedEvent, timestamp: string): void {
    
    if (event.changes[0].text.length == 0) {
      // Deletion

    } else {
      // Insertion

    }
    
  }

  public sendOperation(): void {

  }
  

  public connectWebSocket(): void {
    let socket = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(socket);
        const _this = this;
        _this.stompClient.connect({}, function (frame: any) {
            _this.stompClient.subscribe(_this.incomingURI, function (event: any) {
                _this.recieveFromWebSocket(event);
            });
        }, this.errorFromWebSocket);
  }

  disconnectWebSocket() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
    console.log("Web socket connection has been terminated.");
}

errorFromWebSocket(error: any) {
  console.log("APISocket error: " + error);
  setTimeout(() => {
      console.log("Attemping to reconnect to the server via web socket.");
      this.connectWebSocket();
  }, 5000);
}

recieveFromWebSocket(message: any) {
  console.log("Message recieved: " + message);
}



}
