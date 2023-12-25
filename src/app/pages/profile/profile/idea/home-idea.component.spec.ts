import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeIdeaComponent } from './home-idea.component';

describe('HomeIdeaComponent', () => {
  let component: HomeIdeaComponent;
  let fixture: ComponentFixture<HomeIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeIdeaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
