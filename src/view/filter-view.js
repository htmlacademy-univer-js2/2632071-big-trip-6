import View from './view.js';

function createFilterTemplate(filters) {
  return (
    `<form class="trip-filters" action="#" method="get">
${filters.map((filter) => `      <div class="trip-filters__filter">
        <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}"${filter.isChecked ? ' checked' : ''}${filter.isDisabled ? ' disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.label}</label>
      </div>`).join('\n')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends View {
  constructor({ filters } = {}) {
    super();
    this.filters = filters ?? [];
  }

  get template() {
    return createFilterTemplate(this.filters);
  }
}
