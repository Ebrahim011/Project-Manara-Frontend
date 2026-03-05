import { Injectable } from '@angular/core';
import { ApiClientService } from '../api/api-client.service';
import { PaginatedList, ProgramUserRequest, ProgramUserResponse, RequestFilters } from '@project-manara-frontend/models';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramUserService {
  constructor(private apiClient: ApiClientService) { }

  getAllByProgramId(programId: number,filters?: RequestFilters,includeDisabled: boolean = false): Observable<PaginatedList<ProgramUserResponse>> {

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
      `${environment.apiUrl}/api/programs/${programId}/programUsers?includeDisabled=${includeDisabled}`,
      params,
    );
  }

  getAllByFacultyId(facultyId: number,filters?: RequestFilters,includeDisabled: boolean = false): Observable<PaginatedList<ProgramUserResponse>> {

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
      `${environment.apiUrl}/api/faculties/${facultyId}/programUsers?includeDisabled=${includeDisabled}`,
      params,
    );
  }

  my(): Observable<ProgramUserResponse> {
    return this.apiClient.get(`${environment.apiUrl}/api/programUsers/my`);
  }

  get(id: number): Observable<ProgramUserResponse> {
    return this.apiClient.get(`${environment.apiUrl}/api/programUsers/${id}`);
  }

  create(programId: number, request: ProgramUserRequest) {
    return this.apiClient.post(
      `${environment.apiUrl}/api/programs/${programId}/programUsers`,
      request,
    );
  }

  update(programId: number,programUserId : number, request: ProgramUserRequest) {
    return this.apiClient.put(
      `${environment.apiUrl}/api/programs/${programId}/programUsers/${programUserId}`,
      request,
    );
  }

  toggleStatus(id: number) {
    return this.apiClient.delete(
      `${environment.apiUrl}/api/programUsers/${id}`,
    );
  }
}
