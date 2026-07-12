import { Component, OnInit } from '@angular/core';
import {KeycloakService} from '../../security/keycloak/keycloak.service'
import { ProductService } from '../../services/product.service'
import { CartService } from '../../services/cart.service'
import { Product } from  '../../models/product.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  products: any[] = [];
  isLogged: boolean = false;

  constructor(
    public productService: ProductService,
    public keycloakService: KeycloakService,
    public cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.isLogged = this.keycloakService.isLoggedIn();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Err', err)
    });
  }

  addToCart(product : Product): void {

    this.cartService.addToCart(product).subscribe({
      next: (response) => {
        console.log("cart added", response);
      },
      error: (err) => {
        console.error("cart err", err);
      }
    });
  }

}
