import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'
import { ProductInPurchase } from '../../models/productinpurchase.model'
import { KeycloakService } from '../../security/keycloak/keycloak.service'
import {User} from '../../models/user.model'
import {UserService} from '../../services/user.service';
import { Product } from '../../models/product.model';
import { CartItemDetails } from '../../models/cartitemdetails.model'
import { Purchase } from '../../models/purchase.model'
import {PurchaseService} from '../../services/purchase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent {
  constructor(
    private cartService: CartService,
    private userService: UserService,
    private purchaseService: PurchaseService,
    private router: Router
  ) {
  }
  public cartCount = 0;

  cartItems : ProductInPurchase[] = [];

  user : User | null = null;
  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.userService.currentUser$.subscribe((user) => {
      this.user = user;

      if (this.user?.keycloakId) {
        this.cartService.getCart(this.user.keycloakId).subscribe(
          (items) => {
            this.cartItems = items;
          }
        );
      }
    });
  }

  removeFromCart(product : Product) {
    this.cartService.removeFromCart(product).subscribe({

      next: () => {

        const itemIndex = this.cartItems.findIndex(item => item.product?.id === product.id);

        if (itemIndex !== -1) {

          this.cartItems[itemIndex].quantity -= 1;

          if (this.cartItems[itemIndex].quantity === 0) {
            this.cartItems.splice(itemIndex, 1);
          }
        }
      },
      error: (err) => console.error("server err", err)
    });

  }

    cartPurchase(): void {
    if(this.user){
      const cartSnapshot = [...this.cartItems];
      const totalCost = this.cartTotal();
      console.log("Sto spedendo alla fattura:", cartSnapshot);
      this.purchaseService.addPurchase(this.user).subscribe({
        next: () => {
          this.purchaseService.lastInvoice ={
            products : cartSnapshot,
            total: totalCost,
            date : Date.now(),
          }
          this.cartItems = [];
          this.cartService.initCartCount();
          this.router.navigateByUrl('/invoice')
        },
        error: (err) => {console.log("error during purchase", err)
        alert("Errore durante l'acquisto, quantità selezionata non disponibile")}
      })
    }
    }

  cartTotal(): number {
    let total = 0;
    this.cartItems.forEach(item  => {
      if(item.product){
      total += item.product.price * item.quantity;
        }
    })
    return total;
  }
}
