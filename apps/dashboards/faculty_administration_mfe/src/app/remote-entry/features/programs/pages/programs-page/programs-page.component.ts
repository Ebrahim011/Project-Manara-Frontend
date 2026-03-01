import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProgramResponse } from '@project-manara-frontend/models';
import {
  HttpErrorService,
  ProgramService,
} from '@project-manara-frontend/services';
import { Observable } from 'rxjs';
import { ProgramFormDialogComponent } from '../../components/program-form-dialog/program-form-dialog.component';

@Component({
  selector: 'app-programs-page',
  standalone: false,
  templateUrl: './programs-page.component.html',
  styleUrls: ['./programs-page.component.css'],
})
export class ProgramsPageComponent implements OnInit {
  includeDisabled: boolean = false;
  departmentId!: number;
  programs$!: Observable<ProgramResponse[]>;

  constructor(
    private route: ActivatedRoute,
    private programService: ProgramService,
    private httpErrorService: HttpErrorService,
    private matDialog: MatDialog,
  ) {
    this.departmentId = Number(
      this.route.parent?.parent?.snapshot.paramMap.get('id'),
    );
  }

  ngOnInit() {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programs$ = this.programService.getAll(
      this.departmentId,
      this.includeDisabled,
    );
  }
  onFilterChange() {
    this.loadPrograms();
  }
  onToggleStatus(id: number) {
    this.programService.toggleStatus(id).subscribe({
      next: () => {
        this.loadPrograms();
      },
      error: (errors) => {
        this.httpErrorService.handle(errors);
      },
    });
  }

  openProgramFormDialog() {
    this.matDialog
      .open(ProgramFormDialogComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: { departmentId: this.departmentId },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadPrograms();
      });
  }
}
