import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

export class APISocket {

    webSocketEndPoint: string = 'http://localhost:8080/ws';
    incomingURI: string = "/broker/string-change-request";
    stompClient: any;

    constructor(){}

    connect() {
        let socket = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(socket);
        const _this = this;
        _this.stompClient.connect({}, function (frame: any) {
            _this.stompClient.subscribe(_this.incomingURI, function (event: any) {
                _this.recieve(event);
            });
        }, this.error);
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Web socket connection has been terminated.");
    }

    error(error: any) {
        console.log("APISocket error: " + error);
        setTimeout(() => {
            console.log("Attemping to reconnect to the server via web socket.");
            this.connect();
        }, 5000);
    }

    recieve(message: any) {
        console.log("Message recieved: " + message);
    }
}