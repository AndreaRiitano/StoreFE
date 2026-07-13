import {ProductInPurchase} from './productinpurchase.model'

export interface Purchase {
  productInPurchase : ProductInPurchase[];
  purchaseTime : Date;
  id : number;
}
