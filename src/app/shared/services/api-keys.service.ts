import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiKey, CreateApiKeyRequest, ApiResponse } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/api-keys`;

  constructor(private http: HttpClient) {}

  getMyKeys(): Observable<ApiKey[]> {
    return this.http.get<{ data: ApiKey[] }>(this.API_URL).pipe(
      map(response => response.data ?? [])
    );
  }

  createKey(data: CreateApiKeyRequest): Observable<ApiResponse<ApiKey>> {
    return this.http.post<ApiResponse<ApiKey>>(this.API_URL, data);
  }

  revokeKey(keyId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${keyId}`);
  }
}