import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'
import { ProductInPurchase } from '../../models/productinpurchase.model'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  productList: ProductInPurchase[] = [];
  constructor(private cartService: CartService) {}

/*  ngOnInit() {

    this.cartService.getProductInCartCount().subscribe({
      next: (data : ProductInPurchase[]) => {
        this.productList = data;

      },
      error: (err : any) => {
        console.error("err loading cart", err);
      }
    });
  }*/
}
