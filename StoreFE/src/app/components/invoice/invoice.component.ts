import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductInPurchase } from '../../models/productinpurchase.model';
import { PurchaseService } from '../../services/purchase.service'
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

  invoiceProducts: ProductInPurchase[] = [];
  total: number = 0;
  date : any;
  constructor(
    private router: Router,
    private productService: PurchaseService,
    ) {
    const data = this.productService.lastInvoice;

    if(data){
      this.invoiceProducts = data.products;
      this.total = data.total;
      this.date = data.date;
    }else{
      this.router.navigateByUrl('');
    }
  }


}
