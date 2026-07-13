import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../security/keycloak/keycloak.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private keycloakId: string | undefined;
  public cartCount = 0;

  constructor(
    private router: Router,
    public keycloakService: KeycloakService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    if (this.keycloakService.isLoggedIn()) {
      this.keycloakId = this.keycloakService.getKeycloakId();

       this.cartService.initCartCount();

      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
      });

    }
  }


  logout() {
    this.keycloakService.logout();
  }

  goToPersonalArea(){
    this.router.navigateByUrl('/personalarea');
  }
}
