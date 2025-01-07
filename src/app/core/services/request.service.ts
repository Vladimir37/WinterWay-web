import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private apiUrl = 'http://localhost:5161/api/';
    private options = {
        withCredentials: true
    };

    constructor(private http: HttpClient) {}

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${url}`, this.options);
    }

    post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${url}`, body, this.options);
    }
}
