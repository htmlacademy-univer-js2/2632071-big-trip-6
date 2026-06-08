import FilterView from '../view/filter-view.js';
import { render } from '../render.js';

export default class FilterPresenter {
  #container = null;
  #model = null;
  #filterModel = null;
  #onFilterChange = null;
  #filterComponent = null;

  constructor({ container, model, filterModel, onFilterChange = () => {} }) {
    this.#container = container;
    this.#model = model;
    this.#filterModel = filterModel;
    this.#onFilterChange = onFilterChange;
  }

  init() {
    const filters = this.#model.getFilters(this.#filterModel.getFilter());
    const nextFilterComponent = new FilterView({
      filters,
      onFilterChange: this.#handleFilterChange,
    });

    if (this.#filterComponent) {
      this.#filterComponent.getElement().replaceWith(nextFilterComponent.getElement());
      this.#filterComponent.removeElement();
      this.#filterComponent = nextFilterComponent;

      return;
    }

    this.#filterComponent = nextFilterComponent;
    render(this.#filterComponent, this.#container);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
    this.#onFilterChange(filterType);
  };
}
