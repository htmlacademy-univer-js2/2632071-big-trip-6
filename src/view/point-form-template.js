import dayjs from 'dayjs';

const EMPTY_POINT = {
  type: '',
  destinationId: '',
  offerIds: [],
  dateFrom: '',
  dateTo: '',
  basePrice: '',
};

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

function renderTypeOptions(pointTypes, currentType, idPrefix) {
  return pointTypes.map((type) => `
                <div class="event__type-item">
                  <input id="event-type-${type}-${idPrefix}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"${type === currentType ? ' checked' : ''}>
                  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${idPrefix}">${capitalize(type)}</label>
                </div>`).join('');
}

function renderDestinationOptions(destinations) {
  return destinations.map((destination) => `<option value="${destination.city}"></option>`).join('');
}

function renderAvailableOffers(offers, selectedOfferIds, idPrefix) {
  return offers.map((offer) => `
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${idPrefix}" type="checkbox" name="event-offer-${offer.id}"${selectedOfferIds.includes(offer.id) ? ' checked' : ''}>
                <label class="event__offer-label" for="event-offer-${offer.id}-${idPrefix}">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
                </label>
              </div>`).join('');
}

function renderDestinationPhotos(destination) {
  const pictures = destination?.pictures ?? [];

  if (!pictures.length) {
    return '';
  }

  return `
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${pictures.map((picture) => `<img class="event__photo" src="${picture}" alt="Event photo">`).join('')}
              </div>
            </div>`;
}

function createPointFormTemplate({
  point = EMPTY_POINT,
  destination = null,
  destinations = [],
  offers = [],
  selectedOfferIds = [],
  pointTypes = [],
  submitLabel,
  resetLabel,
  isCreation = false,
}) {
  const normalizedPoint = {
    ...EMPTY_POINT,
    ...point,
  };
  const formId = normalizedPoint.id ?? (isCreation ? 'new' : 'edit');
  const destinationValue = destination?.city ?? '';
  const typeLabel = capitalize(normalizedPoint.type);
  const startTime = formatDate(normalizedPoint.dateFrom, 'DD/MM/YY HH:mm');
  const endTime = formatDate(normalizedPoint.dateTo, 'DD/MM/YY HH:mm');

  return (`<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${formId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${normalizedPoint.type || 'flight'}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${formId}" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
${renderTypeOptions(pointTypes, normalizedPoint.type, formId)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${formId}">${typeLabel}</label>
            <input class="event__input  event__input--destination" id="event-destination-${formId}" type="text" name="event-destination" value="${destinationValue}" list="destination-list-${formId}">
            <datalist id="destination-list-${formId}">
${renderDestinationOptions(destinations)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${formId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${formId}" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${formId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${formId}" type="text" name="event-end-time" value="${endTime}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${formId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${formId}" type="text" name="event-price" value="${normalizedPoint.basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">${submitLabel}</button>
          <button class="event__reset-btn" type="reset">${resetLabel}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
${renderAvailableOffers(offers, selectedOfferIds, formId)}
            </div>
          </section>
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination?.description ?? ''}</p>
${renderDestinationPhotos(destination)}
          </section>
        </section>
      </form>
    </li>`);
}

export { EMPTY_POINT, createPointFormTemplate };
