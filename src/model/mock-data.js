const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const DESTINATIONS = [
  {
    id: 'destination-amsterdam',
    city: 'Amsterdam',
    description: 'Amsterdam is the Netherlands’ capital, known for its canals, museums, and cycling culture.',
    pictures: [
      'img/photos/1.jpg',
      'img/photos/2.jpg',
    ],
  },
  {
    id: 'destination-geneva',
    city: 'Geneva',
    description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman.',
    pictures: [
      'img/photos/3.jpg',
      'img/photos/4.jpg',
      'img/photos/5.jpg',
    ],
  },
  {
    id: 'destination-chamonix',
    city: 'Chamonix',
    description: 'Chamonix is a resort area at the base of Mont Blanc, popular for hiking and skiing.',
    pictures: [
      'img/photos/6.jpg',
      'img/photos/7.jpg',
    ],
  },
];

const OFFERS = [
  {
    id: 'offer-luggage',
    type: 'taxi',
    title: 'Add luggage',
    price: 30,
  },
  {
    id: 'offer-comfort',
    type: 'taxi',
    title: 'Switch to comfort class',
    price: 80,
  },
  {
    id: 'offer-meal',
    type: 'flight',
    title: 'Add meal',
    price: 15,
  },
  {
    id: 'offer-seats',
    type: 'flight',
    title: 'Choose seats',
    price: 5,
  },
  {
    id: 'offer-train',
    type: 'train',
    title: 'Travel by train',
    price: 40,
  },
];

const POINTS = [
  {
    id: 'point-1',
    type: 'taxi',
    destinationId: 'destination-amsterdam',
    offerIds: ['offer-luggage', 'offer-comfort'],
    dateFrom: '2019-03-18T10:30:00.000Z',
    dateTo: '2019-03-18T11:00:00.000Z',
    basePrice: 20,
    isFavorite: true,
  },
  {
    id: 'point-2',
    type: 'flight',
    destinationId: 'destination-geneva',
    offerIds: ['offer-meal', 'offer-seats'],
    dateFrom: '2019-03-19T12:25:00.000Z',
    dateTo: '2019-03-19T13:35:00.000Z',
    basePrice: 160,
    isFavorite: false,
  },
  {
    id: 'point-3',
    type: 'train',
    destinationId: 'destination-chamonix',
    offerIds: ['offer-train'],
    dateFrom: '2019-03-20T08:00:00.000Z',
    dateTo: '2019-03-20T11:15:00.000Z',
    basePrice: 80,
    isFavorite: false,
  },
];

function createMockData() {
  return {
    pointTypes: POINT_TYPES,
    destinations: DESTINATIONS,
    offers: OFFERS,
    points: POINTS,
  };
}

export { createMockData };