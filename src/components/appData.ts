import { Model} from "./base/model";
import { IAppState, IOrder, IProduct, FormErrors} from "../types";

export class Product extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number| null;
}

export class AppState extends Model<IAppState> {
  store: Product[] = [];
  basket: Product[] = [];
   order: IOrder = {
    payment: '',  
    address: '',
    email: '',
    phone: '',
    items: [],   
    total: null,   
  };
   formErrors: FormErrors = {};

  addToBasket(product: IProduct): void {
  }

  removeFromBasket(id: string): void {
  }

  clearBasket(): void {
  }

  getAmountBasket(): number {
    return this.basket.length;
  }

  getTotalPriceBasket(): number {
    return this.basket.reduce((sum, prod) => sum + (prod.price ?? 0), 0);
  }

  setItems(): void {
  }

  setOrder(field: keyof IOrder, value: string): void {
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
      phone: '',
      items: [],
      total: null,
    };
  }

  setProducts(items: IProduct[]): void {
  }

  clearSelections(): void {
  }
}