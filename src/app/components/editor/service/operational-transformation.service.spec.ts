import { TestBed } from '@angular/core/testing';

import { OperationalTransformationService } from './operational-transformation.service';

describe('OperationalTransformationService', () => {
  let service: OperationalTransformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationalTransformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
