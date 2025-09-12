import { Form } from '../components/common/form';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderForm {
	payment: PaymentType;
	address: string;
	email: string;
	phone: string;
}

export interface IBasket {
	items: string[];
	total: number;
}

export type PaymentType = 'Онлайн' | 'При получении' | '';
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
