import { View } from '../base/component';
import {
	cloneTemplate,
	createElement,
	ensureElement,
} from '../../utils/utils';
import { IEvents } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	price: number;
}

export class Basket extends View<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;
	static template = ensureElement<HTMLTemplateElement>('#basket');

	constructor(protected events: IEvents) {
		super(cloneTemplate(Basket.template), events);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(price: number) {
		this.setText(this._price, price + ' синапсов');
	}
}
