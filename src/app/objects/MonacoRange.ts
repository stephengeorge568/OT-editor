export class MonacoRange {
    public endColumn: number;
    public startColumn: number;
    public endLineNumber: number;
    public startLineNumber: number;

    constructor(endColumn: number, startColumn: number, endLineNumber: number, startLineNumber: number) {
        this.endColumn = endColumn;
        this.startColumn = startColumn;
        this.endLineNumber = endLineNumber;
        this.startLineNumber = startLineNumber;
    }
}