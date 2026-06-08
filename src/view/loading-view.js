import View from './view.js';

function createLoadingTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class LoadingView extends View {
  get template() {
    return createLoadingTemplate();
  }
}
