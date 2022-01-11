import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor() { }

  public findStringDifference(previousValue: string, currentValue: string): [stringDiff: string, index: number, isInsert: boolean] {
    let lengthDifference: number = currentValue.length - previousValue.length;
        // Compare previous model value to the new model value. Keep in mind starting index of change.
        if (lengthDifference < 0) {
          // Deletion has occured
          if (lengthDifference < -1) {
            // String deletion

          } else {
            // character deletion

          }
        } else {
          // Insert has occured
          if (lengthDifference > 1) {
            // String deletion
            
          } else {
            // character deletion

          }
        }
    return ["a", 1, true];
  }
}
