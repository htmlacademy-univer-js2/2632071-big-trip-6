import View from './view.js';

function createSortTemplate(sortOptions) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${sortOptions.map((sortOption) => `      <div class="trip-sort__item  trip-sort__item--${sortOption.type}" data-sort-type="${sortOption.type}">
        <input id="sort-${sortOption.type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortOption.type}"${sortOption.isChecked ? ' checked' : ''}${sortOption.isDisabled ? ' disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${sortOption.type}">${sortOption.label}</label>
      </div>`).join('\n')}
    </form>`
  );
}

export default class SortView extends View {
  #sortTypeChangeHandler = null;
  #sortClickHandler = null;
  #listenerAttached = false;

  constructor({ sortOptions, onSortTypeChange = () => {} } = {}) {
    super();
    this.sortOptions = sortOptions ?? [];
    this.#sortTypeChangeHandler = onSortTypeChange;
    this.#sortClickHandler = this.#handleSortTypeClick;
  }

  get template() {
    return createSortTemplate(this.sortOptions);
  }

  getElement() {
    const element = super.getElement();

    if (!this.#listenerAttached) {
      element.addEventListener('click', this.#sortClickHandler);
      this.#listenerAttached = true;
    }

    return element;
  }

  #handleSortTypeClick = (event) => {
    const sortItem = event.target.closest('[data-sort-type]');

    if (!sortItem) {
      return;
    }

    const sortType = sortItem.dataset.sortType;
    const sortInput = sortItem.querySelector('.trip-sort__input');

    if (!sortType || sortInput?.disabled) {
      return;
    }

    this.#sortTypeChangeHandler(sortType);
  };
}
