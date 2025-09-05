import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    // При клике на корзину сгенерировать событие открытия корзины
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  // Обновить число товаров в счётчике корзины
  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  // Обновить DOM-контейнер каталога товарами
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  // Управление блокировкой страницы (например, при открытом модальном окне)
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}
