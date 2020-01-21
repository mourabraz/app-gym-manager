import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

/*
 * add delay for all requests, only for development purposes
 */
api.interceptors.request.use(
  config => new Promise(resolve => setTimeout(_ => resolve(config), 1500))
);

export default api;
