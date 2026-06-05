import View from './view.js';

function createSortTemplate(sortOptions) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${sortOptions.map((sortOption) => `      <div class="trip-sort__item  trip-sort__item--${sortOption.type}">
        <input id="sort-${sortOption.type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortOption.type}"${sortOption.isChecked ? ' checked' : ''}${sortOption.isDisabled ? ' disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${sortOption.type}">${sortOption.label}</label>
      </div>`).join('\n')}
    </form>`
  );
}

export default class SortView extends View {
  constructor({ sortOptions } = {}) {
    super();
    this.sortOptions = sortOptions ?? [];
  }

  get template() {
    return createSortTemplate(this.sortOptions);
  }
}
