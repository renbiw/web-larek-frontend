# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

Используется паттерн MVP
Model: За хранение данных (корзина, товары, заказ, ошибки) и состояний приложения отвечает класс AppState.

View:  Page, Order, Contacts, Basket, Card, Modal, Form - классы отображения, которые взаимодействуют с пользователем и получают данные от пользователя, обновляют DOM.

Presenter: в данном проекте презентер будет реализован в файле index.ts. Он использует брокер событий (EventEmitter), который отслеживает и распространяет события между компонентами. За счет подписки на события и обработки входящих сообщений презентер реагирует на изменения данных или действий пользователя, актуализирует состояние модели и обновляет представление.

*****
Типы данных
*****

тип FormErrors - тип объекта ошибок

интерфейс IProduct описывает данные товара, приходящие с сервера и содержит следующие поля:
  id: string; 
  description: string;
  image: string;
  title: string;
  category: string;
  price: number| null;

интерфейс IOrderForm описывает часть данных, связанную с контактной информацией, необходим для валидации:
  payment: 'Онлайн' | 'При получении';
  address: string;
  email: string;
  phone: string;

интерфейс IBasket содержит данные корзины, которые необходимы для оформления заказа - id массива товаров в корзине и общую стоимость товаров.
  items: []; 
  total: number;


интерфейс IShopAPI описывает методы для работы с API. Метод getProducts возвращает список товаров, 
метод getProduct возвращет товар по id, метод makeOrder отправляет данные из формы, заполненной пользователем, при совершении покупки.

интерфейс IPage содержит поля для работы с главной страницей:
  counter: number; // счетчик товаров для отображения в корзине
  catalog: HTMLElement[]; // элементы карточек
  locked: boolean; // проверка прокрутки страницы

интерфейс IBasketView  содержит поля:
  items: HTMLElement[]; // массив html элементов, представленных в корзине для отображения 
  price: number; // значение стоимость товара 

*****
Компоненты модели данных
*****

класс Model - базовый абстрактный класс для всех моделей данных в приложении.
abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }
    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object)
}

класс AppState отвечает за хранение и управление основными данными приложения, включая каталог товаров, текущий просмотренный товар, корзину, данные заказа и ошибки форм. Также он осуществляет оповещение через события при изменении данных.

class AppState
{ 
  store: Product[] = []; // массив товаров каталога. хранит список всех доступных товаров.
  basket: IBasket = { // объект корзины, содержащий:
		items: [], // массив ID товаров, добавленных в корзину.
		total: 0 // общая сумма стоимости товаров в корзине.
	};
   order: IOrderForm = { // объект с данными текущего оформления заказа:
    payment: '',   // способ оплаты
    address: '',  // адрес 
    email: '', // электронная почта
    phone: '' // номер телефона
  };
   formErrors: FormErrors = {}; // объект с сообщениями об ошибках валидации полей формы заказа

  addToBasket(product: IProduct): void //добавить в корзину

  removeFromBasket(id: string): void  // удалить из корзины 

  clearBasket(): void // очистить корзину

  getAmountBasket(): number // получить кол-во товаров в корзин

  getTotalPriceBasket(): number // получить общую сумму товаров в корзине 

  setOrder(field: keyof IOrder, value: string): void // обновить поле заказа

  validateFormContacts(): boolean // валидация формы контактов 

  validateFormOrder(): boolean // валидация формы заказа 

  clearOrder(): void //очистить заказ

  setProducts(items: IProduct[]): // преобразование данных из api

  clearSelections(): void // сбросить выбранные товары после завершения покупки
 }

*****
Компоненты отображения 
*****

Базовый компонент
abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) 

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean)

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) 

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) 

    // Скрыть
    protected setHidden(element: HTMLElement) 

    // Показать
    protected setVisible(element: HTMLElement) 

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string)

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement 
}

Класс Card представляет собой компонент пользовательского интерфейса для отображения карточки товара с различными атрибутами и действиями. связывает данные товара с DOM-элементами, управляет их отображением и пользовательскими событиями. Имеет сеттеры для данных карточки.

class Card<T> extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description: HTMLElement;
    constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);}


    set id(value: string) 
    set title(value: string)
    set price(value: string) 
    set category(value: string) 
    set description(value: string) 
    set button(value: string) 
    set image(value: string)
}

