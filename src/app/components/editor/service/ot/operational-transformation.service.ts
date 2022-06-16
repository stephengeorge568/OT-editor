import { Injectable } from '@angular/core';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { MonacoRangeService } from './monaco-range.service';

@Injectable({
providedIn: 'root'
})
export class OperationalTransformationService {

    revID: number;
    history: Map<number, StringChangeRequest[]>;

    constructor(private monacoService: MonacoRangeService) {
        this.revID = 1;
        this.history = new Map();
    }

    public insertRequestIntoHistory(req: StringChangeRequest): void {
        if (this.history.get(req.revID) == undefined) {
            this.history.set(req.revID, [req]);
        } else this.history.get(req.revID)?.push(req);
    }

    private getRelevantHistory(revID: number, history: Map<number, StringChangeRequest[]>): StringChangeRequest[] {
        let relevantRequests: StringChangeRequest[] = [];
        history.forEach((list, id) => {
            if (id >= revID) {
                relevantRequests.concat(list);
            }
        });
        return relevantRequests;
    }

    public transform(request: StringChangeRequest): StringChangeRequest[] {
        let transformedRequests: StringChangeRequest[] = [];
        transformedRequests.push(request);
        let historicalRequest: StringChangeRequest;
        for (historicalRequest of this.getRelevantHistory(request.revID, this.history)) {
            // two request back to back from same client. the second one should not transform based on the first.
            // it already accounted for that
            if (!(request.identity == historicalRequest.identity) && request.revID == historicalRequest.revID) {
                let pair: StringChangeRequest[] = this.monacoService.resolveConflictingRanges(historicalRequest, transformedRequests[0]);
                let temp: StringChangeRequest = this.transformOperation(historicalRequest, pair[0]);
                transformedRequests[0] = temp;
            }
            //if (pair[1] != null) transformedRequests.add(transformOperation(historicalRequest, pair[1]));
        }
        if (transformedRequests.length == 0) {
            transformedRequests.push(request);
        }
        return transformedRequests;
    }

    private transformOperation(prev: StringChangeRequest, next: StringChangeRequest): StringChangeRequest {
        let newSC: number = next.range.startColumn;
        let newEC: number = next.range.endColumn;
        let newSL: number = next.range.startLineNumber;
        let newEL: number = next.range.endLineNumber;
        let numberOfNewLinesInPrev: number = (prev.text.match('\n') || []).length;
        let prevTextLengthAfterLastNewLine: number = prev.text.length;

        if (numberOfNewLinesInPrev > 0) {
            prevTextLengthAfterLastNewLine = prev.text.length - prev.text.lastIndexOf("\n") - 1;
        }

        if (this.monacoService.isPreviousRequestRelevant(prev.range, next.range)) {
            let netNewLineNumberChange: number = numberOfNewLinesInPrev
                    - (prev.range.endLineNumber - prev.range.startLineNumber);

            let isPrevSimpleInsert: boolean = prev.range.startColumn == prev.range.endColumn
                    && prev.range.startLineNumber == prev.range.endLineNumber;

            if (isPrevSimpleInsert) {
                if (numberOfNewLinesInPrev > 0) {
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = newSC - prev.range.endColumn + prevTextLengthAfterLastNewLine + 1;
                    } if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = newEC - prev.range.endColumn + prevTextLengthAfterLastNewLine + 1;
                    }
                } else {
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = newSC + prevTextLengthAfterLastNewLine;
                    } if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = newEC + prevTextLengthAfterLastNewLine;
                    }
                }
            } else {
                if (numberOfNewLinesInPrev > 0) {
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = (newSC - prev.range.endColumn) + prevTextLengthAfterLastNewLine + 1; // do i need +1?
                    }
                    if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = (newEC - prev.range.endColumn) + prevTextLengthAfterLastNewLine + 1;
                    }
                } else {
                    let numberOfCharsDeletedOnPrevLine: number = prev.range.endColumn
                                - prev.range.startColumn;
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = newSC - numberOfCharsDeletedOnPrevLine + prev.text.length;
                    }
                    if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = newEC - numberOfCharsDeletedOnPrevLine + prev.text.length;
                    }

                }
            }

            newSL += netNewLineNumberChange;
            newEL += netNewLineNumberChange;
        }

        next.range = new MonacoRange(newSC, newEC, newSL, newEL);
        return next;
    }
}
