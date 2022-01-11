export class StringChangeRequest {
    
    private timestamp: string;
    private text: string;
    private startingIndex: number; // May need one for column and one for row/line number instead

    //May need more fields for revision id and client id
    
    constructor(timestamp: string, text: string, startingIndex: number) {
        this.timestamp = timestamp;
        this.text = text;
        this.startingIndex = startingIndex;
    }
}