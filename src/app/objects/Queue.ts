import { StringChangeRequest } from "./StringChangeRequest";

// Dirty implementation of Queue
export class Queue<T> {
    private arr: T[];

    constructor() {
        this.arr = [];
    }

    public enqueue(e: T): void {
        this.arr.push(e);
    }

    public peek(): T | null {
        if (this.arr.length > 0) {
            return this.arr[0];
        } return null; 
    }

    public dequeue(): T | undefined {
        return this.arr.shift();
    }

    public getQueue(): T[] {
        return this.arr;
    }

    public isEmpty(): boolean {
        return this.arr.length == 0;
    }
}