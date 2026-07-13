import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  getProductById(id: number): Observable<Product> {

    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  deleteProduct(id: number | undefined): Observable<any>{

    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  editProduct(product : Product): Observable<Product>{

    return this.http.post<Product>(`${this.apiUrl}/update`, product);
  }

  addProduct(product : Product): Observable<any>{

    return this.http.post(`${this.apiUrl}/create`, product );
  }

  searchProduct(name : string ): Observable<any>{
    let params = new HttpParams();
    params = params.set('name', name);
    return this.http.get(`${this.apiUrl}/search`,{params});
  }
}
