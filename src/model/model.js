import dayjs from 'dayjs';
import { createMockData } from './mock-data.js';

const FILTER_TYPES = [
  { type: 'everything', label: 'Everything' },
  { type: 'future', label: 'Future' },
  { type: 'present', label: 'Present' },
  { type: 'past', label: 'Past' },
];

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

export default class Model {
  constructor() {
    const mockData = createMockData();

    this.pointTypes = mockData.pointTypes;
    this.destinations = mockData.destinations;
    this.offers = mockData.offers;
    this.points = mockData.points;
  }

  getPoints() {
    return this.points;
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

  getFilters() {
    return FILTER_TYPES.map(({ type, label }) => {
      const count = getFilterCount(this.points, type);

      return {
        type,
        label,
        count,
        isChecked: type === 'everything',
        isDisabled: type !== 'everything' && count === 0,
      };
    });
  }

  getPointById(pointId) {
    return this.points.find((point) => point.id === pointId) ?? null;
  }

  updatePoint(updatedPoint) {
    this.points = this.points.map((point) => (point.id === updatedPoint.id ? updatedPoint : point));
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
