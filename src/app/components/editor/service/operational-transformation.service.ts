import { Injectable } from '@angular/core';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';

@Injectable({
  providedIn: 'root'
})
export class OperationalTransformationService {

  revID: number;
  history: Map<number, StringChangeRequest[]>;

  constructor() {
    this.revID = 1;
    this.history = new Map();
  }

  private insertRequestIntoHistory(req: StringChangeRequest): void {
    if (this.history.get(req.revID) == undefined) {
      this.history.set(req.revID, [req]);
    } else this.history.get(req.revID)?.push(req);
  }

  private getRelevantHistory(): StringChangeRequest[] {

  }

  public transform(req: StringChangeRequest): StringChangeRequest {

  }

  private transformOperation(prev: StringChangeRequest, next: StringChangeRequest): StringChangeRequest {

  }

  private isPreviousRequestRelevant(prev: MonacoRange, next: MonacoRange): boolean {

  }

  private isRangeOverlap(prev: MonacoRange, next: MonacoRange): boolean {

  }

  private isSCWithinRange(prev: MonacoRange, next: MonacoRange): boolean {

  }

  private isECWithinRange(prev: MonacoRange, next: MonacoRange): boolean {

  }

  private resolveConflictingRanges(prev: MonacoRange, next: MonacoRange): boolean {

  }
  
}
