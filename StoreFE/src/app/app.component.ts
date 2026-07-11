import { Component } from '@angular/core';
import { KeycloakService } from './security/keycloak/keycloak.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StoreFE';
  constructor(public keycloakService: KeycloakService) {
  }
}
