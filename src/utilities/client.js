import axios from 'axios';

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

  getInstance(version) {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        ...this.getHeaders(),
        Accept: `application/vnd.bambuser.${version}+json`
      }
    });
  }
}

export default AxiosClient;
