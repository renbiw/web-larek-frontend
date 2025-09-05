import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder } from '../types';

export interface IOrderResult extends IOrder{
  total: number;
  id: string;
}

export interface IShopAPI {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	makeOrder: () => Promise<IOrderResult>;
}