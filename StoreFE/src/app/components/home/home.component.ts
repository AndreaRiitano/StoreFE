import { Component } from '@angular/core';
import {KeycloakService} from '../../security/keycloak/keycloak.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public keycloakService: KeycloakService) {
  }
}
