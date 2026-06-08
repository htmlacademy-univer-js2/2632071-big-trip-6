import { createElement } from '../render.js';

const SHAKE_ANIMATION_DURATION = 600;
const SHAKE_ANIMATION_KEYFRAMES = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-5px)' },
  { transform: 'translateX(5px)' },
  { transform: 'translateX(-5px)' },
  { transform: 'translateX(5px)' },
  { transform: 'translateX(0)' },
];

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

  shake(callback = () => {}) {
    const element = this.getElement();

    if (typeof element.animate !== 'function') {
      callback();

      return;
    }

    const animation = element.animate(SHAKE_ANIMATION_KEYFRAMES, SHAKE_ANIMATION_DURATION);
    animation.addEventListener('finish', callback, { once: true });
  }
}
