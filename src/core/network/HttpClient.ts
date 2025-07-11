// core/network/HttpClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getToken } from './AuthInterceptor';
import xlog from '../utils/xlog';
import { getPersistentDeviceId } from '@/shared/utils/appConfig';

class HttpClient {
  private static instance: AxiosInstance;
  private static ongoingRequests = new Map<string, Promise<any>>();

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
        config.headers["origin"] = "galaxyme";
        config.headers["deviceId"] = await getPersistentDeviceId();
        config.headers["XSOFTS-SECRET-KEY"] = "qjqAqGHfyUkLnLmizi78A7EwxDMP6tCfzULDv6PKw7rbPSWpQcuABHAmTAXRzZEa";
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
           
            // redirect về login nếu cần
          }
          return Promise.reject(error);
        }
      );
    }

    return HttpClient.instance;
  }

  // Helper method để tạo unique key
  private static createRequestKey(method: string, url: string, data?: any, params?: any): string {
    const dataString = data ? JSON.stringify(data) : '';
    const paramsString = params ? JSON.stringify(params) : '';
    return `${method}:${url}:${dataString}:${paramsString}`;
  }

  // Wrapper methods với deduplication
  public static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const key = HttpClient.createRequestKey('GET', url, undefined, config?.params);
    
    if (HttpClient.ongoingRequests.has(key)) {
      xlog.info(`[HttpClient] Reusing GET request: ${key}`, { tag: 'DEDUPLICATION' });
      return HttpClient.ongoingRequests.get(key)!;
    }
    
    const promise = (HttpClient.getInstance().get(url, config) as Promise<T>)
      .finally(() => {
        HttpClient.ongoingRequests.delete(key);
      });
    
    HttpClient.ongoingRequests.set(key, promise);
    xlog.info(`[HttpClient] New GET request started: ${key}`, { tag: 'DEDUPLICATION' });
    return promise;
  }

  public static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const key = HttpClient.createRequestKey('POST', url, data, config?.params);
    
    if (HttpClient.ongoingRequests.has(key)) {
      xlog.info(`[HttpClient] Reusing POST request: ${key}`, { tag: 'DEDUPLICATION' });
      return HttpClient.ongoingRequests.get(key)!;
    }
    
    const promise = (HttpClient.getInstance().post(url, data, config) as Promise<T>)
      .finally(() => {
        HttpClient.ongoingRequests.delete(key);
      });
    
    HttpClient.ongoingRequests.set(key, promise);
    xlog.info(`[HttpClient] New POST request started: ${key}`, { tag: 'DEDUPLICATION' });
    return promise;
  }

  public static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const key = HttpClient.createRequestKey('PUT', url, data, config?.params);
    
    if (HttpClient.ongoingRequests.has(key)) {
      xlog.info(`[HttpClient] Reusing PUT request: ${key}`, { tag: 'DEDUPLICATION' });
      return HttpClient.ongoingRequests.get(key)!;
    }
    
    const promise = (HttpClient.getInstance().put(url, data, config) as Promise<T>)
      .finally(() => {
        HttpClient.ongoingRequests.delete(key);
      });
    
    HttpClient.ongoingRequests.set(key, promise);
    xlog.info(`[HttpClient] New PUT request started: ${key}`, { tag: 'DEDUPLICATION' });
    return promise;
  }

  public static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const key = HttpClient.createRequestKey('DELETE', url, undefined, config?.params);
    
    if (HttpClient.ongoingRequests.has(key)) {
      xlog.info(`[HttpClient] Reusing DELETE request: ${key}`, { tag: 'DEDUPLICATION' });
      return HttpClient.ongoingRequests.get(key)!;
    }
    
    const promise = (HttpClient.getInstance().delete(url, config) as Promise<T>)
      .finally(() => {
        HttpClient.ongoingRequests.delete(key);
      });
    
    HttpClient.ongoingRequests.set(key, promise);
    xlog.info(`[HttpClient] New DELETE request started: ${key}`, { tag: 'DEDUPLICATION' });
    return promise;
  }

  public static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const key = HttpClient.createRequestKey('PATCH', url, data, config?.params);
    
    if (HttpClient.ongoingRequests.has(key)) {
      xlog.info(`[HttpClient] Reusing PATCH request: ${key}`, { tag: 'DEDUPLICATION' });
      return HttpClient.ongoingRequests.get(key)!;
    }
    
    const promise = (HttpClient.getInstance().patch(url, data, config) as Promise<T>)
      .finally(() => {
        HttpClient.ongoingRequests.delete(key);
      });
    
    HttpClient.ongoingRequests.set(key, promise);
    xlog.info(`[HttpClient] New PATCH request started: ${key}`, { tag: 'DEDUPLICATION' });
    return promise;
  }

  // Utility methods để quản lý deduplication
  public static getActiveRequestsCount(): number {
    return HttpClient.ongoingRequests.size;
  }

  public static getActiveRequestKeys(): string[] {
    return Array.from(HttpClient.ongoingRequests.keys());
  }

  public static cancelRequest(key: string): boolean {
    if (HttpClient.ongoingRequests.has(key)) {
      HttpClient.ongoingRequests.delete(key);
      xlog.info(`[HttpClient] Request cancelled: ${key}`, { tag: 'DEDUPLICATION' });
      return true;
    }
    return false;
  }

  public static cancelAllRequests(): void {
    const count = HttpClient.ongoingRequests.size;
    HttpClient.ongoingRequests.clear();
    xlog.info(`[HttpClient] All ${count} requests cancelled`, { tag: 'DEDUPLICATION' });
  }
}

// Export instance cũ (backward compatibility)
export const httpClient = HttpClient.getInstance();

// Export wrapper methods với deduplication
export const httpClientWithDeduplication = {
  get: HttpClient.get.bind(HttpClient),
  post: HttpClient.post.bind(HttpClient),
  put: HttpClient.put.bind(HttpClient),
  delete: HttpClient.delete.bind(HttpClient),
  patch: HttpClient.patch.bind(HttpClient),
  // Utility methods
  getActiveRequestsCount: HttpClient.getActiveRequestsCount.bind(HttpClient),
  getActiveRequestKeys: HttpClient.getActiveRequestKeys.bind(HttpClient),
  cancelRequest: HttpClient.cancelRequest.bind(HttpClient),
  cancelAllRequests: HttpClient.cancelAllRequests.bind(HttpClient),
  // Original instance for advanced usage
  instance: httpClient,
};
