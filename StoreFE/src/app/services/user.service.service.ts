import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

 
  syncUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}/sync`, {});
  }
}
