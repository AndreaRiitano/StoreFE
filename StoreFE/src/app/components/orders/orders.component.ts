import { Component } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service'
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model'
import { ProductInPurchase } from '../../models/productinpurchase.model'
import { Purchase } from '../../models/purchase.model'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  currentUser : User | null = null;
  purchases : Purchase[] = [];
  constructor(
    private userService: UserService,
    private purchaseService: PurchaseService,
  ) { }
  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    if(this.currentUser) {
      this.purchaseService.getAllPurchase(this.currentUser).subscribe(
        data => {this.purchases = data
        }
      );
    }
  }

  getTotalPrice(purchase : Purchase) : number{

    let total = 0;
    purchase.productInPurchase.forEach(purchase => {
      total += (purchase.quantity || 0) * (purchase.product?.price || 0);
    })

    return total;
  }
}
