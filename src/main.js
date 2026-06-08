import Model from './model/model.js';
import FilterModel from './model/filter-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripEventsContainer = document.querySelector('.trip-events');
const tripFiltersContainer = document.querySelector('.trip-controls__filters');
const model = new Model();
const filterModel = new FilterModel();
const tripPresenterRef = {
  current: null,
};

const filterPresenter = new FilterPresenter({
  container: tripFiltersContainer,
  model,
  filterModel,
  onFilterChange: () => tripPresenterRef.current.handleFilterChange(),
});
const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  model,
  filterModel,
  filterPresenter,
});
tripPresenterRef.current = tripPresenter;

filterPresenter.init();
tripPresenter.init();
