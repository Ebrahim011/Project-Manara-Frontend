import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable, switchMap, take } from 'rxjs';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';
import {
  PaginatedList,
  RequestFilters,
  SubjectRequest,
  SubjectResponse,
} from '@project-manara-frontend/models';
import {
  HttpErrorService,
  SubjectService,
} from '@project-manara-frontend/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-subject-page',
  standalone: false,
  templateUrl: './create-subject-page.component.html',
  styleUrls: ['./create-subject-page.component.css'],
})
export class CreateSubjectPageComponent implements OnInit {
  facultyId$ = this.store.select(selectFacultyId);
  subjects$!: Observable<PaginatedList<SubjectResponse>>;
  filters = new RequestFilters();
  pageSizeOptions: number[] = [5, 10, 25, 50];
  form!: FormGroup;
  selectedSubjects: SubjectResponse[] = [];
  constructor(
    private store: Store,
    private subjectService: SubjectService,
    private fb: FormBuilder,
    private httpErrorService: HttpErrorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initForm();
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

  loadSubjects() {
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

  onStatusFilter(): void {
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

  addSubject(request: SubjectResponse) {
    this.selectedSubjects.push(request);
  }

  deleteSubject(id: number) {
    this.selectedSubjects = this.selectedSubjects.filter((s) => s.id !== id);
  }

  isSelected(id: number): boolean {
    return this.selectedSubjects.some((s) => s.id === id);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const request: SubjectRequest = this.form.value;
    request.prerequisiteIds = this.selectedSubjects.map((s) => s.id);

    this.facultyId$
      .pipe(
        filter((id) => !!id),
        take(1),
        switchMap((id) => this.subjectService.create(id!, request)),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          this.httpErrorService.handle(err);
        },
      });
  }
}
