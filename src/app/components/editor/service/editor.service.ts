import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/objects/GlobalConstants';
import { Queue } from 'src/app/objects/Queue';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { OperationalTransformationService } from './ot/operational-transformation.service';
import { Component, OnInit } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { isDevMode } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EditorService {

    // Backend server address
    serverIP: string;

    // identity of the client - currently IP
    clientIdentity: string;

    // pending change queue to send to server
    pendingChangeQueue: Queue<StringChangeRequest>;

    // TODO gotta be better/more proper way to do this. this outputs event on init when i dont want it to.
    stringChangeRequestSubject: BehaviorSubject<StringChangeRequest> = new BehaviorSubject(new StringChangeRequest("", "", "", new MonacoRange(-1, -1, -1, -1), 1));

    /* ----------------- FLAGS ----------------- */

    // flag to halt sending of change requests until response arrives from earlier response
    isAwaitingChangeResponse: boolean;

    // flag to halt displaying editor until server responds with identity id
    isAwaitingIdentityResponse: boolean;

    // flag to halt displaying editor until server responds with model
    isAwaitingModelResponse: boolean;

    // flag to halt displaying editor until server responds with revId
    isAwaitingRevIdResponse: boolean;

    constructor(private http: HttpClient, private otService: OperationalTransformationService) {

        if (isDevMode()) {
            this.serverIP = GlobalConstants.devServerAddress;
        } else this.serverIP = GlobalConstants.publicServerAddress;

        console.log(this.serverIP);

        this.isAwaitingChangeResponse = false;
        this.isAwaitingIdentityResponse = true;
        this.isAwaitingModelResponse = true;
        this.isAwaitingRevIdResponse = true;

        this.pendingChangeQueue = new Queue();
        this.clientIdentity = "";

        this.cacheIdentity();
        this.cacheRevId();
    }

    public cacheIdentity(): void {
        this.http.get("http://" + this.serverIP + ":8080/identity", {responseType: 'text'}).subscribe(response => {
            this.clientIdentity = response;
            this.isAwaitingIdentityResponse = false;
        },
        err => {
            console.log("Get identity has failed: " + err);
        });
    }

    public cacheModel(): Observable<string> {
        return this.http.get("http://" + this.serverIP + ":8080/model", {responseType: 'text'}).pipe(tap(response => {
            this.isAwaitingModelResponse = false;
        },
        err => {
            console.log("Get model has failed: " + err);
        }));
    }

    public cacheRevId(): void {
        this.http.get<number>("http://" + this.serverIP + ":8080/revId").subscribe(response => {
            this.otService.revID = response
            this.isAwaitingRevIdResponse = false;
        },
        err => {
            console.log("Get model has failed: " + err);
        });
    }

    public sendOperation(request: StringChangeRequest | undefined): void {
        if (request != undefined) {
            this.isAwaitingChangeResponse = true;
            
            this.http.post<number>("http://" + this.serverIP + ":8080/change", request).subscribe(response => {
                this.otService.revID = response;
                this.isAwaitingChangeResponse = false;
                this.sendNextChangeRequest();
            },
            err => {
                console.log("Send operation has failed: " + err);
            });
        }
    }

    public insertChangeIntoQueue(request: StringChangeRequest): void {
        if (!this.isAwaitingChangeResponse) {
            this.sendOperation(request);
        } else this.pendingChangeQueue.enqueue(request);
        }

        public sendNextChangeRequest(): void {
        if (!this.pendingChangeQueue.isEmpty()) {
            this.sendOperation(this.pendingChangeQueue.dequeue());
        }
    }

}
