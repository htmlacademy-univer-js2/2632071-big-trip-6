import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render } from '../render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #destination = null;
  #offers = null;
  #editOffers = null;
  #destinations = null;
  #pointTypes = null;
  #container = null;
  #onDataChange = null;
  #onModeChange = null;
  #pointView = null;
  #pointEditView = null;
  #mode = Mode.DEFAULT;
  #editKeyDownHandler = null;

  constructor({ point, destination, offers, editOffers, destinations, pointTypes, container, onDataChange = () => {}, onModeChange = () => {} }) {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers ?? [];
    this.#editOffers = editOffers ?? [];
    this.#destinations = destinations ?? [];
    this.#pointTypes = pointTypes ?? [];
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#editKeyDownHandler = this.#handleEditFormKeyDown;
  }

  init() {
    this.#pointView = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onFavoriteClick: this.#handleFavoriteClick,
      onRollupClick: this.#handlePointClick,
    });

    this.#pointEditView = new PointEditView({
      point: this.#point,
      destination: this.#destination,
      destinations: this.#destinations,
      offers: this.#editOffers,
      selectedOfferIds: this.#point.offerIds,
      pointTypes: this.#pointTypes,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleFormRollupClick,
    });

    render(this.#pointView, this.#container);
  }

  resetView() {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    this.#closeEditForm();
  }

  updatePoint(updatedPoint) {
    this.#point = updatedPoint;

    const prevPointViewElement = this.#pointView.getElement();
    this.#pointView.removeElement();
    this.#pointView = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onFavoriteClick: this.#handleFavoriteClick,
      onRollupClick: this.#handlePointClick,
    });

    if (this.#mode === Mode.DEFAULT) {
      prevPointViewElement.replaceWith(this.#pointView.getElement());
    }
  }

  #handlePointClick = () => {
    this.#onModeChange();
    this.#replacePointViewWithEditView();
    document.addEventListener('keydown', this.#editKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  #handleFavoriteClick = () => {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    };

    this.#onDataChange(updatedPoint);
  };

  #handleFormSubmit = (event) => {
    event.preventDefault();
    this.#closeEditForm();
  };

  #handleFormRollupClick = () => {
    this.#closeEditForm();
  };

  #handleEditFormKeyDown = (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    this.#closeEditForm();
  };

  #replacePointViewWithEditView() {
    this.#pointView.getElement().replaceWith(this.#pointEditView.getElement());
  }

  #closeEditForm() {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    this.#pointEditView.getElement().replaceWith(this.#pointView.getElement());
    document.removeEventListener('keydown', this.#editKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }
}
