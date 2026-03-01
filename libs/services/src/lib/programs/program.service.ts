import { Injectable } from '@angular/core';
import { ApiClientService } from '../api/api-client.service';
import {
  ProgramDetailResponse,
  ProgramRequest,
  ProgramResponse,
} from '@project-manara-frontend/models';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  constructor(private apiClient: ApiClientService) {}

  getAll(
    departmentId: number,
    includeDisabled: boolean,
  ): Observable<ProgramResponse[]> {
    return this.apiClient.get(
      `${environment.apiUrl}/api/departments/${departmentId}/programs?includeDisabled=${includeDisabled}`,
    );
  }

  get(id: number): Observable<ProgramDetailResponse> {
    return this.apiClient.get(`${environment.apiUrl}/api/programs/${id}`);
  }

  create(departmentId: number, request: ProgramRequest) {
    return this.apiClient.post(
      `${environment.apiUrl}/api/departments/${departmentId}/programs`,
      request,
    );
  }

  update(id: number, request: ProgramRequest) {
    return this.apiClient.put(
      `${environment.apiUrl}/api/programs/${id}`,
      request,
    );
  }

  toggleStatus(id: number) {
    return this.apiClient.delete(
      `${environment.apiUrl}/api/programs/${id}/toggle-status`,
    );
  }
}
