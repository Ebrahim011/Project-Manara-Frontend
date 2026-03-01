import { Injectable } from '@angular/core';
import { ApiClientService } from '../api/api-client.service';
import {
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

  create(departmentId: number, request: ProgramRequest) {
    return this.apiClient.post(
      `${environment.apiUrl}/api/departments/${departmentId}/programs`,
      request,
    );
  }

  toggleStatus(id: number) {
    return this.apiClient.delete(
      `${environment.apiUrl}/api/programs/${id}/toggle-status`,
    );
  }
}
