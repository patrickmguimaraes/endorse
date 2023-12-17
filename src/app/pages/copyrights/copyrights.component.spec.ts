import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { CopyrightsComponent } from './copyrights.component';

describe('CopyrightsComponent', () => {
  let component: CopyrightsComponent;
  let fixture: ComponentFixture<CopyrightsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CopyrightsComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(CopyrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
