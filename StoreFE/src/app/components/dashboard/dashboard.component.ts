import { Component } from '@angular/core';
import {KeycloakService} from '../../security/keycloak/keycloak.service'
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service'
import { PurchaseService } from '../../services/purchase.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model'
import { User } from '../../models/user.model'
import { Purchase } from '../../models/purchase.model'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  isAdmin: boolean = false;
  activeTab: 'prodotti' | 'ordini' | 'utenti' = 'prodotti';
  products: Product[] = [];
  purchases: Purchase[] = [];
  users: User[] = [];

  constructor(
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.isAdmin = this.keycloakService.hasRole('admin');
    if (!this.isAdmin) {
      this.router.navigateByUrl('');
    }
    this.loadProducts();
    this.loadPurchases();
    this.loadUsers();

  }

  loadProducts() {

    this.productService.getAllProducts().subscribe(
      products => {
        this.products = products;
      }
    )

  }

  loadPurchases() {
    this.purchaseService.getAllPurchase().subscribe(
      purchases => {
        this.purchases = purchases;
        console.log(this.purchases);
      }
    )

  }

  loadUsers() {

    this.userService.getAllUser().subscribe(
      users => {
        this.users = users;
      }
    )
  }
  getOrderTotal(purchase: Purchase): number {
    if (!purchase.productInPurchase) return 0;
    return purchase.productInPurchase.reduce((totale, item) => {
      return totale + ((item.product?.price || 0) * (item.quantity || 1));
    }, 0);
  }

  // PLACEHOLDER
  deleteProduct(id: number | undefined): void {


  }
}
