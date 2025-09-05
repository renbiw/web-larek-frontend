import { Component } from "./base/component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
    selected: boolean;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);
    }

    // сеттер и геттер для айди
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    // сеттер  и геттер для заголовка
    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    // сеттер для цены
    set price(value: number) {

    }
    // сеттер для тега
    set category(value: string) {
      
    }

    // сеттер для картинки
    set image(value: string) {

    }
     
}