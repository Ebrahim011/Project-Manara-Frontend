import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiModule } from '@project-manara-frontend/ui';
import { routes } from './subjects.route';
import { CreateSubjectPageComponent } from './pages/create-subject-page/create-subject-page.component';
import { SubjectsPageComponent } from './pages/subjects-page/subjects-page.component';
import { EditSubjectPageComponent } from './pages/edit-subject-page/edit-subject-page.component';
import { SubjectDetailPageComponent } from './pages/subject-detail-page/subject-detail-page.component';
import { DirectivesModule } from '@project-manara-frontend/directives';
import { SubjectOverviewPageComponent } from './pages/subject-overview-page/subject-overview-page.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    UiModule,
    NgSelectModule,
    DirectivesModule,
  ],
  declarations: [
    CreateSubjectPageComponent,
    SubjectsPageComponent,
    EditSubjectPageComponent,
    SubjectDetailPageComponent,
    SubjectOverviewPageComponent,
  ],
})
export class SubjectsModule {}
