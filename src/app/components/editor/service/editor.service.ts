import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  

  
  constructor() {

   }

  public collectChange(event: monaco.editor.IModelContentChangedEvent, timestamp: string): void {
    
    if (event.changes[0].text.length == 0) {
      // Deletion

    } else {
      // Insertion

    }
    
  }

  

  public connectWebSocket(): void {
   
  }



}
