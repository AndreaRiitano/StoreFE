import { Component, OnInit } from '@angular/core';
import { KeycloakService } from './security/keycloak/keycloak.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'StoreFE';

  constructor(
    public keycloakService: KeycloakService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.keycloakService.isLoggedIn()) {
      console.log('TOKEN:', this.keycloakService.keycloak?.tokenParsed);

      this.userService.syncUser().subscribe({
        next: (response: any) => {
          console.log('Sync ok', response);
        },
        error: (err: any) => {
          console.error('Sync err', err);
        }
      });
    }
  }
}
