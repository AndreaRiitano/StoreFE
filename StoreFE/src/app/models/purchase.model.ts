import {CartItemDetails} from './cartitemdetails.model'

export interface Purchase {
  cart : CartItemDetails[];
  user: string | undefined;
}
