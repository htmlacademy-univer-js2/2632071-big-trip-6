import AbstractStatefulView from './abstract-stateful-view.js';
import { createPointFormTemplate } from './point-form-template.js';

export default class PointEditView extends AbstractStatefulView {
  #submitHandler = null;
  #rollupClickHandler = null;
  #typeChangeHandler = null;
  #destinationChangeHandler = null;
  #offerChangeHandler = null;

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
}
