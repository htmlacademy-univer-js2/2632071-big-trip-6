import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../render.js';

export default class TripPresenter {
  filterComponent = null;

  sortComponent = null;

  eventListComponent = null;

  emptyListComponent = null;

  #pointPresenters = new Map();

  constructor({ container, model }) {
    this.container = container;
    this.model = model;
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  #handlePointDataChange = (updatedPoint) => {
    this.model.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id)?.updatePoint(updatedPoint);
  };

  #handlePointModeChange = () => {
    this.#resetPointPresenters();
  };

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

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        destination: this.model.getDestinationById(point.destinationId),
        offers: this.model.getOffersByIds(point.offerIds),
        editOffers: this.model.getOffersByType(point.type),
        destinations,
        pointTypes,
        container: this.eventListComponent.getElement(),
        onDataChange: this.#handlePointDataChange,
        onModeChange: this.#handlePointModeChange,
      });

      this.#pointPresenters.set(point.id, pointPresenter);
      pointPresenter.init();
    });
  }

  #resetPointPresenters() {
    this.#pointPresenters.forEach((pointPresenter) => {
      pointPresenter.resetView();
    });
  }
}
