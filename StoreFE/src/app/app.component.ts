import { Component } from '@angular/core';
import { KeycloakService } from './security/keycloak/keycloak.service';
import { UserService } from './services/user.service'
import { CartService } from './services/cart.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StoreFE';
  constructor(
    public keycloakService: KeycloakService,
    public userService: UserService,
    public cartService: CartService,
  ) {
  }


  ngOnInit(): void {
    if (this.keycloakService.isLoggedIn()) {
      //debug
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

  logout() {
    this.keycloakService.logout();
  }
}
