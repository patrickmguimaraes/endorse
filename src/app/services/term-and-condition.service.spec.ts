import { TestBed } from '@angular/core/testing';
import { TermAndConditionService } from './term-and-condition.service';


describe('TermAndConditionService', () => {
  let service: TermAndConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermAndConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
