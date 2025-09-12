import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderForm } from '../types';

export interface IOrderResult {
	total: number;
	id: string;
}

export interface IShopAPI {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	makeOrder: (order: IOrderForm) => Promise<IOrderResult>;
}

export class ShopAPI extends Api implements IShopAPI {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}
	getProducts(): Promise<IProduct[]> {
		return this.get('/product/').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
	makeOrder(order: IOrderForm): Promise<IOrderResult> {
		return this.post(`/order/`, order).then((data: IOrderResult) => data);
	}
}
