import {Product} from './product.model';

export interface ProductInPurchase {
  id?: number;
  product?: Product;
  quantity?: number;
  keycloakId?: string;
}
