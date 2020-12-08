import Vue from "vue";
import axios from 'axios'

axios.defaults.baseURL = "http://172.21.8.67:8080/";

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

Vue.prototype.$http = axios;
