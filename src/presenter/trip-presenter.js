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

  constructor({ container }) {
    this.container = container;
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(this.filterComponent, this.filterContainer);
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);
    render(new PointEditView(), this.eventListComponent.getElement());
    render(new CreationFormView(), this.eventListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}