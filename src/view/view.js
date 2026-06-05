import { createElement } from '../render.js';

export default class View {
  _element = null;

  get template() {
    throw new Error('Abstract method not implemented: template');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
