import { message } from 'antd';
import axios from 'axios';
import { getEnv } from '@/utils/common';

export const API_ROOT = `https://xxx-service.${getEnv()}.baidu.com/`;

// 创建一个通用的axios客户端
const axiosInstance = axios.create({
  baseURL: API_ROOT,
  timeout: 15000,
  // 设置公共请求头
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json; charset=UTF-8',
  },
  validateStatus: (status) => status >= 200 && status < 400,
});

axiosInstance.interceptors.response.use(
  // 直接输出接口返回的数据
  (response) => response.data,
  (error) => {
    // 发生http错误，提示错误信息
    let msg;
    if (error) {
      if (Array.isArray(error.response?.data?.errors) && error.response.data.errors.length > 0) {
        msg = error.response.data.errors[0].message;
      } else if (error.response?.status === 401) {
        msg = '无权访问';
      } else {
        msg = error.response?.data?.message || error.response?.message || error.message;
      }
    }
    if (msg?.length > 60) msg = `${msg.substring(0, 60)}...`;
    message.error(msg || '接口出错了');
    return Promise.reject(error);
  },
);

// ======== 接口配置

export const getList = () => axiosInstance.get<void, string>('/hehe');
