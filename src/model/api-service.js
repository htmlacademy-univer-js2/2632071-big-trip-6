const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  async getPoints() {
    return this.#load('points');
  }

  async getDestinations() {
    return this.#load('destinations');
  }

  async getOffers() {
    return this.#load('offers');
  }

  async createPoint(point) {
    return this.#load('points', {
      method: HTTP_METHOD.POST,
      body: JSON.stringify(point),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async updatePoint(pointId, point) {
    return this.#load(`points/${pointId}`, {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify(point),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deletePoint(pointId) {
    return this.#load(`points/${pointId}`, {
      method: HTTP_METHOD.DELETE,
    });
  }

  async #load(path, options = {}) {
  const response = await fetch(new URL(path, this.#endPoint), {
    method: HTTP_METHOD.GET,
    ...options,
    headers: {
      Authorization: `Basic ${this.#authorization}`,
      ...options.headers,
    },
  });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }
}
