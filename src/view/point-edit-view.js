import AbstractStatefulView from './abstract-stateful-view.js';
import { createPointFormTemplate } from './point-form-template.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DATE_FORMAT = 'd/m/y H:i';

export default class PointEditView extends AbstractStatefulView {
  #submitHandler = null;
  #rollupClickHandler = null;
  #typeChangeHandler = null;
  #destinationChangeHandler = null;
  #offerChangeHandler = null;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor({ point, destination, destinations, offers, selectedOfferIds, pointTypes, onFormSubmit = () => {}, onRollupClick = () => {} } = {}) {
    super();
    this.point = point;
    this.destination = destination;
    this.destinations = destinations ?? [];
    this.offers = offers ?? [];
    this.selectedOfferIds = selectedOfferIds ?? [];
    this.pointTypes = pointTypes ?? [];
    this.#submitHandler = onFormSubmit;
    this.#rollupClickHandler = onRollupClick;
    this.#typeChangeHandler = this.#handleTypeChange;
    this.#destinationChangeHandler = this.#handleDestinationChange;
    this.#offerChangeHandler = this.#handleOfferChange;
  }

  get template() {
    return createPointFormTemplate({
      point: this.point,
      destination: this.destination,
      destinations: this.destinations,
      offers: this.offers,
      selectedOfferIds: this.selectedOfferIds,
      pointTypes: this.pointTypes,
      submitLabel: 'Save',
      resetLabel: 'Delete',
      isCreation: false,
    });
  }

  _restoreHandlers() {
    this._element.querySelector('form').addEventListener('submit', this.#submitHandler);
    this._element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this._element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this._element.querySelectorAll('.event__type-input').forEach((input) => input.addEventListener('change', this.#typeChangeHandler));
    this._element.querySelectorAll('.event__offer-checkbox').forEach((input) => input.addEventListener('change', this.#offerChangeHandler));

    this.#setDatepickers();
  }

  updateElement(update) {
    this.#destroyDatepickers();
    super.updateElement(update);
  }

  removeElement() {
    this.#destroyDatepickers();
    super.removeElement();
  }

  #handleTypeChange = (event) => {
    const nextType = event.target.value;

    this.point = {
      ...this.point,
      type: nextType,
    };
    this.selectedOfferIds = [];
    this.updateElement({
      point: this.point,
      selectedOfferIds: this.selectedOfferIds,
    });
  };

  #handleDestinationChange = (event) => {
    const nextDestination = this.destinations.find((destination) => destination.city === event.target.value) ?? null;

    this.destination = nextDestination;
    this.updateElement({
      destination: this.destination,
    });
  };

  #handleOfferChange = (event) => {
    const offerId = event.target.name.replace('event-offer-', '');

    this.selectedOfferIds = event.target.checked
      ? [...this.selectedOfferIds, offerId]
      : this.selectedOfferIds.filter((selectedOfferId) => selectedOfferId !== offerId);

    this.updateElement({
      selectedOfferIds: this.selectedOfferIds,
    });
  };

  #setDatepickers() {
    const startDateInput = this._element.querySelector('.event__input--time[name="event-start-time"]');
    const endDateInput = this._element.querySelector('.event__input--time[name="event-end-time"]');

    this.#startDatepicker = flatpickr(startDateInput, {
      dateFormat: DATE_FORMAT,
      defaultDate: this.point.dateFrom,
      enableTime: true,
      'time_24hr': true,
      allowInput: true,
    });

    this.#endDatepicker = flatpickr(endDateInput, {
      dateFormat: DATE_FORMAT,
      defaultDate: this.point.dateTo,
      enableTime: true,
      'time_24hr': true,
      allowInput: true,
    });
  }

  #destroyDatepickers() {
    this.#startDatepicker?.destroy();
    this.#endDatepicker?.destroy();
    this.#startDatepicker = null;
    this.#endDatepicker = null;
  }
}
