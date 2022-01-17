import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import { BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import * as Stomp from 'stompjs';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EditorService {
  
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  incomingURI: string = "/broker/string-change-request";
  stompClient: any;
  stringChangeRequestSubject: BehaviorSubject<StringChangeRequest> = new BehaviorSubject(new StringChangeRequest("", "", -1));
  
  constructor(private http: HttpClient) {

  }

  public collectChange(event: monaco.editor.IModelContentChangedEvent, timestamp: string): void {
    
    if (event.changes[0].text.length == 0) {
      // Deletion

    } else {
      // Insertion

    }
    
  }

  public sendOperation(request: StringChangeRequest): void {
    //const options = {headers: {'Content-Type': 'application/json'}};
    this.http.post("http://localhost:8080/change", request).subscribe(response => {
      console.log(response);
    },
    err => {
      console.log("error post!");
      console.log(err);
    });
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

  public disconnectWebSocket() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
    console.log("Web socket connection has been terminated.");
  }

  public errorFromWebSocket(error: any) {
    console.log("APISocket error: " + error);
    setTimeout(() => {
        console.log("Attemping to reconnect to the server via web socket.");
        this.connectWebSocket();
    }, 5000);
  }

  public recieveFromWebSocket(request: any) {
    this.stringChangeRequestSubject.next(new StringChangeRequest(request.timestamp, request.text, request.index))
    console.log("Message recieved: " + request);
  }



}
