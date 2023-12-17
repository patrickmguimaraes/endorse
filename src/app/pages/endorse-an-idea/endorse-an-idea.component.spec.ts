import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { EndorseAnIdeaComponent } from './endorse-an-idea.component';

describe('EndorseAnIdeaComponent', () => {
  let component: EndorseAnIdeaComponent;
  let fixture: ComponentFixture<EndorseAnIdeaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ EndorseAnIdeaComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(EndorseAnIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
