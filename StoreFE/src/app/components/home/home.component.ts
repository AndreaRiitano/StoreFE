import { Component, OnInit } from '@angular/core';
import {KeycloakService} from '../../security/keycloak/keycloak.service'
import { ProductService } from '../../services/product.service'

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
    public keycloakService: KeycloakService
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

  aggiungiAlCarrello(product: any): void {
    if (!this.isLogged) {
      this.keycloakService.login();
      return;
    }
  }
}
