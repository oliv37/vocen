import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translation } from './translation.model';

@Injectable({
  providedIn: 'root',
})
export class TranslationApi {
  httpClient = inject(HttpClient);

  getTranslations(): Observable<Translation[]> {
    return this.httpClient.get<Translation[]>('/api/translations');
  }

  createTranslation(translation: Omit<Translation, 'id'>): Observable<Translation> {
    return this.httpClient.post<Translation>('/api/translations', translation);
  }

  updateTranslation(translation: Translation): Observable<Translation> {
    return this.httpClient.put<Translation>(`/api/translations/${translation.id}`, translation);
  }

  deleteTranslation(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/translations/${id}`);
  }
}
