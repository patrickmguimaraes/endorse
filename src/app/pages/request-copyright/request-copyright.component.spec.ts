import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RequestCopyrightComponent } from './request-copyright.component';

describe('RequestCopyrightComponent', () => {
  let component: RequestCopyrightComponent;
  let fixture: ComponentFixture<RequestCopyrightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RequestCopyrightComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(RequestCopyrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
