import {Product} from './product.model';

export interface CartItemDetails {
  product: Product;
  quantity: number;
}
