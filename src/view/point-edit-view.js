import AbstractStatefulView from './abstract-stateful-view.js';
import { createPointFormTemplate } from './point-form-template.js';
import flatpickr from 'flatpickr';

const DATE_FORMAT = 'd/m/y H:i';
const FormUiState = {
  IDLE: 'idle',
  SAVING: 'saving',
  DELETING: 'deleting',
};

export default class PointEditView extends AbstractStatefulView {
  #uiState = FormUiState.IDLE;
  #submitHandler = null;
  #rollupClickHandler = null;
  #typeChangeHandler = null;
  #destinationChangeHandler = null;
  #offerChangeHandler = null;
  #startDatepicker = null;
  #endDatepicker = null;
  #deleteHandler = null;

  constructor({ point, destination, destinations, offers, selectedOfferIds, pointTypes, onFormSubmit = () => {}, onFormDelete = () => {}, onRollupClick = () => {} } = {}) {
    super();
    this.point = point;
    this.destination = destination;
    this.destinations = destinations ?? [];
    this.offers = offers ?? [];
    this.selectedOfferIds = selectedOfferIds ?? [];
    this.pointTypes = pointTypes ?? [];
    this.#submitHandler = onFormSubmit;
    this.#deleteHandler = onFormDelete;
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
    this._element.querySelector('.event__reset-btn').addEventListener('click', this.#handleDeleteClick);
    this._element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this._element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this._element.querySelectorAll('.event__type-input').forEach((input) => input.addEventListener('change', this.#typeChangeHandler));
    this._element.querySelectorAll('.event__offer-checkbox').forEach((input) => input.addEventListener('change', this.#offerChangeHandler));

    this.#setDatepickers();
  }

  getFormData() {
    return this.#collectFormData();
  }

  updateElement(update) {
    this.#destroyDatepickers();
    super.updateElement(update);
  }

  removeElement() {
    this.#destroyDatepickers();
    super.removeElement();
  }

  setSaving() {
    this.#setUiState(FormUiState.SAVING);
  }

  setDeleting() {
    this.#setUiState(FormUiState.DELETING);
  }

  setAborting() {
    this.shake(() => {
      this.#setUiState(FormUiState.IDLE);
    });
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
    const destinationInput = event.target;
    destinationInput.setCustomValidity(nextDestination ? '' : 'Select a destination from the list');

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

  #handleDeleteClick = (event) => {
    event.preventDefault();
    this.#deleteHandler();
  };

  #collectFormData() {
    const selectedTypeInput = this._element.querySelector('input[name="event-type"]:checked');
    const destinationInput = this._element.querySelector('.event__input--destination');
    const priceInput = this._element.querySelector('.event__input--price');
    const destination = this.destinations.find((item) => item.city === destinationInput.value) ?? null;

    if (!destination) {
      destinationInput.setCustomValidity('Select a destination from the list');
      destinationInput.reportValidity();

      return null;
    }

    destinationInput.setCustomValidity('');

    return {
      point: {
        ...this.point,
        type: selectedTypeInput?.value ?? this.point.type,
        destinationId: destination.id,
        offerIds: Array.from(this._element.querySelectorAll('.event__offer-checkbox:checked')).map((input) => input.name.replace('event-offer-', '')),
        dateFrom: this.#startDatepicker?.selectedDates?.[0]?.toISOString() ?? this.point.dateFrom,
        dateTo: this.#endDatepicker?.selectedDates?.[0]?.toISOString() ?? this.point.dateTo,
        basePrice: priceInput.value === '' ? 0 : Number(priceInput.value),
        isFavorite: this.point.isFavorite ?? false,
      },
      destination,
    };
  }

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

  #setUiState(uiState) {
    this.#uiState = uiState;
    const formElement = this.getElement().querySelector('form');
    const saveButton = formElement.querySelector('.event__save-btn');
    const deleteButton = formElement.querySelector('.event__reset-btn');
    const isDisabled = this.#uiState !== FormUiState.IDLE;

    formElement.querySelectorAll('input, button').forEach((control) => {
      control.disabled = isDisabled;
    });

    saveButton.textContent = this.#uiState === FormUiState.SAVING ? 'Saving...' : 'Save';
    deleteButton.textContent = this.#uiState === FormUiState.DELETING ? 'Deleting...' : 'Delete';
  }
}
