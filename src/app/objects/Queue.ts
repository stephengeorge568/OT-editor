import { StringChangeRequest } from "./StringChangeRequest";

// Dirty implementation of Queue DS
export class Queue {
    private arr: any[];

    constructor() {
        this.arr = [];
    }

    public enqueue(e: any): void {
        this.arr.unshift(e);
    }

    public peek(): any {
        if (this.arr.length > 0) {
            return this.arr[0];
        } else return {"timestamp":"","text":"","index":"","identity":""}; // this needs to change TODO
    }

    public dequeue(): any {
        return this.arr.shift();
    }

    public getQueue(): any[] {
        return this.arr;
    }

    public isEmpty(): boolean {
        return this.arr.length == 0;
    }
}