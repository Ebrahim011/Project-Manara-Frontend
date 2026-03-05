import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DepartmentResponse,
  ProgramResponse,
  ProgramUserRequest,
} from '@project-manara-frontend/models';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';
import { filter, take, switchMap, forkJoin } from 'rxjs';
import { ProgramService } from 'libs/services/src/lib/programs/program.service';
import { Store } from '@ngrx/store';
import { Gender } from 'libs/enums/src/lib/gender';
import { RegexPatternConsts } from '@project-manara-frontend/consts';
import { Religion } from '@project-manara-frontend/enums';
import {
  DepartmentService,
  HttpErrorService,
  ProgramUserService,
  ToastService,
} from '@project-manara-frontend/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-student-page',
  standalone: false,
  templateUrl: './edit-student-page.component.html',
  styleUrls: ['./edit-student-page.component.css'],
})
export class EditStudentPageComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;

  departments: DepartmentResponse[] = [];
  programs: ProgramResponse[] = [];

  private studentId!: number;
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
    private toastrService: ToastService,
    private httpErrorService: HttpErrorService,
    private programUserService: ProgramUserService,
    private departmentService: DepartmentService,
    private programService: ProgramService
  ) {
    this.studentId = Number(this.route.parent?.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.initForm();
    this.loadPageData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      nationalId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.pattern(RegexPatternConsts.PASSWORD_PATTERN)]],
      birthDate: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      religion: [null, [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      departmentId: [null, [Validators.required]],
      programId: [null, [Validators.required]],
      isDisabled: [false],
    });
  }

  private loadPageData(): void {

    this.store
      .select(selectFacultyId)
      .pipe(
        filter((id) => !!id),
        take(1),
        switchMap((facultyId) => {
          this.facultyId = facultyId!;
          return forkJoin({
            departments: this.departmentService.getAll(this.facultyId, false),
            student: this.programUserService.get(this.studentId),
          });
        })
      )
      .subscribe({
        next: ({ departments, student }) => {
          this.departments = departments;

          this.form.patchValue({
            name: student.name,
            nationalId: student.nationalId,
            email: student.email,
            birthDate: student.birthDate,
            gender: student.gender,
            religion: student.religion,
            phoneNumber: student.phoneNumber,
            departmentId: student.departmentId,
            programId: student.programId,
            isDisabled: student.isDisabled,
          });

          if (student.departmentId) {
            this.loadPrograms(student.departmentId, student.programId);
          }

        },
        error: (err) => {
          this.httpErrorService.handle(err);
        },
      });
  }

  onDepartmentChange(): void {
    this.form.patchValue({ programId: null });
    this.programs = [];

    const departmentId = this.form.get('departmentId')?.value;
    if (departmentId) {
      this.loadPrograms(departmentId);
    }
  }

  private loadPrograms(departmentId: number, selectedProgramId?: number): void {
    this.programService.getAll(departmentId, false).subscribe({
      next: (res) => {
        this.programs = res;
        if (selectedProgramId) {
          this.form.patchValue({ programId: selectedProgramId });
        }
      },
      error: (err) => this.httpErrorService.handle(err),
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const programId = this.form.get('programId')?.value;

    this.programUserService.update(programId, this.studentId, formValue).subscribe({
      next: () => {
        this.toastrService.success('Student updated successfully');
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
