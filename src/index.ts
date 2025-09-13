import './scss/styles.scss';

import { IProduct, IOrderForm, PaymentType } from './types';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/appData';
import { Modal } from './components/common/modal';
import { Basket } from './components/common/basket';
import { Success } from './components/common/success';
import { Card } from './components/card';
import { Contacts } from './components/contacts';
import { Order } from './components/order';
import { Page } from './components/page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { ShopAPI } from './components/shopAPI';
import { CDN_URL, API_URL } from './utils/constants';

const api = new ShopAPI(CDN_URL, API_URL);
const events = new EventEmitter();

//Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');

//Модель данных приложения
const appData = new AppState(events);

//Глобальные контейнеры
const page = new Page(document.body, events);
const basket = new Basket(events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
const modal = new Modal(modalTemplate, events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно
events.on('items:change', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// при изменении товаров в корзине
events.on('basket:change', () => {
	page.counter = appData.getAmountBasket();
	basket.items = appData.basket
		.map((id, index) => {
			const item = appData.store.find((product) => product.id === id);
			const card = new Card(cloneTemplate(cardBasketTemplate), {
				onClick: () => appData.removeFromBasket(item),
			});
			const element = card.render(item);
			const numberElement = element.querySelector('.basket__item-index');
			if (numberElement) {
				numberElement.textContent = (index + 1).toString();
			}
			return element;
		})
		.filter((el): el is HTMLElement => el !== null && el !== undefined); // исключаем null и undefined
	basket.total = appData.getTotalPriceBasket();
	basket.setCheckoutButtonEnabled(appData.getAmountBasket() > 0);
});

// Изменен открытый выбранный товар
events.on('preview:change', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.checkItemInBasket(item)) {
				appData.addToBasket(item);
				card.button = 'Удалить из корзины';
			} else {
				appData.removeFromBasket(item);
				card.button = 'В корзину';
			}
		},
	});
	// для корректного отображения кнопки при повторном открытии карточки
	if (item.price === null) {
		card.button = 'Недоступно';
	} else {
		card.button = appData.checkItemInBasket(item)
			? 'Удалить из корзины'
			: 'В корзину';
	}

	modal.render({ content: card.render(item) });
});

events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
	// сбрасываем выбор оплаты при закрытии заказа
	appData.setOrder('payment', '');
	orderForm.updatePaymentSelection('');
});

// Получаем товары с сервера
api
	.getProducts()
	.then(appData.setProducts.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// открытие формы заказа
events.on('order:open', () => {
	appData.clearOrder();
	modal.render({
		content: orderForm.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// отправка формы заказа
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// отправка формы контактов
events.on('contacts:submit', () => {
	api
		.makeOrder({
			...appData.order,
			items: appData.basket,
			total: appData.getTotalPriceBasket(),
		})
		.then((data) => {
			const success = new Success(cloneTemplate(successTemplate), events, {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render(),
			});
			success.total = data.total;
			appData.clearBasket();
			appData.clearOrder();
		})
		.catch(console.error);
});

// Изменилось одно из полей формы заказа
events.on(
	/^order\..*\:change$/,
	(data: { field: keyof IOrderForm; value: string }) => {
		if (data.field === 'payment') {
			appData.setOrder('payment', data.value as PaymentType);
			orderForm.updatePaymentSelection(appData.order.payment);
		} else {
			appData.setOrder(data.field, data.value);
		}
		appData.validateFormOrder();
	}
);

// Изменилось одно из полей формы контактов
events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrder(data.field, data.value);
		appData.validateFormContacts();
	}
);
// Изменилось состояние валидации формы заказа
events.on('orderFormErrors:change', (error: Partial<IOrderForm>) => {
	const { payment, address } = error;
	const formIsValid = !payment && !address;
	orderForm.valid = formIsValid;
	orderForm.errors = Object.values({ payment, address })
		.filter((msg) => !!msg)
		.join('; ');
});

// Изменилось состояние валидации формы контактов
events.on('contactsFormErrors:change', (error: Partial<IOrderForm>) => {
	const { email, phone } = error;
	const formIsValid = !email && !phone;
	contactsForm.valid = formIsValid;
	contactsForm.errors = Object.values({ email, phone })
		.filter((msg) => !!msg)
		.join('; ');
});
