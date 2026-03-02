import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RegexPatternConsts } from '@project-manara-frontend/consts';
import {
  RoleResponse,
  ScopeDetailResponse,
  UniversityUserRequest,
} from '@project-manara-frontend/models';
import {
  HttpErrorService,
  ScopeService,
  UniversityUserService,
} from '@project-manara-frontend/services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Gender, Religion } from '@project-manara-frontend/enums';

@Component({
  selector: 'app-staff-form-dialog',
  standalone: false,
  templateUrl: './staff-form-dialog.component.html',
  styleUrls: ['./staff-form-dialog.component.css'],
})
export class StaffFormDialogComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  scope$!: Observable<ScopeDetailResponse>;

  religionOptions = Object.entries(Religion)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => ({ label: key, value }));

  genderOptions = Object.entries(Gender)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => ({ label: key, value }));

  availableRoles: RoleResponse[] = [];
  universityId: number;

  constructor(
    private fb: FormBuilder,
    private universityUserService: UniversityUserService,
    private scopeService: ScopeService,
    private httpErrorService: HttpErrorService,
    private dialogRef: MatDialogRef<StaffFormDialogComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) private data: { universityId: number },
  ) {
    this.universityId = this.data.universityId;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadScope();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      nationalId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(RegexPatternConsts.PASSWORD_PATTERN),
        ],
      ],
      birthDate: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      religion: [null, [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      isDisabled: [false],
      roles: [[] as string[], [Validators.required]],
    });
  }

  private loadScope(): void {
    this.scope$ = this.scopeService.get('university').pipe(
      tap((scope: ScopeDetailResponse) => {
        this.availableRoles = scope.roles || [];
      }),
    );
  }

  getSelectedRoles(): string[] {
    return this.form.get('roles')?.value || [];
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const request: UniversityUserRequest = this.form.value;

    this.universityUserService.create(this.universityId, request).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => this.httpErrorService.handle(err),
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
