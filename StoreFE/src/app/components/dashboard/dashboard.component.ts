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
  isModalOpen: boolean = false;
  selectedProduct: Product | null = null;
  isAdmin: boolean = false;
  activeTab: 'prodotti' | 'ordini' | 'utenti' = 'prodotti';
  products: Product[] = [];
  purchases: Purchase[] = [];
  users: User[] = [];
  isCreateModalOpen: boolean = false;
  newProduct: Product = this.getEmptyProduct();

  constructor(
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {
  }

  private getEmptyProduct(): Product {
    return { name: '', category: '', price: 0, quantity: 0, description: '', code: '', imgUrl: '' } as Product;
  }
  openCreateModal(): void {
    this.newProduct = this.getEmptyProduct();
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }


  openEditModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
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

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe({
      next: (createdProduct) => {
        this.products.push(createdProduct);
        this.closeCreateModal();
        alert('Nuovo prodotto aggiunto con successo!');
      },
      error: (err) => {
        console.error("err adding", err);
        alert("Impossibile creare il prodotto.");
      }
    });
  }

  editProduct() {
    if (this.selectedProduct) {
      this.productService.editProduct(this.selectedProduct).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }

          this.closeModal();
          alert('Prodotto aggiornato con successo!');
        },
        error: (err) => {
          console.error("Err during update", err);
          alert("Impossibile aggiornare il prodotto.");
        }
      });
    }



  }

  deleteProduct(id: number | undefined): void {
    if (id && confirm('Sei sicuro di voler eliminare definitivamente questo prodotto?')) {

      this.productService.deleteProduct(id).subscribe({
        next: () => {

          this.products = this.products.filter(p => p.id !== id);

        },
        error: (err) => {
          console.error("Err during remove", err);
        }
      });
    }
  }
}
