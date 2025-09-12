import { Model } from './base/model';
import {
	IOrderForm,
	IProduct,
	FormErrors,
	IBasket,
	PaymentType,
} from '../types';
import { emailType, phoneType } from '../utils/constants';
import { EventEmitter, IEvents } from './base/events';

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export class AppState {
	store: IProduct[] = [];
	basket: IBasket = {
		items: [],
		total: 0,
	};
	order: IOrderForm = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	addToBasket(product: IProduct): void {
		this.basket.items.push(product.id);
		this.basket.total += product.price;
		this.events.emit('basket:change', this.basket);
	}

	removeFromBasket(product: IProduct): void {
		this.basket.items = this.basket.items.filter((id) => id !== product.id);
		this.basket.total -= product.price;
		this.events.emit('basket:change', this.basket);
	}

	clearBasket(): void {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:change', this.basket);
	}

	checkItemInBasket(product: IProduct): boolean {
		return this.basket.items.includes(product.id);
	}

	getAmountBasket(): number {
		return this.basket.items.length;
	}

	getTotalPriceBasket(): number {
		return this.basket.total;
	}

	setOrder(field: keyof IOrderForm, value: string): void {
		if (field === 'payment') {
			this.order.payment = value as PaymentType;
		} else {
			this.order[field] = value;
		}
	}

	validateFormContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!emailType.test(this.order.email)) {
			errors.email = 'Неправильно указан email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneType.test(this.order.phone)) {
			errors.phone = 'Неправильно указан телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
	validateFormOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder(): void {
		// очистка данных заказа
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	setProducts(items: IProduct[]): void {
		this.store = items;
		this.events.emit('items:change', items);
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.events.emit('preview:change', item);
	}
}
