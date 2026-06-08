function adaptPointFromServer(point) {
  return {
    id: point.id,
    type: point.type,
    destinationId: point.destination,
    offerIds: point.offers ?? [],
    dateFrom: point.date_from,
    dateTo: point.date_to,
    basePrice: point.base_price,
    isFavorite: point.is_favorite,
  };
}

function adaptPointToServer(point) {
  return {
    id: point.id,
    type: point.type,
    destination: point.destinationId,
    offers: point.offerIds ?? [],
    'date_from': point.dateFrom,
    'date_to': point.dateTo,
    'base_price': point.basePrice,
    'is_favorite': point.isFavorite,
  };
}

function adaptDestinationFromServer(destination) {
  return {
    id: destination.id,
    city: destination.name,
    description: destination.description ?? '',
    pictures: (destination.pictures ?? []).map((picture) => picture.src),
  };
}

function adaptOffersFromServer(offerGroups) {
  return offerGroups.flatMap((offerGroup) => (offerGroup.offers ?? []).map((offer) => ({
    id: offer.id,
    type: offerGroup.type,
    title: offer.title,
    price: offer.price,
  })));
}

export {
  adaptDestinationFromServer,
  adaptOffersFromServer,
  adaptPointFromServer,
  adaptPointToServer,
};
