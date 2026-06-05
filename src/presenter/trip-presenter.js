import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../render.js';

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

function sortByDay(firstPoint, secondPoint) {
  return new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom);
}

function sortByTime(firstPoint, secondPoint) {
  const firstDuration = new Date(firstPoint.dateTo) - new Date(firstPoint.dateFrom);
  const secondDuration = new Date(secondPoint.dateTo) - new Date(secondPoint.dateFrom);

  return secondDuration - firstDuration;
}

function sortByPrice(firstPoint, secondPoint) {
  return secondPoint.basePrice - firstPoint.basePrice;
}

export default class TripPresenter {
  filterComponent = null;

  sortComponent = null;

  eventListComponent = null;

  emptyListComponent = null;

  #pointPresenters = new Map();

  #currentSortType = SortType.DAY;

  #pointTypes = [];

  #destinations = [];

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
    this.#pointTypes = this.model.getPointTypes();
    this.#destinations = this.model.getDestinations();
    const sortOptions = [
      { type: SortType.DAY, label: 'Day', isChecked: this.#currentSortType === SortType.DAY, isDisabled: false },
      { type: SortType.EVENT, label: 'Event', isChecked: this.#currentSortType === SortType.EVENT, isDisabled: true },
      { type: SortType.TIME, label: 'Time', isChecked: this.#currentSortType === SortType.TIME, isDisabled: false },
      { type: SortType.PRICE, label: 'Price', isChecked: this.#currentSortType === SortType.PRICE, isDisabled: false },
      { type: SortType.OFFER, label: 'Offers', isChecked: this.#currentSortType === SortType.OFFER, isDisabled: true },
    ];

    this.filterComponent = new FilterView({ filters });
    this.sortComponent = new SortView({
      sortOptions,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    this.eventListComponent = new EventListView();
    this.emptyListComponent = new EmptyListView();

    render(this.filterComponent, this.filterContainer);

    if (points.length === 0) {
      render(this.emptyListComponent, this.container);

      return;
    }

    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    this.#renderPoints(points);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#renderPoints(this.model.getPoints());
  };

  #getSortedPoints(points) {
    const sortedPoints = [...points];

    if (this.#currentSortType === SortType.TIME) {
      sortedPoints.sort(sortByTime);

      return sortedPoints;
    }

    if (this.#currentSortType === SortType.PRICE) {
      sortedPoints.sort(sortByPrice);

      return sortedPoints;
    }

    sortedPoints.sort(sortByDay);

    return sortedPoints;
  }

  #renderPoints(points) {
    const sortedPoints = this.#getSortedPoints(points);

    this.#resetPointPresenters();
    this.#pointPresenters = new Map();
    this.eventListComponent.getElement().innerHTML = '';

    sortedPoints.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        destination: this.model.getDestinationById(point.destinationId),
        offers: this.model.getOffersByIds(point.offerIds),
        editOffers: this.model.getOffersByType(point.type),
        destinations: this.#destinations,
        pointTypes: this.#pointTypes,
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
