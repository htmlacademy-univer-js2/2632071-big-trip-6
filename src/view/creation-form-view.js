import View from './view.js';
import { createPointFormTemplate } from './point-form-template.js';

export default class CreationFormView extends View {
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
}
