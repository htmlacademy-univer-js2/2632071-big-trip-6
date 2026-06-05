import AbstractStatefulView from './abstract-stateful-view.js';
import { createPointFormTemplate } from './point-form-template.js';

export default class CreationFormView extends AbstractStatefulView {
  constructor({ point, destination, destinations, offers, selectedOfferIds, pointTypes } = {}) {
    super();
    this.point = point;
    this.destination = destination;
    this.destinations = destinations ?? [];
    this.offers = offers ?? [];
    this.selectedOfferIds = selectedOfferIds ?? [];
    this.pointTypes = pointTypes ?? [];
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
      resetLabel: 'Cancel',
      isCreation: true,
    });
  }

  _restoreHandlers() {
    this._element.querySelector('.event__input--destination').addEventListener('change', this.#handleDestinationChange);
    this._element.querySelectorAll('.event__type-input').forEach((input) => input.addEventListener('change', this.#handleTypeChange));
    this._element.querySelectorAll('.event__offer-checkbox').forEach((input) => input.addEventListener('change', this.#handleOfferChange));
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
