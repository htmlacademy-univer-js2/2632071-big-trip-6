import { createElement } from '../render.js';

export default class View {
  #element = null;

  get template() {
    throw new Error('Abstract method not implemented: template');
  }
  
getElement() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
