import { Model} from "./base/model";
import {IOrderForm, IProduct, FormErrors, IBasket} from "../types";
import { EventEmitter } from "./base/events";

export class Product extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number| null;
}

export class AppState {
  store: Product[] = [];
  basket: IBasket = {
		items: [],
		total: 0
	};
   order: IOrderForm = {
    payment: '',  
    address: '',
    email: '',
    phone: ''
  };
  formErrors: FormErrors = {};

  addToBasket(product: IProduct): void {
  }

  removeFromBasket(id: string): void {
  }

  clearBasket(): void {
    this.basket.items = [];
		this.basket.total = 0;
  }

  getAmountBasket(): number {
    return null;
  }

  getTotalPriceBasket(): number {
    return null;
  }

  setOrder(field: keyof IOrderForm, value: string): void {
  }

  validateFormContacts(): boolean {
    return true;
  };
  validateFormOrder(): boolean {
    return true;
  };
  clearOrder(): void {
    // очистка данных заказа
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: ''
    };
  }

  setProducts(items: IProduct[]): void {
  }

  clearSelections(): void {
  }
}