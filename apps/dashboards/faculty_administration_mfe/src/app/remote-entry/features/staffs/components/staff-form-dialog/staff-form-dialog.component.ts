import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RegexPatternConsts } from '@project-manara-frontend/consts';
import { Gender, Religion } from '@project-manara-frontend/enums';
import {
  RoleResponse,
  ScopeDetailResponse,
} from '@project-manara-frontend/models';
import {
  FacultyUserService,
  HttpErrorService,
  ScopeService,
} from '@project-manara-frontend/services';
import { Observable } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';

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
  facultyId$ = this.store.select(selectFacultyId);

  constructor(
    private fb: FormBuilder,
    private facultyUserService: FacultyUserService,
    private scopeService: ScopeService,
    private httpErrorService: HttpErrorService,
    private dialogRef: MatDialogRef<StaffFormDialogComponent>,
    private store: Store,
  ) {}

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
      phoneNumber: ['', [Validators.required]],
      gender: [null, [Validators.required]],
      religion: [null, [Validators.required]],
      roles: [[] as string[], [Validators.required]],
      isDisabled: [false],
    });
  }

  private loadScope(): void {
    this.scope$ = this.scopeService.get('faculty').pipe(
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

    const request = this.form.value;

    this.facultyId$
      .pipe(
        filter((id) => !!id),
        take(1),
        switchMap((facultyId) =>
          this.facultyUserService.create(facultyId!, request),
        ),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.httpErrorService.handle(err);
        },
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
