import { Component } from '@angular/core';
import { KeycloakService } from './security/keycloak/keycloak.service';
import { UserService } from './services/user.service'
import { CartService } from './services/cart.service'
import { ProductInPurchase } from './models/productinpurchase.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StoreFE';
  private keycloakId : string | undefined;
  public cartCount =0;
  constructor(
    private router: Router,
    public keycloakService: KeycloakService,
    public userService: UserService,
    public cartService: CartService,
  ) {
  }



  ngOnInit(): void {
    if (this.keycloakService.isLoggedIn()) {
      //debug
      console.log('TOKEN:', this.keycloakService.keycloak?.tokenParsed);
      this.keycloakId= this.keycloakService.getKeycloakId();
      this.userService.syncUser().subscribe({
        next: (response: any) => {
          console.log('Sync ok', response);
        },
        error: (err: any) => {
          console.error('Sync err', err);
        }
      });

      this.cartService.cartCount$.subscribe(count => {
        this.cartCount += count;
      });

      this.cartService.getCart(this.keycloakId).subscribe({
        next: (pips) => {
          this.cartCount = pips.length;
          console.log("cart count update", this.cartCount);
        }
      });
    }
  }

  logout() {
    this.keycloakService.logout();
  }

  goToPersonalArea(){
    console.log('goToPersonalArea');
    this.router.navigateByUrl('/personalarea');
  }

}
