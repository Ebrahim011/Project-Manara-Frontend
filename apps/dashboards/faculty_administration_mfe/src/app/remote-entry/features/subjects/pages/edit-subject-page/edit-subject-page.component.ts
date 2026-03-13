import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  PaginatedList,
  RequestFilters,
  SubjectDetailResponse,
  SubjectRequest,
  SubjectResponse,
} from '@project-manara-frontend/models';
import {
  HttpErrorService,
  SubjectService,
} from '@project-manara-frontend/services';
import { filter, Observable, switchMap, take } from 'rxjs';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';

interface SelectedPrerequisite {
  id: number;
  name: string;
  code?: string;
  creditHours?: number;
}

@Component({
  selector: 'app-edit-subject-page',
  standalone: false,
  templateUrl: './edit-subject-page.component.html',
  styleUrls: ['./edit-subject-page.component.css'],
})
export class EditSubjectPageComponent implements OnInit {
  facultyId$ = this.store.select(selectFacultyId);
  subjects$!: Observable<PaginatedList<SubjectResponse>>;
  subjectId!: number;
  form!: FormGroup;
  selectedSubjects: SelectedPrerequisite[] = [];
  pageSizeOptions: number[] = [5, 10, 25, 50];
  filters = new RequestFilters();
  subjectName: string = '';
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private httpErrorService: HttpErrorService,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subjectId = Number(this.route.parent?.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadSubjectData();
    this.loadSubjects();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      creditHours: ['', [Validators.required]],
    });
  }

  private loadSubjectData(): void {
    this.subjectService.get(this.subjectId).subscribe({
      next: (subject: SubjectDetailResponse) => {
        this.subjectName = subject.name;
        this.form.patchValue({
          name: subject.name,
          code: subject.code,
          description: subject.description,
          creditHours: subject.creditHours,
        });
        // map prerequisites — code & creditHours not available from API
        this.selectedSubjects = subject.prerequisites.map((p) => ({
          id: p.id,
          name: p.name,
          code: undefined,
          creditHours: undefined,
        }));
      },
      error: (err) => {
        this.httpErrorService.handle(err);
      },
    });
  }
  loadSubjects(): void {
    this.subjects$ = this.facultyId$.pipe(
      filter((id) => !!id),
      take(1),
      switchMap((id) => this.subjectService.getAll(id!, this.filters)),
    );
  }

  onSearch(): void {
    this.filters.PageNumber = 1;
    this.loadSubjects();
  }

  goToPage(page: number, totalPages: number): void {
    if (page < 1 || page > totalPages) return;
    this.filters.PageNumber = page;
    this.loadSubjects();
  }

  onPageSizeChange(): void {
    this.filters.PageNumber = 1;
    this.loadSubjects();
  }

  getPages(totalPages: number): number[] {
    const current = this.filters.PageNumber;
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartIndex(response: PaginatedList<SubjectResponse>): number {
    return (response.pageNumber - 1) * this.filters.PageSize + 1;
  }

  getEndIndex(response: PaginatedList<SubjectResponse>): number {
    return Math.min(
      response.pageNumber * this.filters.PageSize,
      response.totalCount,
    );
  }

  addSubject(subject: SubjectResponse): void {
    this.selectedSubjects.push({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      creditHours: subject.creditHours,
    });
  }

  deleteSubject(id: number): void {
    this.selectedSubjects = this.selectedSubjects.filter((s) => s.id !== id);
  }

  isSelected(id: number): boolean {
    return this.selectedSubjects.some((s) => s.id === id);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const request: SubjectRequest = {
      ...this.form.value,
      prerequisiteIds: this.selectedSubjects.map((s) => s.id),
    };
    this.subjectService.update(this.subjectId, request).subscribe({
      next: () => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      },
      error: (err) => {
        this.httpErrorService.handle(err);
      },
    });
  }
}
