/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateStudentPageComponent } from './create-student-page.component';

describe('CreateStudentPageComponent', () => {
  let component: CreateStudentPageComponent;
  let fixture: ComponentFixture<CreateStudentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStudentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
