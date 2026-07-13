import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import {User} from '../models/user.model';
import { ProductInPurchase } from '../models/productinpurchase.model';
import { UserService } from '../services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import {KeycloakService} from '../security/keycloak/keycloak.service'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();
  private items: Product[] = [];
  private apiUrl = 'http://localhost:8080/purchases';

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getCart(userID: string|undefined): Observable<ProductInPurchase[]> {
    if(userID) {
      let params = new HttpParams().set('keycloakId', userID);
      return this.http.get<ProductInPurchase[]>(`${this.apiUrl}/cart`, {params: params}).pipe(

        tap((cartItems: ProductInPurchase[]) => {

          const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
          this.cartCountSubject.next(totalItems);
        })
      );
    }
    return of([]);
  }

  initCartCount(): void {
    const currentUserId = this.keycloakService.getKeycloakId();
    if (currentUserId) {

      this.getCart(currentUserId).subscribe({
        error: (err) => console.error("Errore nell'inizializzazione del carrello:", err)
      });
    }
  }

  addToCart(product: Product): Observable<any> {
    const currentUserId : string | undefined = this.keycloakService.getKeycloakId();
    console.log(currentUserId);


    let pipToCart: ProductInPurchase = {
      product: product,
      quantity: 1,
      keycloakId: currentUserId,
    };
    return this.http.post(`${this.apiUrl}/addToCart`, pipToCart).pipe(
      tap(() => {
        this.incrementCartCount();
      })
    );
  }

  removeFromCart(product: Product): Observable<any> {
    const currentUserId : string | undefined = this.keycloakService.getKeycloakId();
    let toRemove: ProductInPurchase = {
      quantity: 1,
      product: product,
      keycloakId: currentUserId,
    };
    return this.http.post(`${this.apiUrl}/cartRemove`, toRemove).pipe(
      tap(() => {
        this.decrementCartCount();
      })
    );
  }

  getCartCount(): number {
    return this.cartCountSubject.value
  }

  decrementCartCount() {
    const current = this.cartCountSubject.value;
    if (current > 0) {
      this.cartCountSubject.next(current - 1);
    }
  }
  incrementCartCount() {
    const current = this.cartCountSubject.value;
    if (current <99) {
      this.cartCountSubject.next(current +1);
    }
  }
}
