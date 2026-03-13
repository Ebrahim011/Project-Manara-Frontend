import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramUserRequest } from '@project-manara-frontend/models';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';
import { filter, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Gender } from 'libs/enums/src/lib/gender';
import { RegexPatternConsts } from '@project-manara-frontend/consts';
import { Religion } from '@project-manara-frontend/enums';
import {
  HttpErrorService,
  ProgramUserService,
} from '@project-manara-frontend/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-student-page',
  standalone: false,
  templateUrl: './create-student-page.component.html',
  styleUrls: ['./create-student-page.component.css'],
})
export class CreateStudentPageComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;

  private facultyId!: number;

  religionOptions = Object.entries(Religion)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => ({ label: key, value }));

  genderOptions = Object.entries(Gender)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => ({ label: key, value }));

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private httpErrorService: HttpErrorService,
    private programUserService: ProgramUserService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFacultyId();
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
    });
  }

  private loadFacultyId(): void {
    this.store
      .select(selectFacultyId)
      .pipe(
        filter((id) => !!id),
        take(1),
      )
      .subscribe((facultyId) => {
        this.facultyId = facultyId!;
      });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const request: ProgramUserRequest = this.form.value;

    this.programUserService.create(this.facultyId, request).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        this.httpErrorService.handle(err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
