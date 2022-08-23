const axios = require('axios').default;

class AxiosClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  getV1() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        ...this.getHeaders(),
        Accept: `application/vnd.bambuser.v1+json`
      }
    });
  }

  getV2() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        ...this.getHeaders(),
        Accept: `application/vnd.bambuser.v2+json`
      }
    });
  }
}

export default AxiosClient;
