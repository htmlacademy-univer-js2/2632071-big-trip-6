import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  filterComponent = null;
  sortComponent = null;
  eventListComponent = null;
  emptyListComponent = null;
  #pointView = null;
  #pointEditView = null;
  #editKeyDownHandler = null;

  constructor({ container, model }) {
    this.container = container;
    this.model = model;
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  #handlePointClick = () => {
    this.#pointView.getElement().replaceWith(this.#pointEditView.getElement());
    document.addEventListener('keydown', this.#editKeyDownHandler);
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

  #closeEditForm() {
    this.#pointEditView.getElement().replaceWith(this.#pointView.getElement());
    document.removeEventListener('keydown', this.#editKeyDownHandler);
  }

  init() {
    const points = this.model.getPoints();
    const filters = this.model.getFilters();
    const pointTypes = this.model.getPointTypes();
    const destinations = this.model.getDestinations();
    const sortOptions = [
      { type: 'day', label: 'Day', isChecked: true, isDisabled: false },
      { type: 'event', label: 'Event', isChecked: false, isDisabled: true },
      { type: 'time', label: 'Time', isChecked: false, isDisabled: false },
      { type: 'price', label: 'Price', isChecked: false, isDisabled: false },
      { type: 'offer', label: 'Offers', isChecked: false, isDisabled: true },
    ];

    this.filterComponent = new FilterView({ filters });
    this.sortComponent = new SortView({ sortOptions });
    this.eventListComponent = new EventListView();
    this.emptyListComponent = new EmptyListView();

    render(this.filterComponent, this.filterContainer);

    if (points.length === 0) {
      render(this.emptyListComponent, this.container);

      return;
    }

    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    const firstPoint = points[0] ?? null;
    const firstPointDestination = firstPoint ? this.model.getDestinationById(firstPoint.destinationId) : null;

    if (firstPoint) {
      this.#editKeyDownHandler = this.#handleEditFormKeyDown;

      this.#pointView = new PointView({
        point: firstPoint,
        destination: firstPointDestination,
        offers: this.model.getOffersByIds(firstPoint.offerIds),
        onRollupClick: this.#handlePointClick,
      });

      this.#pointEditView = new PointEditView({
        point: firstPoint,
        destination: firstPointDestination,
        destinations,
        offers: this.model.getOffersByType(firstPoint.type),
        selectedOfferIds: firstPoint.offerIds,
        pointTypes,
        onFormSubmit: this.#handleFormSubmit,
        onRollupClick: this.#handleFormRollupClick,
      });

      render(this.#pointView, this.eventListComponent.getElement());
    }

    points.slice(1).forEach((point) => {
      render(new PointView({
        point,
        destination: this.model.getDestinationById(point.destinationId),
        offers: this.model.getOffersByIds(point.offerIds),
      }), this.eventListComponent.getElement());
    });
  }
}
