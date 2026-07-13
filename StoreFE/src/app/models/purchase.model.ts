import {ProductInPurchase} from './productinpurchase.model'
import {User} from './user.model'
export interface Purchase {
  productInPurchase : ProductInPurchase[];
  purchaseTime : Date;
  id : number;
  user? : User;
}
