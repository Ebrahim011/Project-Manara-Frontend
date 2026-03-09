import { Injectable } from "@angular/core";
import { FacultyService, FacultyUserService } from "@project-manara-frontend/services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getFacultyAction, getFacultyFaildAction, getFacultySuccessAction } from "../actions/get-faculty.actions";
import { catchError, map, of, retry, switchMap } from "rxjs";
import { getFacultyUserAction, getFacultyUserFaildAction, getFacultyUserSuccessAction } from "../actions/get-faculty-user.actions";

@Injectable({
  providedIn: 'root'
})
export class FacultyUserEffect {

  facultyUser$;
  constructor(actions$: Actions,facultyUserService: FacultyUserService) {
    this.facultyUser$ = createEffect(() =>
      actions$.pipe(
        ofType(getFacultyUserAction),
        switchMap(() =>
          facultyUserService.my().pipe(
            map((response) => {
              return getFacultyUserSuccessAction({ facultyUser: response })
            }
            ),
            catchError((error) => {
              return of(getFacultyUserFaildAction({ error }));
            })
          )
        )
      )
    );
  }
}
