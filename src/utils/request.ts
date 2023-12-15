import axios from 'axios';
import axiosRetry from 'axios-retry';
import {type AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import { getToken } from '@/utils/auth'
import { tansParams } from '@/utils'
import cache from '@/plugins/cache'
const whiteRetry = new Set(['ECONNABORTED', undefined, 0]);

// 创建 axios 请求实例
const serviceAxios = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API, // 接口请求地址
    timeout: 15 * 1000, // 请求超时设置
    withCredentials: false, // 跨域请求是否需要携带 cookie
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    validateStatus() {
      // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
      return true;
    }
});

// 请求拦截器
serviceAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url;                // 请求地址
        const s_data = sessionObj.data;              // 请求数据
        const s_time = sessionObj.time;              // 请求时间
        const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    
    return config;
  },
  (err: AxiosError) => {
    console.log('全局请求拦截器: 处理请求错误',err);
    return Promise.reject(err);
  }
);

// 响应拦截器
serviceAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('全局响应拦截器: 成功');
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const msg = response.data.msg;
    // 二进制数据则直接返回
    if (response.request.responseType ===  'blob' || response.request.responseType ===  'arraybuffer') {
      return response.data
    }
    if (code === 401) {
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      // ...
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      // ...
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      // ...
      return Promise.reject('error')
    } else {
      return  Promise.resolve(response.data)
    }
  },
  (err: AxiosError) => {
    console.log('全局响应拦截器: 处理响应错误',err);
    let { message } = err;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    return Promise.reject(err);
  }
);

axiosRetry(serviceAxios, {
  retries: 2, // 重复请求次数
  shouldResetTimeout: true, //  重置超时时间
  retryDelay: (retryCount) => {
    return retryCount * 10000; // 重复请求延迟
  },
  retryCondition: (err) => {
    // true为打开自动发送请求，false为关闭自动发送请求
    const {code, message} = err;
    return whiteRetry.has(<string>code) || message.includes('timeout');
  }
});

// 统一发起请求的函数
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    return service(config);
  };
}

export default createRequest(serviceAxios);
