import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramUserResponse } from '@project-manara-frontend/models';
import { HttpErrorService, ProgramUserService } from '@project-manara-frontend/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-detail-page',
  standalone: false,
  templateUrl: './student-detail-page.component.html',
  styleUrls: ['./student-detail-page.component.css']
})
export class StudentDetailPageComponent implements OnInit {

  student$!: Observable<ProgramUserResponse>;

  constructor(
    private route: ActivatedRoute,
    private programUserService: ProgramUserService,
    private httpErrorService: HttpErrorService
  ) { }

  ngOnInit(): void {
    const studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.student$ = this.programUserService.get(studentId);
  }

}
