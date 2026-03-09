import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError
} from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@project-manara-frontend/services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  // ✅ BehaviorSubject عشان الـ requests التانية تستنى
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        // ========================
        // 401 Unauthorized
        // ========================
        if (error.status === 401) {

          // ✅ لو الـ refresh نفسه رجّع 401 → logout فوراً
          if (req.url.includes('refresh')) {
            this.forceLogout();
            return throwError(() => error);
          }

          // ✅ مفيش token أصلاً → logout
          if (!this.authService.isAuthenticated) {
            this.forceLogout();
            return throwError(() => error);
          }

          return this.handle401(req, next);
        }

        // ========================
        // Navigation Errors (مش 401)
        // ========================
        this.handleNavigation(error);

        const message =
          error?.error?.message ||
          error.statusText ||
          'An unexpected error occurred';

        return throwError(() => ({ ...error, message }));
      })
    );
  }

  // ✅ handle401 منفصلة
  private handle401(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // ✅ لو في refresh جاري → استنى على الـ token الجديد
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),  // استنى لحد ما يجي token
        take(1),
        switchMap(token =>
          next.handle(this.addToken(req, token!))
        )
      );
    }

    // ✅ ابدأ refresh جديد
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null); // reset

    return this.authService.refreshToken().pipe(
      switchMap(auth => {
        this.isRefreshing = false;
        const newToken = auth.token;

        // ✅ أبلغ الـ requests المنتظرة بالـ token الجديد
        this.refreshTokenSubject.next(newToken);

        return next.handle(this.addToken(req, newToken));
      }),
      catchError(err => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        this.forceLogout();
        return throwError(() => err);
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private forceLogout(): void {
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private handleNavigation(error: HttpErrorResponse): void {
    switch (error.status) {
      case 403:
        this.router.navigate(['/access-denied']);
        break;
      case 404:
        this.router.navigate(['/not-found']);
        break;
      case 500:
      case 502:
      case 503:
        this.router.navigate(['/server-error']);
        break;
    }
  }
}
