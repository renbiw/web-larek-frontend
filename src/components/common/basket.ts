import {Component} from "../base/component";
import {cloneTemplate, createElement, ensureElement, formatNumber} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    price: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;
}