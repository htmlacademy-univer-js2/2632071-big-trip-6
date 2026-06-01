import { createMockData } from './mock-data.js';

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

  getPointById(pointId) {
    return this.points.find((point) => point.id === pointId) ?? null;
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