import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationalTransformationService {

  revID: number;

  constructor() {
    this.revID = 1;
  }

  
}
