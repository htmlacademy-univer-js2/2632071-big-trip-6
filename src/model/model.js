import dayjs from 'dayjs';
import {
  adaptDestinationFromServer,
  adaptOffersFromServer,
  adaptPointFromServer,
  adaptPointToServer,
} from './adapters.js';

const FILTER_TYPES = [
  { type: 'everything', label: 'Everything' },
  { type: 'future', label: 'Future' },
  { type: 'present', label: 'Present' },
  { type: 'past', label: 'Past' },
];

const DEFAULT_FILTER = 'everything';

function getFilterCount(points, type) {
  if (type === 'everything') {
    return points.length;
  }

  const now = dayjs();

  return points.filter((point) => {
    const pointDate = dayjs(point.dateFrom);

    if (type === 'future') {
      return pointDate.isAfter(now, 'day');
    }

    if (type === 'present') {
      return pointDate.isSame(now, 'day');
    }

    return pointDate.isBefore(now, 'day');
  }).length;
}

function getFilteredPoints(points, filter) {
  if (filter === 'future') {
    return points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs(), 'day'));
  }

  if (filter === 'present') {
    return points.filter((point) => dayjs(point.dateFrom).isSame(dayjs(), 'day'));
  }

  if (filter === 'past') {
    return points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs(), 'day'));
  }

  return points;
}

export default class Model {
  #observers = [];
  #apiService = null;

  constructor(apiService) {
    this.#apiService = apiService;
    this.pointTypes = [];
    this.destinations = [];
    this.offers = [];
    this.points = [];
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notify() {
    this.#observers.forEach((observer) => observer());
  }

  async init() {
    const [points, destinations, offers] = await Promise.all([
      this.#apiService.getPoints(),
      this.#apiService.getDestinations().catch(() => []),
      this.#apiService.getOffers().catch(() => []),
    ]);

    this.points = points.map(adaptPointFromServer);
    this.destinations = destinations.map(adaptDestinationFromServer);
    this.offers = adaptOffersFromServer(offers);
    this.pointTypes = Array.from(new Set([
      ...this.points.map((point) => point.type),
      ...this.offers.map((offer) => offer.type),
    ]));
  }

  getPoints(filter = DEFAULT_FILTER) {
    return getFilteredPoints(this.points, filter);
  }

  getPointTypes() {
    return this.pointTypes;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getFilters(activeFilter = DEFAULT_FILTER) {
    return FILTER_TYPES.map(({ type, label }) => {
      const count = getFilterCount(this.points, type);

      return {
        type,
        label,
        count,
        isChecked: type === activeFilter,
        isDisabled: count === 0,
      };
    });
  }

  getPointById(pointId) {
    return this.points.find((point) => point.id === pointId) ?? null;
  }

  setPoints(points) {
    this.points = points;
    this.#notify();
  }

  async updatePoint(updatedPoint) {
    const response = await this.#apiService.updatePoint(updatedPoint.id, adaptPointToServer(updatedPoint));
    const adaptedPoint = adaptPointFromServer(response);
    this.setPoints(this.points.map((point) => (point.id === adaptedPoint.id ? adaptedPoint : point)));
    return adaptedPoint;
  }

  async addPoint(newPoint) {
    const response = await this.#apiService.createPoint(adaptPointToServer({
      ...newPoint,
      id: undefined,
    }));
    const adaptedPoint = adaptPointFromServer(response);

    this.setPoints([adaptedPoint, ...this.points]);

    return adaptedPoint;
  }

  async deletePoint(pointId) {
    await this.#apiService.deletePoint(pointId);
    this.setPoints(this.points.filter((point) => point.id !== pointId));
  }

  getDestinationById(destinationId) {
    return this.destinations.find((destination) => destination.id === destinationId) ?? null;
  }

  getOffersByIds(offerIds) {
    return this.offers.filter((offer) => offerIds.includes(offer.id));
  }

  getOffersByType(type) {
    return this.offers.filter((offer) => offer.type === type);
  }
}
