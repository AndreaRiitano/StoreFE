import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  constructor() { }

  public keycloak!: Keycloak;

  init(): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: "http://localhost:9090",
      realm:'store',
      clientId: 'prod'
    });

    return this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
    });
  }
   isLoggedIn(): boolean {
    return  !!this.keycloak?.authenticated;
  }

  login(redirectUri?: string): void {
    this.keycloak.login({
      redirectUri: redirectUri || window.location.href
    });
  }

  register(redirectUri?: string): void {
    this.keycloak.login({
      redirectUri: redirectUri || window.location.href,
      action: 'register'
    });
  }

  logout(): void {

    this.keycloak.clearToken();
    sessionStorage.clear();
    localStorage.clear();

    const realm = 'store';
    const clientId = 'prod';
    const redirectUri = 'http://localhost:4200';

    const logoutUrl = `http://localhost:9090/realms/${realm}/protocol/openid-connect/logout`
      + `?client_id=${clientId}`
      + `&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    window.location.href = logoutUrl;
  }


  async getToken(): Promise<string> {
    try {
      if (!this.keycloak?.authenticated) {
        return '';
      }
      await this.keycloak.updateToken(30);
      return this.keycloak.token as string;
    } catch (e) {
      console.error('Token refresh failed', e);
      this.login();
      return '';
    }
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasResourceRole(role);
  }
}
