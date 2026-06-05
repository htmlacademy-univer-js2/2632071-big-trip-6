import View from './view.js';
import { createPointFormTemplate } from './point-form-template.js';

export default class PointEditView extends View {
  #submitHandler = null;
  #rollupClickHandler = null;
  #formListenerAttached = false;

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

  getElement() {
    const element = super.getElement();

    if (!this.#formListenerAttached) {
      const formElement = element.querySelector('form');
      formElement.addEventListener('submit', this.#submitHandler);
      element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
      this.#formListenerAttached = true;
    }

    return element;
  }

  removeElement() {
    super.removeElement();
    this.#formListenerAttached = false;
  }
}
