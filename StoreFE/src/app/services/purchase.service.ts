import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Purchase } from '../models/purchase.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  public lastInvoice : any = null;
  
  private apiUrl = 'http://localhost:8080/purchases';

  constructor(private http: HttpClient) { }

  addPurchase(user : User): Observable<any> {

    return this.http.post(`${this.apiUrl}/addPurchase`, user);

  }
}
