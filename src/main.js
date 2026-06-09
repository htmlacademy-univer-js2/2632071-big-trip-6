import 'flatpickr/dist/flatpickr.min.css';
import Model from './model/model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './model/api-service.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import LoadingView from './view/loading-view.js';
import EmptyListView from './view/empty-list-view.js';
import { render } from './render.js';

const tripEventsContainer = document.querySelector('.trip-events');
const tripFiltersContainer = document.querySelector('.trip-controls__filters');
const authorization = Math.random().toString(36).slice(2);
const apiService = new ApiService('https://24.objects.htmlacademy.pro/big-trip/', authorization);
const model = new Model(apiService);
const filterModel = new FilterModel();
const tripPresenterRef = {
  current: null,
};
render(new LoadingView(), tripEventsContainer);

model.init()
  .then(() => {
    tripEventsContainer.innerHTML = '';

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
  })
  .catch(() => {
    tripEventsContainer.innerHTML = '';
    render(new EmptyListView({ message: 'Failed to load latest route information' }), tripEventsContainer);
  });
