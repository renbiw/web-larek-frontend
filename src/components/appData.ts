import { Model } from './base/model';
import { IOrderForm, IProduct, FormErrors, PaymentType } from '../types';
import { EventEmitter, IEvents } from './base/events';

export class AppState {
	store: IProduct[] = [];
	basket: string[] = [];
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
		this.basket.push(product.id);
		this.events.emit('basket:change', this.basket);
	}

	removeFromBasket(product: IProduct): void {
		this.basket = this.basket.filter((id) => id !== product.id);
		this.events.emit('basket:change', this.basket);
	}

	clearBasket(): void {
		this.basket = [];
		this.events.emit('basket:change', this.basket);
	}

	checkItemInBasket(product: IProduct): boolean {
		return this.basket.includes(product.id);
	}

	getAmountBasket(): number {
		return this.basket.length;
	}

	getTotalPriceBasket(): number {
		return this.basket.reduce((sum, id) => {
			const product = this.store.find((p) => p.id === id);
			return sum + (product ? product.price : 0);
		}, 0);
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
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
	validateFormOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.address || this.order.address.trim() === '') {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
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
