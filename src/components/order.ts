import { Form } from './common/form';
import { IOrderForm, PaymentType } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _address: HTMLInputElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',
			this.container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',
			this.container
		);
		this._paymentCard.addEventListener('click', () => {
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'Онлайн',
			});
		});

		this._paymentCash.addEventListener('click', () => {
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'При получении',
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	updatePaymentSelection(payment: PaymentType): void {
		this.toggleClass(
			this._paymentCard,
			'button_alt-active',
			payment === 'Онлайн'
		);
		this.toggleClass(
			this._paymentCash,
			'button_alt-active',
			payment === 'При получении'
		);
	}
}
