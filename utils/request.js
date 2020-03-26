import axios from "axios";
import { MessageBox, Message,Notification} from "element-ui";
import store from "@/store";
import { getToken ,removeToken} from "@/utils/auth";
import { isObject } from "../utils/index.js";
import Router from "../router"

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token && getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["ADMIN-Authorization"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    return res;
    /*
    console.info(res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }*/
  },
  error => {
    if (axios.isCancel(error)) {
      //('Cancelled uploading by user.')
      return Promise.reject(error);
    }
    console.log("err" + error); // for debug
    const response = error.response;
    const status = response ? response.status : -1;

    console.log("服务器响应状态码", status);

    const data = response ? response.data : null; //获得异常的响应数据
    
    if (data) {
      var handled = false;
      console.log("服务器响应数据", data);
      if (data.status == 400) {
       
        const errorDetails = getFieldValidationError(data);
        console.info(errorDetails)
        if(errorDetails){
          handled = true;
          console.info(errorDetails)
          Notification.error({
            title:data.message,
            message: errorDetails.join(" "),
            duration :1000
          })
        }
      }else if(data.status === 401){
          console.info(store.getters.token)
          console.info("跳转登录页")
          if(getToken()){
            removeToken();
          }
         Router.push("/login")
      }
      if(!handled){

        Message.error(data.message)
      }

       
      

    }else{
      Message.error('网络异常')
    }
    /* Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })*/
    return Promise.reject(error);
  }
);

function toLoginRouter(){
  this.$router.push("/login")
}

function getFieldValidationError(data) {
  if (!isObject(data) || !isObject(data.data)) {
    return null;
  }
  const errorDetail = data.data
  return Object.keys(errorDetail).map(key => errorDetail[key])
}

export default service;
