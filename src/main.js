import TripPresenter from './presenter/trip-presenter.js';

const tripEventsContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({ container: tripEventsContainer });

tripPresenter.init();