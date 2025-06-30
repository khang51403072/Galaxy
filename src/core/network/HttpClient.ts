// core/network/HttpClient.ts
import axios, { AxiosInstance } from 'axios';
import { clearToken, getToken } from './AuthInterceptor';
import xlog from '../utils/xlog';

class HttpClient {
  private static instance: AxiosInstance;

  public static getInstance(): AxiosInstance {
    if (!HttpClient.instance) {
      HttpClient.instance = axios.create({
        baseURL: 'https://xsalonapi.prod.galaxyaccess.us/',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
        xsrfCookieName: undefined,
        xsrfHeaderName: undefined,
      });

      // Gắn interceptor auth
      HttpClient.instance.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token && config.url !== "/galaxy-me/authen") {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // delete config.xsrfCookieName;
        // delete config.xsrfHeaderName;
        xlog.info(`Request: ${config.method?.toUpperCase()} ${config.url}`, { tag: 'HTTP', extra: config });
        return config;
      });
      
      // Gắn interceptor lỗi
      HttpClient.instance.interceptors.response.use(
        async (res) => {
          xlog.info(`Response: ${res.config.method?.toUpperCase()} ${res.config.url}`, { tag: 'HTTP', extra: res.data });
          if(res.data.result === false && res.data.errorMsg !== null) {
            xlog.error(`API Error: ${res.data.errorMsg}`, { tag: 'HTTP', extra: res.data });
            throw new Error(res.data.errorMsg);
          } else {
            return res;
          }
        },
        async (error) => {
          xlog.error(`HTTP Error: ${error.message}`, { tag: 'HTTP', extra: error });
          if (error.response?.status === 401) {
            // TODO: refresh token ở đây nếu cần
            xlog.warn('Token expired', { tag: 'HTTP' });
            await clearToken();
            // redirect về login nếu cần
          }
          return Promise.reject(error);
        }
      );
    }

    return HttpClient.instance;
  }
}

export const httpClient = HttpClient.getInstance();
