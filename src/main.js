import Model from './model/model.js';
import TripPresenter from './presenter/trip-presenter.js';

const tripEventsContainer = document.querySelector('.trip-events');
const model = new Model();
const tripPresenter = new TripPresenter({ container: tripEventsContainer, model });

tripPresenter.init();