import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Gender, Religion } from '@project-manara-frontend/enums';
import {
  PaginatedList,
  ProgramUserResponse,
  RequestFilters,
} from '@project-manara-frontend/models';
import {
  HttpErrorService,
  ProgramUserService,
} from '@project-manara-frontend/services';
import { filter, Observable, take } from 'rxjs';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';

@Component({
  selector: 'app-students-page',
  standalone: false,
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css'],
})
export class StudentsPageComponent implements OnInit {
  filters = new RequestFilters();
  students$!: Observable<PaginatedList<ProgramUserResponse>>;
  selectedStatus: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  private facultyId!: number;

  constructor(
    private store: Store,
    private httpErrorService: HttpErrorService,
    private programUserService: ProgramUserService
  ) { }

  ngOnInit(): void {
    this.store
      .select(selectFacultyId)
      .pipe(
        filter((id) => !!id),
        take(1)
      )
      .subscribe((facultyId) => {
        this.facultyId = facultyId!;
        this.loadStudents();
      });
  }

  loadStudents(): void {
    this.students$ = this.programUserService.getAllByFacultyId(
      this.facultyId,
      this.filters,
      this.selectedStatus
    );
  };

  onSearch(): void {
    this.filters.PageNumber = 1;
    this.loadStudents();
  }

  onStatusFilter(): void {
    this.filters.PageNumber = 1;
    this.loadStudents();
  }

  goToPage(page: number, totalPages: number): void {
    if (page < 1 || page > totalPages) return;
    this.filters.PageNumber = page;
    this.loadStudents();
  }

  onPageSizeChange(): void {
    this.filters.PageNumber = 1;
    this.loadStudents();
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

  getStartIndex(response: PaginatedList<ProgramUserResponse>): number {
    return (response.pageNumber - 1) * this.filters.PageSize + 1;
  }

  getEndIndex(response: PaginatedList<ProgramUserResponse>): number {
    return Math.min(
      response.pageNumber * this.filters.PageSize,
      response.totalCount
    );
  }

  getGenderLabel(value: number): string {
    return Gender[value] || '—';
  }

  getReligionLabel(value: number): string {
    return Religion[value] || '—';
  }

  onDelete(id: number): void {
    this.programUserService.toggleStatus(id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: (errors) => {
        this.httpErrorService.handle(errors);
      },
    });
  }
}
