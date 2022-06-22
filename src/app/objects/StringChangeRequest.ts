import { MonacoRange } from "./MonacoRange";

export class StringChangeRequest {
    
    public timestamp: string;
    public text: string;
    public identity: string;
    public range: MonacoRange
    public revID: number;
    public setID?: number;

    constructor(timestamp: string, text: string, identity: string, range: MonacoRange, revID: number, setID?: number) {
        this.timestamp = timestamp;
        this.text = text;
        this.identity = identity;
        this.range = range;
        this.revID = revID;
        this.setID = setID;
    }
}