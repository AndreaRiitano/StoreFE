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

  getCart(userID: string): Observable<ProductInPurchase[]> {
    let params = new HttpParams().set('id', userID);
    return this.http.get<ProductInPurchase[]>(`${this.apiUrl}/cart`, {params: params});
  }

  getProductInCart(): Observable<ProductInPurchase[]> {

    let toSearch: User | null = this.userService.getCurrentUser();

    if (toSearch && toSearch.keycloakId) {
      let id: string = toSearch.keycloakId;


      return this.getCart(id).pipe(

        tap((cart: ProductInPurchase[]) => {

          const tot = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

          this.cartCountSubject.next(tot);

        })

      );
    }
    console.error("error product retrieve ");
    this.cartCountSubject.next(0);
    return of([]);
  }

  addToCart(product: Product): Observable<any> {
    const currentUserId : string | undefined = this.keycloakService.getKeycloakId();
    console.log(currentUserId);


    let pipToCart: ProductInPurchase = {
      product: product,
      quantity: 1,
      keycloakId: currentUserId,
    };
    return this.http.post(`${this.apiUrl}/addToCart`, pipToCart)

  }

  getCartCount(): number {

    return this.cartCountSubject.value


  }
}
