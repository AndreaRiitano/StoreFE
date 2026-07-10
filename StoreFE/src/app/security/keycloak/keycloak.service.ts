import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;

  get keycloak() {
    if(!this.keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'store',
        clientId: 'prod'
      });
    }
    return this._keycloak;
  }
  constructor() { }

  async init() {
    console.log('Initializing Keycloak');
    const authenticated = await this.keycloak?.init({
      onLoad: "login-required"
    })
    if (authenticated) {
      console.log('Authenticated');
    }
  }
}
