import { Routes } from "@angular/router";
import { StudentsPageComponent } from "./pages/students-page/students-page.component";
import { StudentDetailPageComponent } from "./pages/student-detail-page/student-detail-page.component";
import { StudentOverviewComponent } from "./pages/student-overview/student-overview.component";
import { EditStudentPageComponent } from "./pages/edit-student-page/edit-student-page.component";
import { CreateStudentPageComponent } from "./pages/create-student-page/create-student-page.component";

export const routes: Routes = [
  {
    path: '',
    component: StudentsPageComponent
  },
  {
    path: 'add',
    component: CreateStudentPageComponent
  },
  {
    path: ':id',
    component: StudentDetailPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: StudentOverviewComponent
      },
      {
        path: 'settings',
        component: EditStudentPageComponent
      }
    ]
  }
]
