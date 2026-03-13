import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PaginatedList,
  RequestFilters,
  SubjectDetailResponse,
  SubjectRequest,
  SubjectResponse,
} from '@project-manara-frontend/models';
import { ApiClientService } from '@project-manara-frontend/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  constructor(private apiClient: ApiClientService) {}

  getAll(
    facultyId: number,
    filters?: RequestFilters,
    includeDisabled: boolean = false,
  ): Observable<PaginatedList<SubjectResponse>> {
    let params = new HttpParams();

    if (filters) {
      params = params
        .set('pageNumber', filters.PageNumber)
        .set('pageSize', filters.PageSize);

      if (filters.SearchValue)
        params = params.set('searchValue', filters.SearchValue);

      if (filters.SortDirection && filters.SortColumn) {
        params = params
          .set('sortDirection', filters.SortDirection)
          .set('sortColumn', filters.SortColumn);
      }
    }

    return this.apiClient.get(
      `${environment.apiUrl}/api/faculties/${facultyId}/subjects?includeDisabled=${includeDisabled}`,
      params,
    );
  }

  get(id: number): Observable<SubjectDetailResponse> {
    return this.apiClient.get(`${environment.apiUrl}/api/subjects/${id}`);
  }

  create(facultyId: number, request: SubjectRequest) {
    return this.apiClient.post(
      `${environment.apiUrl}/api/faculties/${facultyId}/subjects`,
      request,
    );
  }

  update(id: number, request: SubjectRequest) {
    return this.apiClient.put(
      `${environment.apiUrl}/api/subjects/${id}`,
      request,
    );
  }

  toggleStatus(id: number) {
    return this.apiClient.delete(
      `${environment.apiUrl}/api/subjects/${id}/toggle-status`,
    );
  }
}
