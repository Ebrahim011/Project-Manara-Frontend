import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';
import { filter, Observable, take } from 'rxjs';
import {
  HttpErrorService,
  SubjectService,
} from '@project-manara-frontend/services';
import {
  PaginatedList,
  RequestFilters,
  SubjectResponse,
} from '@project-manara-frontend/models';

@Component({
  selector: 'app-subjects-page',
  standalone: false,
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.css'],
})
export class SubjectsPageComponent implements OnInit {
  filters = new RequestFilters();
  private facultyId!: number;
  selectedStatus: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  subjects$!: Observable<PaginatedList<SubjectResponse>>;

  constructor(
    private store: Store,
    private subjectService: SubjectService,
    private httpErrorService: HttpErrorService,
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectFacultyId)
      .pipe(
        filter((id) => !!id),
        take(1),
      )
      .subscribe((facultyId) => {
        this.facultyId = facultyId!;
        this.loadSubjects();
      });
  }

  loadSubjects(): void {
    this.subjects$ = this.subjectService.getAll(
      this.facultyId,
      this.filters,
      this.selectedStatus,
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

  onDelete(id: number): void {
    this.subjectService.toggleStatus(id).subscribe({
      next: () => {
        this.loadSubjects();
      },
      error: (errors) => {
        this.httpErrorService.handle(errors);
      },
    });
  }
}
