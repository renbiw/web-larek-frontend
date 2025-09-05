import {Component} from "../base/component";
import {ensureElement} from "../../utils/utils";

interface ISuccess {
    total: number; // вывод общей суммы покупки
}

//для вывода модального окна об успешной покупки
interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        //this._close = ensureElement<HTMLElement>('.state__action', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}