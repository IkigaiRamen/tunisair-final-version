import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = environment.apiUrl;

  constructor(private api: HttpClient) {}

  generate(format: 'excel' | 'pdf'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.api.get(`${this.baseUrl}/reports`, { params, responseType: 'blob' });
  }
  downloadMeetingReport(id: number, format: 'pdf' | 'xlsx'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.api.get(`${this.baseUrl}/reports/meeting/${id}/report`, { params, responseType: 'blob' });
  }
  // Generate All Meetings Report (Excel)
generateAllMeetingsReportExcel(): Observable<Blob> {
  return this.api.get(`${this.baseUrl}/reports/all-meetings/excel`, {
    responseType: 'blob',
  });
}

// Generate All Meetings Report (PDF)
generateAllMeetingsReportPDF(): Observable<Blob> {
  return this.api.get(`${this.baseUrl}/reports/all-meetings/pdf`, {
    responseType: 'blob',
  });
}

} 