import dayjs from 'dayjs';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import CreationFormView from '../view/creation-form-view.js';
import PointPresenter from './point-presenter.js';
import UserAction from './user-action.js';
import { RenderPosition, render } from '../render.js';

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const EMPTY_LIST_MESSAGES = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now',
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

function createDefaultPoint(pointTypes, destinations) {
  const defaultDestination = destinations[0] ?? null;
  const defaultType = pointTypes.includes('flight') ? 'flight' : (pointTypes[0] ?? 'flight');
  const startDate = dayjs();
  const endDate = startDate.add(1, 'hour');

  return {
    id: `new-point-${Date.now()}`,
    type: defaultType,
    destinationId: defaultDestination?.id ?? '',
    offerIds: [],
    dateFrom: startDate.toISOString(),
    dateTo: endDate.toISOString(),
    basePrice: 0,
    isFavorite: false,
  };
}

export default class TripPresenter {
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #pointTypes = [];
  #destinations = [];
  #isCreationFormOpen = false;
  #creationFormComponent = null;
  #newEventButtonListenerAttached = false;

  constructor({ container, model, filterModel, filterPresenter }) {
    this.container = container;
    this.model = model;
    this.filterModel = filterModel;
    this.filterPresenter = filterPresenter;
    this.newEventButton = document.querySelector('.trip-main__event-add-btn');
  }

  init() {
    if (!this.#newEventButtonListenerAttached) {
      this.newEventButton.addEventListener('click', this.#handleNewPointClick);
      this.#newEventButtonListenerAttached = true;
    }

    this.#renderBoard();
  }

  handleFilterChange() {
    this.#currentSortType = SortType.DAY;
    this.#closeCreationForm();
    this.#resetPointPresenters();
    this.#renderBoard();
  }

  #handlePointDataChange = async (actionType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        await this.model.updatePoint(update);
        break;
      case UserAction.DELETE_POINT:
        await this.model.deletePoint(update.id);
        break;
      case UserAction.ADD_POINT:
        await this.model.addPoint(update);
        this.#isCreationFormOpen = false;
        break;
      default:
        return;
    }

    this.#renderBoard();
    this.filterPresenter.init();
  };

  #handlePointModeChange = () => {
    this.#resetPointPresenters();
    this.#closeCreationForm();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#renderBoard();
  };

  #handleNewPointClick = () => {
    if (this.#isCreationFormOpen) {
      return;
    }

    this.filterModel.setFilter('everything');
    this.#currentSortType = SortType.DAY;
    this.#isCreationFormOpen = true;
    this.#resetPointPresenters();
    this.#renderBoard();
    this.filterPresenter.init();
  };

  #handleCreationFormSubmit = async (event) => {
    event.preventDefault();

    const formData = this.#creationFormComponent.getFormData();

    if (!formData) {
      return;
    }

    this.#creationFormComponent.setSaving();

    try {
      await this.#handlePointDataChange(UserAction.ADD_POINT, formData.point);
    } catch {
      this.#creationFormComponent.setAborting();
    }
  };

  #handleCreationFormReset = (event) => {
    event.preventDefault();
    this.#isCreationFormOpen = false;
    this.#renderBoard();
  };

  #handleCreationFormRollupClick = () => {
    this.#isCreationFormOpen = false;
    this.#renderBoard();
  };

  #renderBoard() {
    const currentFilter = this.filterModel.getFilter();
    const points = this.model.getPoints(currentFilter);

    this.#clearBoard();

    this.#pointTypes = this.model.getPointTypes();
    this.#destinations = this.model.getDestinations();

    const sortOptions = [
      { type: SortType.DAY, label: 'Day', isChecked: this.#currentSortType === SortType.DAY, isDisabled: false },
      { type: SortType.EVENT, label: 'Event', isChecked: this.#currentSortType === SortType.EVENT, isDisabled: true },
      { type: SortType.TIME, label: 'Time', isChecked: this.#currentSortType === SortType.TIME, isDisabled: false },
      { type: SortType.PRICE, label: 'Price', isChecked: this.#currentSortType === SortType.PRICE, isDisabled: false },
      { type: SortType.OFFER, label: 'Offers', isChecked: this.#currentSortType === SortType.OFFER, isDisabled: true },
    ];

    if (points.length === 0 && !this.#isCreationFormOpen) {
      this.emptyListComponent = new EmptyListView({ message: this.#getEmptyMessage(currentFilter) });
      render(this.emptyListComponent, this.container);

      return;
    }

    this.sortComponent = new SortView({
      sortOptions,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.sortComponent, this.container);

    this.eventListComponent = new EventListView();
    render(this.eventListComponent, this.container);

    if (this.#isCreationFormOpen) {
      this.#renderCreationForm();
    }

    this.#renderPoints(this.#getSortedPoints(points));
  }

  #renderCreationForm() {
    const creationPoint = createDefaultPoint(this.#pointTypes, this.#destinations);
    const creationDestination = this.#destinations.find((destination) => destination.id === creationPoint.destinationId) ?? this.#destinations[0] ?? null;

    this.#creationFormComponent = new CreationFormView({
      point: creationPoint,
      destination: creationDestination,
      destinations: this.#destinations,
      offers: this.model.getOffers(),
      selectedOfferIds: creationPoint.offerIds,
      pointTypes: this.#pointTypes,
      onFormSubmit: this.#handleCreationFormSubmit,
      onFormReset: this.#handleCreationFormReset,
      onRollupClick: this.#handleCreationFormRollupClick,
    });

    render(this.#creationFormComponent, this.eventListComponent.getElement(), RenderPosition.AFTERBEGIN);
  }

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
    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        destination: this.model.getDestinationById(point.destinationId),
        offers: this.model.getOffersByIds(point.offerIds),
        editOffers: this.model.getOffers(),
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

  #closeCreationForm() {
    this.#isCreationFormOpen = false;

    if (this.#creationFormComponent) {
      this.#creationFormComponent.getElement().remove();
      this.#creationFormComponent = null;
    }
  }

  #clearBoard() {
    this.#pointPresenters.clear();
    this.sortComponent?.getElement().remove();
    this.eventListComponent?.getElement().remove();
    this.emptyListComponent?.getElement().remove();
    this.#creationFormComponent?.getElement().remove();
    this.sortComponent = null;
    this.eventListComponent = null;
    this.emptyListComponent = null;
    this.#creationFormComponent = null;
  }

  #getEmptyMessage(filterType) {
    return EMPTY_LIST_MESSAGES[filterType] ?? EMPTY_LIST_MESSAGES.everything;
  }
}
