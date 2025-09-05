import { Form } from "../components/common/form";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number| null;
}

export interface IOrderForm {
  payment: 'Онлайн' | 'При получении'|'';
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
  items: [];
  total?: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
  store: IProduct;
  basket: IProduct;
  order: IOrder | null;
  formErrors: FormErrors; 
  addToBasket(product: IProduct): void; //добавить в корзину
  removeFromBasket(id: string): void; // удалить из корзины
  clearBasket(): void; // очистить корзину
  getAmountBasket(): number; // получить кол-во товаров в корзине
  getTotalPriceBasket(): number; // получить общую сумму товаров в корзине
  setItems(): void; // записать все id товаров
  setOrder(field: keyof IOrder, value: string): void; // обновить поле заказа 
  validateFormContacts(): boolean; // валидация формы контактов
  validateFormOrder(): boolean; // валидация заказа
  clearOrder(): void; // очистить заказ
  setProducts(items: IProduct[]): void; // преобразование данных из api
  clearSelections(): void;
}