класс Basket отвечает за отображение и управление корзиной на пользовательском интерфейсе. 
Отображение списка добавленных товаров, хранение общей стоимости товаров, управление кнопкой оформления заказа
class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;
  constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__action');
  }
  set items(items: HTMLElement[])
  set total(price: number)
}

Класс Form представляет собой компонент пользовательского интерфейса для работы с HTML-формой, обеспечивает управление состоянием формы, её валидацией и событиями взаимодействия. Интерфейс IFormState содержит два поля: valid: boolean - флаг, указывающий, является ли текущие данные формы валидными, errors: string[] массив строк, содержащий сообщения об ошибках валидации или другие проблемы, связанные с данными формы.
class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
    }
}


Класс Modal — компонент пользовательского интерфейса, реализующий модальное окно. отвечает за отображение и скрытие модального окна, обработку взаимодействий с пользователем и уведомление приложения о своих изменениях через события. Содержит методы открыти, закрытия модального окна, а так же метод render для обновления данных. Интерфейс IModalData содержит поле content: HTMLElement - представляет содержимое, которое должно быть показано внутри модального окна.
export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement; // элемент кнопки закрытия 
    protected _content: HTMLElement; // контейнер для содержимого модального окна

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    set content(value: HTMLElement) 
    open() 
    close()
    render(data: IModalData): HTMLElement
}

класс Order управляет формой заказа, реализует методы для обновления значений способа оплаты и адреса. содержит свойства-сеттеры payment и address, которые позволяют устанавливать значения соответствующих полей формы.
class Order extends Form<IOrderForm> {
    protected _paymentCard: HTMLButtonElement;
		protected _paymentCash: HTMLButtonElement;
		protected _address: HTMLInputElement;
    constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
    set payment(value: string)

    set address(value: string)
}

класс Contacts управляет формой контактов пользователя, реализует методы для обновления значений email и телефона. содержит свойства-сеттеры phone и email, которые позволяют устанавливать значения соответствующих полей формы.
class Contacts extends Form<IOrderForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string)
  set email(value: string)
}

класс Page компонент страницы магазина позволяет управлять состоянием страницы, её визуальными элементами и реакцией на взаимодействия пользователя.
class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
  }

  // Обновить число товаров в счётчике корзины
  set counter(value: number) 

  // Обновить DOM-контейнер каталога товарами
  set catalog(items: HTMLElement[]) 

  // Управление блокировкой страницы (например, при открытом модальном окне)
  set locked(value: boolean)
}



Presenter

в данном проекте презентер будет реализован в файле index.ts. Он использует брокер событий (EventEmitter), который отслеживает и распространяет события между компонентами. За счет подписки на события и обработки входящих сообщений презентер реагирует на изменения данных или действий пользователя, актуализирует состояние модели и обновляет представление.

Класс EventEmitter 

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события. Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.
Дополнительно реализованы методы onAll и offAll — для подписки на все события и сброса всех
подписчиков.
Интересным дополнением является метод trigger , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса EventEmitter.

События приложения

Приложение реализует взаимодействие компонентов через брокер событий (EventEmitter). Ниже перечислены основные события, отражающие ключевые действия и изменения состояния на различных страницах.


items:change — обновление каталога товаров.

card:select — выбор карточки в каталоге 

basket:open — открытие модального окна корзины товаров

basket:add — добавление товара в корзину (клик на кнопку "Купить")

basket:remove — удаление товара из корзины (клик на кнопку "Удалить")

basket:change — изменение списка товаров в корзине 

modal:open — открытие любого модального окна

modal:close — закрытие любого модального окна по клику на оверлей или на кнопку "Закрыть"

order:submit - клик на кнопку "Далее" в модальном окне с выбором оплаты и адресом 

contacts:submit - клик на кнопку "Оплатить" в модальном окне с вводом адреса и e-mail

orderFormErrors:change - инициируется при вводе данных в инпут формы заказа

contactsFormErrors:change - инициируется при вводы данных в инпут формы с контактными данными



Пример сценария:

при добавлении товара в Basket генерируется событие basket:add. Это событие обрабатывается презентером, презентер получает обновленные данные состояния приложения из модели appState, а затем обновляет счётчик товаров на странице через свойство page.counter, отображая текущее количество товаров из корзины.
