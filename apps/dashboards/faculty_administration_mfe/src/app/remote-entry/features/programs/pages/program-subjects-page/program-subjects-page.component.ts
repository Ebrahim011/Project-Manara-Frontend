import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProgramService, SubjectService } from '@project-manara-frontend/services';
import { selectFacultyId } from '../../../../store/selectors/faculty.selectors';
import { filter, Observable, shareReplay, switchMap, take } from 'rxjs';
import { PaginatedList, RequestFilters, SubjectResponse } from '@project-manara-frontend/models';

@Component({
  selector: 'app-program-subjects-page',
  standalone: false,
  templateUrl: './program-subjects-page.component.html',
  styleUrls: ['./program-subjects-page.component.css']
})
export class ProgramSubjectsPageComponent implements OnInit {

  subjects$!: Observable<PaginatedList<SubjectResponse>>;
  filters = new RequestFilters();
  pageSizeOptions: number[] = [5, 10, 25, 50];

  selectedSubjects$!: Observable<SubjectResponse[]>;

  programId!: number;
  facultyId$ = this.store.select(selectFacultyId);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private programService: ProgramService,
  ) { }

  ngOnInit() {
    this.programId = +this.route.parent?.snapshot.params['id'];
    this.loadSelectedSubjects();
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjects$ = this.facultyId$.pipe(
      filter((id) => !!id),
      take(1),
      switchMap((id) => this.subjectService.getAll(id!, this.filters))
    );
  }


  loadSelectedSubjects() {
    this.selectedSubjects$ = this.programService.getSubjects(this.programId).pipe(
      shareReplay(1)
    );
  }

  addSubject(subject: SubjectResponse) {
    this.programService.addSubject(this.programId, subject.id).subscribe({
      next: () => this.loadSelectedSubjects()
    });
  }


  removeSubject(subject: SubjectResponse) {
    this.programService.removeSubject(this.programId, subject.id).subscribe({
      next: () => this.loadSelectedSubjects()
    });
  }


  isSelected(subjectId: number, selected: SubjectResponse[]): boolean {
    return selected.some(s => s.id === subjectId);
  }


  onSearch() {
    this.filters.PageNumber = 1;
    this.loadSubjects();
  }


  goToPage(page: number, totalPages: number) {
    if (page < 1 || page > totalPages) return;
    this.filters.PageNumber = page;
    this.loadSubjects();
  }

  onPageSizeChange() {
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
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  getStartIndex(response: PaginatedList<SubjectResponse>): number {
    return (response.pageNumber - 1) * this.filters.PageSize + 1;
  }

  getEndIndex(response: PaginatedList<SubjectResponse>): number {
    return Math.min(response.pageNumber * this.filters.PageSize, response.totalCount);
  }
}
