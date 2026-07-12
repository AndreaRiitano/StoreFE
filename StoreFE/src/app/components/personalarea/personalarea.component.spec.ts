import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalareaComponent } from './personalarea.component';

describe('PersonalareaComponent', () => {
  let component: PersonalareaComponent;
  let fixture: ComponentFixture<PersonalareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
