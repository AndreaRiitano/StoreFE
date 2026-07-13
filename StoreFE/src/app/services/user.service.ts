import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { KeycloakService } from '../security/keycloak/keycloak.service'
import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendUrl = 'http://localhost:8080/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,

  ) {
   const profile =  this.loadUserFromKeycloak();
  }


  syncUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}/sync`, {});
  }

  public async loadUserFromKeycloak() {
    console.log('Loading user from keycloak');
    const isLogged = this.keycloakService.isLoggedIn();

    if (isLogged) {
      try {

        const profile = await this.keycloakService.getUserProfileFromToken();
        const id = this.keycloakService.getKeycloakId();
        const userLogged: User = {
          keycloakId: id,
          email: profile.email || '',
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phone: profile.phone || '',
          address: profile.address || '',
        };

        this.currentUserSubject.next(userLogged);
        console.log("user loaded", userLogged);

      } catch (error) {
        console.error("user err loading", error);
      }
    }
  }

   getCurrentUserKeycloakId(): string {

    const id = this.currentUserSubject.value?.keycloakId;
    if(id === undefined || id === null) {
      return '';
    }else {
      return id;
    }
    console.log(id);
   }

   getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAllUser(): Observable<any>{
    return this.http.get(`${this.backendUrl}/all`);
  }
}
