import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gender, Religion } from '@project-manara-frontend/enums';
import {
  DepartmentUserResponse,
  PaginatedList,
  RequestFilters,
} from '@project-manara-frontend/models';
import {
  DepartmentUserService,
  HttpErrorService,
} from '@project-manara-frontend/services';
import { Observable } from 'rxjs';
import { DepartmentStaffFormDialogComponent } from '../../components/department-staff-form-dialog/department-staff-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-department-staffs-page',
  standalone: false,
  templateUrl: './department-staffs-page.component.html',
  styleUrls: ['./department-staffs-page.component.css'],
})
export class DepartmentStaffsPageComponent implements OnInit {
  filters = new RequestFilters();
  staffs$!: Observable<PaginatedList<DepartmentUserResponse>>;
  departmentId!: number;
  selectedStatus: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(
    private departmentUserService: DepartmentUserService,
    private route: ActivatedRoute,
    private httpErrorService: HttpErrorService,
    private dialog: MatDialog,
  ) {
    this.departmentId = Number(
      this.route.parent?.parent?.snapshot.params['id'],
    );
  }

  ngOnInit() {
    this.loadStaffs();
  }

  loadStaffs(): void {
    this.staffs$ = this.departmentUserService.getAll(
      this.departmentId,
      this.filters,
      this.selectedStatus,
    );
  }

  onSearch(): void {
    this.filters.PageNumber = 1;
    this.loadStaffs();
  }

  onStatusFilter(): void {
    this.filters.PageNumber = 1;
    this.loadStaffs();
  }

  onPageSizeChange(): void {
    this.filters.PageNumber = 1;
    this.loadStaffs();
  }

  onAddStaff(): void {
    const dialogRef = this.dialog.open(DepartmentStaffFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      minHeight: '90vh',
      panelClass: 'staff-form-dialog-panel',
      data: { departmentId: this.departmentId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadStaffs();
    });
  }

  onDelete(staff: any): void {
    this.departmentUserService.toggleStatus(staff.id).subscribe({
      next: () => {
        this.loadStaffs();
      },
      error: (errors) => {
        this.httpErrorService.handle(errors);
      },
    });
  }

  goToPage(page: number, totalPages: number): void {
    if (page < 1 || page > totalPages) return;
    this.filters.PageNumber = page;
    this.loadStaffs();
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

  getStartIndex(response: PaginatedList<DepartmentUserResponse>): number {
    return (response.pageNumber - 1) * this.filters.PageSize + 1;
  }

  getEndIndex(response: PaginatedList<DepartmentUserResponse>): number {
    return Math.min(
      response.pageNumber * this.filters.PageSize,
      response.totalCount,
    );
  }

  getGenderLabel(value: number): string {
    return Gender[value] || '—';
  }

  getReligionLabel(value: number): string {
    return Religion[value] || '—';
  }

  getRoleName(role: any): string {
    return role?.name || role || '—';
  }
}
