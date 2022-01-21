import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import { BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import * as Stomp from 'stompjs';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/objects/GlobalConstants';
import { Queue } from 'src/app/objects/Queue';
import { StringResponse } from 'src/app/objects/StringResponse';
import { MonacoRange } from 'src/app/objects/MonacoRange';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  
  recievedEditsQueue: Queue;

  identity: string;

  webSocketEndPoint: string = 'http://' + GlobalConstants.serverIP + ':8080/ws';
  incomingURI: string = "/broker/string-change-request";
  stompClient: any;

  subjectObservable: Observable<any>;
  stringChangeRequestSubject: BehaviorSubject<StringChangeRequest> = new BehaviorSubject(new StringChangeRequest("", "", "", new MonacoRange(-1, -1, -1, -1)));
  
  constructor(private http: HttpClient) {

    // This is just to work around identity needing to be defin assigned. Idk yet
    this.identity = "";
    this.cacheIdentity();
    this.subjectObservable = this.stringChangeRequestSubject.asObservable();
    this.recievedEditsQueue = new Queue();
  }

  private enqueueStringChangeRequest(request: StringChangeRequest) {
    this.recievedEditsQueue.enqueue(request);
  }

  public recieveFromWebSocket(request: any) {
      let obj = JSON.parse(request.body);
      if (obj.identity != this.identity) {
        this.enqueueStringChangeRequest(new StringChangeRequest(obj.timestamp, obj.text, this.identity, obj.range));
        this.stringChangeRequestSubject.next(new StringChangeRequest(obj.timestamp, obj.text, this.identity, obj.range));
      }  
  }

  public cacheIdentity(): void {
    this.http.get<StringResponse>("http://" + GlobalConstants.serverIP + ":8080/identity").subscribe(response => {
      this.identity = response.string;
    },
    err => {
      console.log("Get identity has failed: " + err);
    });
  }

  public sendOperation(request: StringChangeRequest): void {
    this.http.post("http://" + GlobalConstants.serverIP + ":8080/change", request).subscribe(response => {
     
    },
    err => {
      console.log("Send operation has failed: " + err);
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

  // public getRangeFromIndex(index: number, model: string): monaco.IRange {
  //   // o\no\no\n
  //   let lines: string[] = model.split(/\r\n|\r|\n/);
  //   let totalCharactersPassed: number = 0;
  //   for (var line of lines) {
  //     totalCharactersPassed += line.length;
  //     if (totalCharactersPassed > index) {

  //     }
  //   }

  //  // let numberOfColumnsToMoveCursor: number = text.replace(/\r?\n?/g, '').length;
      
  // }

  
}
