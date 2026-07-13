import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import {KeycloakService} from '../../security/keycloak/keycloak.service'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  product: Product | undefined;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
  ) {}

  ngOnInit(): void {
    const userId = this.keycloakService.getKeycloakId();
    this.isLoggedIn = !!userId;
    const productId = this.route.snapshot.paramMap.get('id');
    console.log(productId);
    if (productId) {
      this.productService.getProductById(Number(productId)).subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('err loading product', err);
          this.isLoading = false;
        }
      });
    }
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      return;
    }
    if (this.product) {
      this.cartService.addToCart(this.product).subscribe();
    }
  }
}
