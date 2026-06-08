const DEFAULT_FILTER = 'everything';

export default class FilterModel {
  #filter = DEFAULT_FILTER;

  getFilter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
  }
}
