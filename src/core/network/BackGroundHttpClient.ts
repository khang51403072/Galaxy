import axios from 'axios';
import { ENV } from '../../config/environment';
import xlog from '../utils/xlog';
import { appConfig } from '@/shared/utils/appConfig';

import { getToken } from './AuthInterceptor'; 

const backgroundHttpClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Gắn interceptor request để thêm token (NẾU CÓ)
backgroundHttpClient.interceptors.request.use(async (config) => {
  // Logic này đủ đơn giản để chạy an toàn ở background
  const token = await getToken();
  config.headers["origin"] = "galaxyme-background";
  config.headers["deviceId"] = await appConfig.getPersistentDeviceId();
  config.headers["XSOFTS-SECRET-KEY"] = "qjqAqGHfyUkLnLmizi78A7EwxDMP6tCfzULDv6PKw7rbPSWpQcuABHAmTAXRzZEa";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  xlog.info(`Background Request: ${config.method?.toUpperCase()} ${config.url}`, { tag: 'HTTP_BG' });
  return config;
});

// Gắn interceptor response "câm"
backgroundHttpClient.interceptors.response.use(
  (res) => {
    xlog.info(`Background Response: ${res.config.method?.toUpperCase()} ${res.config.url}`, { tag: 'HTTP_BG' });
    return res;
  },
  (error) => {
    xlog.error(`Background HTTP Error: ${error.message}`, { tag: 'HTTP_BG' });
    // KHÔNG LÀM GÌ THÊM, ĐẶC BIỆT LÀ KHÔNG ĐIỀU HƯỚNG
    return Promise.reject(error);
  }
);

export { backgroundHttpClient };