import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  HttpErrorService,
  ProgramService,
  ToastService,
} from '@project-manara-frontend/services';

@Component({
  selector: 'app-program-form-dialog',
  standalone: false,
  templateUrl: './program-form-dialog.component.html',
  styleUrls: ['./program-form-dialog.component.css'],
})
export class ProgramFormDialogComponent implements OnInit {
  programForm!: FormGroup;
  departmentId!: number;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProgramFormDialogComponent>,
    private httpErrorService: HttpErrorService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private programService: ProgramService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.departmentId = data.departmentId;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.programForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      creditHours: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.programForm.valid) {
      this.programService
        .create(this.departmentId, this.programForm.value)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.toastService.success('Program created successfully!');
          },
          error: (errors) => {
            this.httpErrorService.handle(errors);
          },
        });
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
