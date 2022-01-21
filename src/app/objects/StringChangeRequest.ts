import { start } from "repl";
import { MonacoRange } from "./MonacoRange";

export class StringChangeRequest {
    
    public timestamp: string;
    public text: string;
    public identity: string;
    public range: MonacoRange

    //May need more fields for revision id and client id
    
    constructor(timestamp: string, text: string, identity: string, range: MonacoRange) {
        this.timestamp = timestamp;
        this.text = text;
        this.identity = identity;
        this.range = range;
    }
}