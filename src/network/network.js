import Vue from "vue";
import axios from 'axios'

axios.defaults.baseURL = "http://172.21.8.67:8080/";

Vue.prototype.$http = axios;
