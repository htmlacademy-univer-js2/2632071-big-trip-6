import { createElement } from '../render.js';
import View from './view.js';

export default class AbstractStatefulView extends View {
  getElement() {
    if (!this._element) {
      this._element = createElement(this.template);
      this._restoreHandlers();
    }

    return this._element;
  }

  updateElement(update) {
    if (!this._element) {
      Object.assign(this, update);

      return;
    }

    const previousElement = this._element;

    this._element = null;
    Object.assign(this, update);

    previousElement.replaceWith(this.getElement());
  }

  _restoreHandlers() {
    throw new Error('Abstract method not implemented: _restoreHandlers');
  }
}
