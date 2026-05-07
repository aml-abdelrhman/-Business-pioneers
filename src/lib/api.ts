import apiClient from './api-client';
import { AxiosRequestConfig } from 'axios';

/**
 * Unified API interface compatible with your Axios ApiClient
 */
export const api = {
  /**
   * Fetch data with headers configuration (Simulating static/cached behavior)
   */
  static: async <T>(endpoint: string, revalidate = 5700, token?: string, lang = 'ar'): Promise<T> => {
    const config: AxiosRequestConfig = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Accept-Language': lang,
        // ملحوظة: Axios لا يدعم revalidate الخاص بـ Next.js fetch مباشرة 
        // لكننا نضعه كـ custom header إذا كان السيرفر يدعمه
        'X-Revalidate': revalidate.toString(),
      }
    };
    return apiClient.get<T>(endpoint, config);
  },

  /**
   * Fetch data without caching (Simulating dynamic behavior)
   */
  dynamic: async <T>(endpoint: string, token?: string, lang = 'ar'): Promise<T> => {
    const config: AxiosRequestConfig = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Accept-Language': lang,
        'Cache-Control': 'no-cache',
      }
    };
    return apiClient.get<T>(endpoint, config);
  },

  /**
   * Helper to handle endpoints that change based on auth status
   */
  getAuthenticatedData: async <T>(endpoint: string, token?: string, options = { revalidate: 5700, lang: 'ar' }): Promise<T> => {
    // إذا كان هناك توكن، نوجه الطلب لمسار المستخدم، وإلا للمسار العام
    const prefix = token ? 'user' : 'guest';
    const finalEndpoint = `${prefix}/${endpoint.replace(/^\//, '')}`;
    
    return api.static<T>(finalEndpoint, options.revalidate, token, options.lang);
  },

  /**
   * Helper to get authenticated data without cache
   */
  getAuthenticatedDynamicData: async <T>(endpoint: string, token?: string, lang = 'ar'): Promise<T> => {
    const prefix = token ? 'user' : 'guest';
    const finalEndpoint = `${prefix}/${endpoint.replace(/^\//, '')}`;

    return api.dynamic<T>(finalEndpoint, token, lang);
  },

  /**
   * Direct access to apiClient methods (get, post, put, delete)
   */
  request: {
    get: async <T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
      return apiClient.get<T>(endpoint, config);
    },
    post: async <T = any>(endpoint: string, data = {}, config: AxiosRequestConfig = {}): Promise<T> => {
      return apiClient.post<T>(endpoint, data); // apiClient.post في ملفك يستقبل باراميترين فقط
    },
    put: async <T = any>(endpoint: string, data = {}, config: AxiosRequestConfig = {}): Promise<T> => {
      return apiClient.put<T>(endpoint, data);
    },
    delete: async <T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
      return apiClient.delete<T>(endpoint);
    }
  }
};

export default api;


// import apiClient from './api-client';

// /**
//  * Unified API interface that provides consistent methods for data fetching
//  * This wrapper maintains compatibility with existing code while using the new centralized client
//  */
// export const api = {
//   /**
//    * Fetch data with caching (similar to the original api.static)
//    * @param endpoint API endpoint path
//    * @param revalidate Cache revalidation time in seconds
//    * @param token Optional authentication token
//    * @param lang Optional language code
//    */
//   static: async <T>(endpoint: string, revalidate = 5700, token?: string, lang = 'ar'): Promise<T> => {
//     return apiClient.fetchWithCache<T>(endpoint, { revalidate, lang }, token);
//   },

//   /**
//    * Fetch data without caching (similar to the original api.dynamic)
//    * @param endpoint API endpoint path
//    * @param token Optional authentication token
//    * @param lang Optional language code
//    */
//   dynamic: async <T>(endpoint: string, token?: string, lang = 'ar'): Promise<T> => {
//     return apiClient.fetchDynamic<T>(endpoint, token, lang);
//   },

//   /**
//    * Helper method to get data from an endpoint that requires authentication
//    * Automatically handles guest vs user routes
//    * @param endpoint Base endpoint path (without user/guest prefix)
//    * @param token Optional authentication token
//    * @param options Additional fetch options
//    */
//   getAuthenticatedData: async <T>(endpoint: string, token?: string, options = { revalidate: 5700, lang: 'ar' }): Promise<T> => {
//     const authenticatedEndpoint = apiClient.getAuthenticatedEndpoint(endpoint, token);
//     return apiClient.fetchWithCache<T>(authenticatedEndpoint, options, token);
//   },

//   /**
//    * Helper method to get data dynamically from an endpoint that requires authentication
//    * Automatically handles guest vs user routes
//    * @param endpoint Base endpoint path (without user/guest prefix)
//    * @param token Optional authentication token
//    * @param lang Optional language code
//    */
//   getAuthenticatedDynamicData: async <T>(endpoint: string, token?: string, lang = 'ar'): Promise<T> => {
//     const authenticatedEndpoint = apiClient.getAuthenticatedEndpoint(endpoint, token);
//     return apiClient.fetchDynamic<T>(authenticatedEndpoint, token, lang);
//   },

//   /**
//    * Direct access to the underlying axios instance for more complex requests
//    */
//   request: {
//     get: async <T = any>(endpoint: string, config = {}): Promise<T> => {
//       return apiClient.get(endpoint, config);
//     },
//     post: async <T = any>(endpoint: string, data = {}, config = {}): Promise<T> => {
//       return apiClient.post(endpoint, data, config);
//     },
//     put: async <T = any>(endpoint: string, data = {}, config = {}): Promise<T> => {
//       return apiClient.put(endpoint, data, config);
//     },
//     delete: async <T = any>(endpoint: string, config = {}): Promise<T> => {
//       return apiClient.delete(endpoint, config);
//     }
//   }
// };

// export default api;