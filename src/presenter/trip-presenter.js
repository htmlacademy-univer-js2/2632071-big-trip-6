import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import CreationFormView from '../view/creation-form-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  filterComponent = new FilterView();
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor({ container, model }) {
    this.container = container;
    this.model = model;
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    const points = this.model.getPoints();
    const pointTypes = this.model.getPointTypes();
    const destinations = this.model.getDestinations();

    render(this.filterComponent, this.filterContainer);
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    const firstPoint = points[0] ?? null;
    const firstPointDestination = firstPoint ? this.model.getDestinationById(firstPoint.destinationId) : null;

    render(new PointEditView({
      point: firstPoint,
      destination: firstPointDestination,
      destinations,
      offers: firstPoint ? this.model.getOffersByType(firstPoint.type) : [],
      selectedOfferIds: firstPoint?.offerIds ?? [],
      pointTypes,
    }), this.eventListComponent.getElement());

    render(new CreationFormView({
      point: {
        type: pointTypes[0] ?? '',
        destinationId: '',
        offerIds: [],
        dateFrom: '',
        dateTo: '',
        basePrice: '',
      },
      destination: null,
      destinations,
      offers: pointTypes[0] ? this.model.getOffersByType(pointTypes[0]) : [],
      selectedOfferIds: [],
      pointTypes,
    }), this.eventListComponent.getElement());

    points.forEach((point) => {
      render(new PointView({
        point,
        destination: this.model.getDestinationById(point.destinationId),
        offers: this.model.getOffersByIds(point.offerIds),
      }), this.eventListComponent.getElement());
    });
  }
}