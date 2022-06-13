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
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { OperationalTransformationService } from './operational-transformation.service';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  identity: string;

  webSocketEndPoint: string = 'http://' + GlobalConstants.serverIP + ':8080/ws';
  incomingURI: string = "/broker/string-change-request";
  stompClient: any;

  subjectObservable: Observable<any>;

  queue: Queue<StringChangeRequest>;
  awaitingChangeResponse: boolean;

  // TODO gotta be better/more proper way to do this. this outputs event on init when i dont want it to.
  stringChangeRequestSubject: BehaviorSubject<StringChangeRequest> = new BehaviorSubject(new StringChangeRequest("", "", "", new MonacoRange(-1, -1, -1, -1), 1));
  
  constructor(private http: HttpClient, private otService: OperationalTransformationService) {
    this.awaitingChangeResponse = false;
    this.queue = new Queue();
    // This is just to work around identity needing to be defin assigned. Idk yet TODO
    this.identity = "";
    this.cacheIdentity();
    this.subjectObservable = this.stringChangeRequestSubject.asObservable();
  }

  public recieveFromWebSocket(request: any) {
      
      let obj = JSON.parse(request.body);
      
      if (obj.identity != this.identity) {
        this.stringChangeRequestSubject.next(new StringChangeRequest(obj.timestamp, obj.text, this.identity, obj.range, obj.revID, obj.setID));
        this.otService.revID = obj.setID;
      }  
  }

  public cacheIdentity(): void {
    this.http.get("http://" + GlobalConstants.serverIP + ":8080/identity", {responseType: 'text'}).subscribe(response => {
      this.identity = response;
    },
    err => {
      console.log("Get identity has failed: " + err);
    });
  }

  public sendOperation(request: StringChangeRequest | undefined): void {
    if (request != undefined) {
      this.awaitingChangeResponse = true;
      this.http.post<number>("http://" + GlobalConstants.serverIP + ":8080/change", request).subscribe(response => {
        this.otService.revID = response;
        this.awaitingChangeResponse = false;
        this.sendNextChangeRequest();
        // put request in history 
      },
    err => {
      console.log("Send operation has failed: " + err);
    });
    }
  }
  
  public connectWebSocket(): void {
    let socket = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = GlobalConstants.disableStompLogging;
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

  public insertChangeIntoQueue(request: StringChangeRequest): void {
    if (!this.awaitingChangeResponse) {
      this.sendOperation(request);
    } else this.queue.enqueue(request);
  }

  public sendNextChangeRequest(): void {
    if (!this.queue.isEmpty()) {
      this.sendOperation(this.queue.dequeue());
    }
  }

}
