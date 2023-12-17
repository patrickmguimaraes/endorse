import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { ReloadComponent } from './reload.component';

describe('ReloadComponent', () => {
  let component: ReloadComponent;
  let fixture: ComponentFixture<ReloadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ReloadComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(ReloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
