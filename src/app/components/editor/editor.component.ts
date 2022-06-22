import { Component, OnInit } from '@angular/core';
import * as monaco from 'monaco-editor';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { EditorService } from './service/editor.service';
import { OperationalTransformationService } from './service/ot/operational-transformation.service';
import { WebsocketService } from './service/websocket-service/websocket.service';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

    // configurations for monaco editor
    editorOptions = {theme: 'vs-dark', language: 'java'};
    model: NgxEditorModel = {value : ''};
    editor: any;

    // This subscription manages changes found on the local editor
    localEditorChangeSubscription: any;

    // Flag to detect what changes are programmatic and which are manual and local 
    isProgrammaticChange: boolean;

    constructor(private editorService: EditorService, private otService: OperationalTransformationService, private websocketService: WebsocketService) { 
        this.isProgrammaticChange = false; 
    }

    ngOnInit(): void {
        this.connectWebsocket();
    }

    onInit(editorInit: monaco.editor.IStandaloneCodeEditor) {
        this.editor = editorInit;

        this.editorService.cacheModel().subscribe(response => {
            this.isProgrammaticChange = true;
            
            this.editor.getModel()?.applyEdits([{
                forceMoveMarkers: false,
                range: {
                    startLineNumber: 1,
                    endLineNumber: 1,
                    startColumn: 1,
                    endColumn: 1,
                },
                text: response
                }]);

            this.isProgrammaticChange = false;
        });
        
        this.subscriptions();
    }

    ngOnDestroy(): void {
        this.disconnectWebsocket();
    }

    connectWebsocket(): void {
        this.websocketService.connectWebSocket();
    }

    disconnectWebsocket(): void {
        this.websocketService.disconnectWebSocket();
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
        this.localEditorChangeSubscription = this.editor.getModel().onDidChangeContent((event: monaco.editor.IModelContentChangedEvent) => { 
            console.log(this.model.value);
            let opRange: monaco.IRange = event.changes[0].range;
            let request: StringChangeRequest = new StringChangeRequest(
                new Date().toISOString(), 
                event.changes[0].text, 
                this.editorService.clientIdentity, 
                new MonacoRange(
                    opRange.endColumn, 
                    opRange.startColumn, 
                    opRange.endLineNumber, 
                    opRange.startLineNumber), 
                this.otService.revID);

            this.otService.insertRequestIntoHistory(request);
            if (!this.isProgrammaticChange) {
                this.editorService.insertChangeIntoQueue(request);
            if (!this.editorService.isAwaitingChangeResponse) {
                this.editorService.sendNextChangeRequest();
            }
            }
        }); 
    }

}
