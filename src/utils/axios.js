import axiosLib from "axios";
import authState from "../states/auth";
import userState from "../states/user";
import history from "../components/router/history";

const axios = axiosLib.create();
// axios.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    if(error?.response?.data?.code === 403 && error?.response?.data?.message === 'invalid token'){
       authState.setToken(null)
       userState.setUser(null)
        //reset local storage
        //return to login
        history.replace("/login")
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
  export default axios
  