import { View } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface ISuccess {
	total: number; // вывод общей суммы покупки
}

//для вывода модального окна об успешной покупки
interface ISuccessActions {
	onClick: () => void;
}

export class Success extends View<ISuccess> {
	protected _close: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(
		container: HTMLElement,
		events: IEvents,
		actions: ISuccessActions
	) {
		super(container, events);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
