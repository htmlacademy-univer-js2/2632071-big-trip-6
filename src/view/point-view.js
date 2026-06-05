import dayjs from 'dayjs';
import View from './view.js';

function capitalize(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value, format) {
  if (!value) {
    return '';
  }

  const date = dayjs(value);

  return date.isValid() ? date.format(format) : '';
}

function createPointTemplate(point, destination, offers) {
  const pointDate = formatDate(point?.dateFrom, 'MMM DD').toUpperCase();
  const startTime = formatDate(point?.dateFrom, 'HH:mm');
  const endTime = formatDate(point?.dateTo, 'HH:mm');
  const duration = point?.dateFrom && point?.dateTo && dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'minute');
  const favoriteClass = point?.isFavorite ? ' event__favorite-btn--active' : '';
  const selectedOffersMarkup = offers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>`).join('');

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${point?.dateFrom ?? ''}">${pointDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point?.type ?? 'flight'}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalize(point?.type)} ${destination?.city ?? ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${point?.dateFrom ?? ''}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${point?.dateTo ?? ''}">${endTime}</time>
          </p>
          <p class="event__duration">${Number.isFinite(duration) ? `${duration}M` : ''}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point?.basePrice ?? ''}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
${selectedOffersMarkup}
        </ul>
        <button class="event__favorite-btn${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends View {
  #favoriteClickHandler = null;

  #rollupClickHandler = null;

  #favoriteButtonListenerAttached = false;

  #rollupButtonListenerAttached = false;

  constructor({ point, destination, offers, onFavoriteClick = () => {}, onRollupClick = () => {} } = {}) {
    super();
    this.point = point;
    this.destination = destination;
    this.offers = offers ?? [];
    this.#favoriteClickHandler = onFavoriteClick;
    this.#rollupClickHandler = onRollupClick;
  }

  get template() {
    return createPointTemplate(this.point, this.destination, this.offers);
  }

  getElement() {
    const element = super.getElement();

    if (!this.#favoriteButtonListenerAttached) {
      element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
      this.#favoriteButtonListenerAttached = true;
    }

    if (!this.#rollupButtonListenerAttached) {
      element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
      this.#rollupButtonListenerAttached = true;
    }

    return element;
  }

  removeElement() {
    super.removeElement();
    this.#favoriteButtonListenerAttached = false;
    this.#rollupButtonListenerAttached = false;
  }
}
