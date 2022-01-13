import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  
  

  constructor() {
    // const subject = webSocket("ws://192.168.56.1:8080/broker/string"); 
    // subject.subscribe(
    //   msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
    //   err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
    //   () => console.log('complete') // Called when connection is closed (for whatever reason).
    // );
    // subject.next({timestamp: 'tsmp', text: 'some message', number: 3});
   }

}
