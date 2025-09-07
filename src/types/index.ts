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

export interface IBasket {
  items: [];
  total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;