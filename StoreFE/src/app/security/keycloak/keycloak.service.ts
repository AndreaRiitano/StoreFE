import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  constructor() { }

  private keycloak!: Keycloak;

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
}
