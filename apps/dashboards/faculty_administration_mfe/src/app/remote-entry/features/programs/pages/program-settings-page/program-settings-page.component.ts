import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProgramRequest } from '@project-manara-frontend/models';
import {
  HttpErrorService,
  ProgramService,
  ToastService,
} from '@project-manara-frontend/services';

@Component({
  selector: 'app-program-settings-page',
  standalone: false,
  templateUrl: './program-settings-page.component.html',
  styleUrls: ['./program-settings-page.component.css'],
})
export class ProgramSettingsPageComponent implements OnInit {
  programForm!: FormGroup;
  programId!: number;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpErrorService: HttpErrorService,
    private programService: ProgramService,
    private toastrService: ToastService,
  ) {}

  ngOnInit() {
    this.initForm();
    this.programId = Number(this.route.parent?.snapshot.params['id']);
    this.loadProgramData();
  }

  initForm(): void {
    this.programForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      creditHours: ['', [Validators.required, Validators.min(1)]],
    });
  }

  loadProgramData(): void {
    this.programService.get(this.programId).subscribe({
      next: (program) => {
        this.programForm.patchValue(program);
      },
      error: (error) => {
        this.httpErrorService.handle(error);
      },
    });
  }
  onSave() {
    if (this.programForm.valid) {
      var request = this.programForm.value as ProgramRequest;
      this.programService.update(this.programId, request).subscribe({
        next: () => {
          this.toastrService.success(
            'Program information updated successfully',
          );
          this.programForm.markAsPristine();
        },
        error: (error) => {
          this.httpErrorService.handle(error);
        },
      });
    }
    this.programForm.markAllAsTouched();
  }
}
