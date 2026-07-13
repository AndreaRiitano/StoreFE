import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'
import { ProductInPurchase } from '../../models/productinpurchase.model'
import { KeycloakService } from '../../security/keycloak/keycloak.service'
import {User} from '../../models/user.model'
import {UserService} from '../../services/user.service';
import { Product } from '../../models/product.model'

export interface CartItemDetails {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent {
  constructor(
    private cartService: CartService,
    private userService: UserService,
  ) {
  }
  public cartCount = 0;
  groupedCartItems: CartItemDetails[] = [];
  cartItemsPips: any[] = [];
  user : User | null = null;
  ngOnInit() {
    this.userService.currentUser$.subscribe(
      (user) => {
        this.user = user;
      }
    )
    this.cartService.getCart(this.user?.keycloakId).subscribe(
      (items) => this.groupedCartItems = this.groupProductsWithQuantity(items),
    )
    console.log(this.cartItemsPips.length);

    this.updateCartFromDb();

    this.cartService.cartCount$.subscribe(count => {
      this.updateCartFromDb();
    });
    if(this.user) {


      this.cartService.getCart(this.user.keycloakId).subscribe({
        next: (pips) => {
          this.cartCount = pips.length;
          console.log("cart count update", this.cartCount);
        }
      });
    }
  }

  groupProductsWithQuantity(purchases: ProductInPurchase[]): CartItemDetails[] {
    const cartMap = new Map<number, CartItemDetails>();

    purchases.forEach((item: ProductInPurchase) => {
      const product = item.product;

      if (product && product.id) {
        if (cartMap.has(product.id)) {
          const existingItem = cartMap.get(product.id)!;
          existingItem.quantity += 1;
        } else {
          cartMap.set(product.id, { product: product, quantity: 1 });
        }
      }
    });

    return Array.from(cartMap.values());
  }

  private updateCartFromDb() {
    if (!this.user?.keycloakId) return;

    this.cartService.getCart(this.user.keycloakId).subscribe({
      next: (pips) => {
        this.cartCount = pips.length;
      },
      error: (err) => console.error("Err cart retr", err)
    });
  }

  cartTotal(): number {
    let total = 0;
    this.groupedCartItems.forEach(item => {

      total += item.product.price * item.quantity;
    })
    return total;
  }

  removeFromCart(product : Product) {
    this.cartService.removeFromCart(product).subscribe({

      next: () => {
        const itemIndex = this.groupedCartItems.findIndex(item => item.product.id === product.id);

        if (itemIndex !== -1) {

          this.groupedCartItems[itemIndex].quantity -= 1;

          if (this.groupedCartItems[itemIndex].quantity === 0) {
            this.groupedCartItems.splice(itemIndex, 1);
          }

          if (this.cartService.cartCount$) {
            this.cartService.decrementCartCount();
          }
        }
      },
      error: (err) => {
        console.error("error during item remove", err);
      }
    });
  }
}
