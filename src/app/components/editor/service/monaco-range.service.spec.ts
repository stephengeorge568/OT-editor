import { TestBed } from '@angular/core/testing';

import { MonacoRangeService } from './monaco-range.service';

describe('MonacoRangeService', () => {
  let service: MonacoRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonacoRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
