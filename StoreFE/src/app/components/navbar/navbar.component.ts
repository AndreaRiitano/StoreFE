import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../security/keycloak/keycloak.service'; // Aggiusta il percorso se necessario
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

      this.updateCartFromDb();

      this.cartService.cartCount$.subscribe(count => {
        this.updateCartFromDb();
      });

      this.cartService.getCart(this.keycloakId).subscribe({
        next: (pips) => {
          this.cartCount = pips.length;
          console.log("cart count update", this.cartCount);
        }
      });
    }
  }

  private updateCartFromDb() {
    if (!this.keycloakId) return;

    this.cartService.getCart(this.keycloakId).subscribe({
      next: (pips) => {
        this.cartCount = pips.length;
      },
      error: (err) => console.error("Err cart retr", err)
    });
  }

  logout() {
    this.keycloakService.logout();
  }

  goToPersonalArea(){
    this.router.navigateByUrl('/personalarea');
  }
}
