import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegexPatternConsts } from '@project-manara-frontend/consts';
import { Gender, Religion } from '@project-manara-frontend/enums';
import {
  FacultyUserResponse,
  RoleResponse,
} from '@project-manara-frontend/models';
import {
  FacultyUserService,
  HttpErrorService,
  ScopeService,
} from '@project-manara-frontend/services';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin, takeUntil } from 'rxjs';

@Component({
  selector: 'app-staff-basic-info-page',
  standalone: false,
  templateUrl: './staff-basic-info-page.component.html',
  styleUrls: ['./staff-basic-info-page.component.css'],
})
export class StaffBasicInfoPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  showPassword = false;

  roles: RoleResponse[] = [];

  religionOptions = Object.entries(Religion)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => ({ label: key, value }));

  genderOptions = Object.entries(Gender)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => ({ label: key, value }));

  private staffId!: number;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private scopeService: ScopeService,
    private facultyUserService: FacultyUserService,
    private httpErrorService: HttpErrorService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.staffId = +this.route.parent!.snapshot.params['id'];
    this.initForm();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      nationalId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.pattern(RegexPatternConsts.PASSWORD_PATTERN)]],
      birthDate: [null, [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      gender: [null, [Validators.required]],
      religion: [null, [Validators.required]],
      isDisabled: [false],
      roles: [[], [Validators.required]],
    });
  }

  private loadData(): void {
    forkJoin({
      staff: this.facultyUserService.get(this.staffId),
      scope: this.scopeService.get('faculty'),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ staff, scope }) => {
          this.roles = scope?.roles || [];
          this.populateForm(staff);
        },
        error: (error) => {
          this.httpErrorService.handle(error);
        },
      });
  }

  private populateForm(staff: FacultyUserResponse): void {
    this.form.patchValue({
      name: staff.name || '',
      nationalId: staff.nationalId || '',
      email: staff.email || '',
      password: '',
      birthDate: staff.birthDate || null,
      phoneNumber: staff.phoneNumber || '',
      gender: staff.gender ?? null,
      religion: staff.religion ?? null,
      isDisabled: staff.isDisabled || false,
      roles: staff.roles?.map((r: any) => r.name || r) || [],
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    this.facultyUserService
      .update(this.staffId, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedStaff) => {
          this.form.markAsPristine();
          this.toastrService.success('Update Staff Successfully');
        },
        error: (error) => {
          this.httpErrorService.handle(error);
        },
      });
  }
}
