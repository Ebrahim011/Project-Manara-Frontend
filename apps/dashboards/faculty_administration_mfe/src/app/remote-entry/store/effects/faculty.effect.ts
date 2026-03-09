import { Injectable } from "@angular/core";
import { FacultyService } from "@project-manara-frontend/services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getFacultyAction, getFacultyFaildAction, getFacultySuccessAction } from "../actions/get-faculty.actions";
import { catchError, map, of, retry, switchMap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FacultyEffect {

  faculty$;
  constructor(actions$: Actions, facultyService: FacultyService) {
    this.faculty$ = createEffect(() =>
      actions$.pipe(
        ofType(getFacultyAction),
        switchMap(() =>
          facultyService.my().pipe(
            map((response) =>
            {
              return getFacultySuccessAction({ faculty: response })
            }
            ),
            catchError((error) => {
              return of(getFacultyFaildAction({ error }));
            })
          )
        )
      )
    );
  }
}
