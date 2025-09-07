import { Component } from "./base/component";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card<T> extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLImageElement>('.card__price', container);
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

    // сеттер  для айди
    set id(value: string) {
		this.container.dataset.id = value;
	}

  //  get id(): string {
  //      return this.container.dataset.id || '';
  //  }

    // сеттер для заголовка
    set title(value: string) {
		this.setText(this._title, value);
	}

    //get title(): string {
    //    return this._title.textContent || '';
    //}

    // сеттер для цены
    set price(value: string) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}
    // сеттер для тега
    set category(value: string) {
      
    }

     // сеттер для описания
    set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
    // сеттер для картинки
    set image(value: string) {

    }
     
}