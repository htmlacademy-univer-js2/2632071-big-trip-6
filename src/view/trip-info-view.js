import dayjs from 'dayjs';
import View from './view.js';

function createTripInfoTemplate({ title = '', start = '', end = '', total = 0 } = {}) {
  const dates = start && end ? `${start}&nbsp;&mdash;&nbsp;${end}` : '';

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends View {
  #data = null;

  constructor(data = {}) {
    super();
    this.#data = data;
  }

  get template() {
    const start = this.#data.startDate ? dayjs(this.#data.startDate).format('D MMM') : '';
    const end = this.#data.endDate ? dayjs(this.#data.endDate).format('D MMM') : '';
    return createTripInfoTemplate({ title: this.#data.title, start, end, total: this.#data.total });
  }

  update(data = {}) {
    this.#data = { ...this.#data, ...data };

    if (this._element) {
      const oldElement = this._element;
      this._element = null;
      const newElement = this.getElement();
      oldElement.replaceWith(newElement);
    }
  }
}
