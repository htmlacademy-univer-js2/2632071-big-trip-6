import View from './view.js';

function createEmptyListTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyListView extends View {
  constructor({ message } = {}) {
    super();
    this.message = message ?? 'Click New Event to create your first point';
  }

  get template() {
    return createEmptyListTemplate(this.message);
  }
}
