/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProgramUserService } from './program-user.service';

describe('Service: ProgramUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramUserService]
    });
  });

  it('should ...', inject([ProgramUserService], (service: ProgramUserService) => {
    expect(service).toBeTruthy();
  }));
});
