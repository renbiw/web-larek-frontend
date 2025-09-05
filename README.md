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

Приложение по паттерну MVP
Model: За хранение данных (корзина, товары, заказ, ошибки) и состояний приложения отвечает класс AppState.

View:  Page, Order, Basket, Card - классы отображения, которые взаимодействуют с пользователем и получают данные от пользователя, обновляют DOM.

Presenter: EventEmitter реализует связь между Model и View, выступает посредником в передаче событий и обновлении данных.

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

интерфейс IOrder расширяет предыдущий класс, добавлены такие поля, как полная сумма покупки и список товаров: 
  items: [];
  total?: number;

интерфейс ICard описывает поля карточки товара в интерфейсе пользователя. Содержит следующие поля:
  id: string;
  title: string;
  description: string;
  image: string;
  category: CardCategory;
  price: number | null;
  selected: boolean;

интерфейс IAppState описывает поля и методы для работы с приложением, содержит поля для хранения товаров, заказов, корзины, ошибок при валидации форм. Имеет методы для работы с карточками товарами, корзиной и формами. 

интерфейс IShopAPI описывает методы для работы с API. Метод getProducts возвращает список товаров, 
метод getProduct возвращет товар по id, метод makeOrder отправляет данные из формы, заполненной пользователем, при совершении покупки.

интерфейс IPage содержит поля для работы с главной страницей:
  counter: number; // счетчик товаров для отображения в корзине
  catalog: HTMLElement[]; // элементы карточек
  locked: boolean; // проверка прокрутки страницы

интерфейс IBasketView  содержит поля:
  items: HTMLElement[];
  price: number;

*****
Компоненты модели данных
*****

класс Model - базовый абстрактный класс для всех моделей данных в приложении.
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }
    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object)
}

export class AppState extends Model<IAppState> {
  store: Product[] = [];
  basket: Product[] = [];
   order: IOrder = {
    payment: '',  
    address: '',
    email: '',
    phone: '',
    items: [],   
    total: null,   
  };
   formErrors: FormErrors = {};

  addToBasket(product: IProduct): void

  removeFromBasket(id: string): void 

  clearBasket(): void 

  getAmountBasket(): number

  getTotalPriceBasket(): number 

  setItems(): void 

  setOrder(field: keyof IOrder, value: string): void 

  validateFormContacts(): boolean 

  validateFormOrder(): boolean 

  clearOrder(): void

  setProducts(items: IProduct[]): 

  clearSelections(): void 
}

*****
Компоненты отображения 
*****

Базовый компонент
export abstract class Component<T> {
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

класс Card компонент карточки товара, содержит поля для данных карточки товара, сеттеры и геттеры для данных карточки

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);
    }
}

класс Basket отвечает за отображение и управление корзиной на пользовательском интерфейсе.
Отображение списка добавленных товаров, хранение общей стоимости товаров, управление кнопкой оформления заказа.

класс Order через сеттеры phone и email напрямую обновляет значения соответствующих полей формы в DOM, обеспечивает удобный доступ и управление данными формы.
export class Order extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string)
    set email(value: string)
}

класс Page компонент страницы магазина позволяет управлять состоянием страницы, её визуальными элементами и реакцией на взаимодействия пользователя.
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
    });
  }

  // Обновить число товаров в счётчике корзины
  set counter(value: number) 

  // Обновить DOM-контейнер каталога товарами
  set catalog(items: HTMLElement[]) 

  // Управление блокировкой страницы (например, при открытом модальном окне)
  set locked(value: boolean)
}



Presenter

роль презентера в проекте выполняет класс EventEmitter. Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.
Дополнительно реализованы методы onAll и offAll — для подписки на все события и сброса всех
подписчиков.
Интересным дополнением является метод trigger , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса EventEmitter.


Компоненты взаимодействуют через события в EventEmitter

Пример сценария:

при добавлении товара в Basket генерируется событие basket:add. Это событие подписывается компонентом Page, который обновляет счётчик. При клике на корзину на Page инициирует событие basket:open для открытия модального окна корзины. Каталог обновляется через событие с новым списком карточек.
