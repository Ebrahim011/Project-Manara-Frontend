/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditStudentPageComponent } from './edit-student-page.component';

describe('EditStudentPageComponent', () => {
  let component: EditStudentPageComponent;
  let fixture: ComponentFixture<EditStudentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStudentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
