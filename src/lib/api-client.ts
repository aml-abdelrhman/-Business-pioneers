import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";

interface ErrorResponse {
  message: string;
  status: number;
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    if (!baseURL || !baseURL.trim()) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL is missing, using fallback");
    }

    this.axiosInstance = axios.create({
      baseURL: baseURL || "https://69c995fb68edf52c954e9caf.mockapi.io/api",
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": "ar",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          signOut();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }
}

const apiClient = new ApiClient();
export default apiClient;

// ***************
// import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
// import { signOut } from 'next-auth/react';
// import type { NextRequest } from 'next/server';

// interface ErrorResponse {
//   message: string;
//   status: number;
// }

// class ApiClient {
//   private axiosInstance: AxiosInstance;
//   private baseURL: string;

//   constructor() {
//     this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';

//     if (!this.baseURL) {
//       throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
//     }

//     this.axiosInstance = axios.create({
//       baseURL: this.baseURL,
//       timeout: 20000,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Accept-Language': 'ar'
//       },
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors(): void {
//     this.axiosInstance.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError<ErrorResponse>) => {
//         if (error.response?.status === 401) {
//           signOut();
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
//     const response = await this.axiosInstance.get<T>(endpoint, config);
//     return response.data;
//   }

//   async post<T>(endpoint: string, data?: any): Promise<T> {
//     const response = await this.axiosInstance.post<T>(endpoint, data);
//     return response.data;
//   }

//   async put<T>(endpoint: string, data?: any): Promise<T> {
//     const response = await this.axiosInstance.put<T>(endpoint, data);
//     return response.data;
//   }

//   async delete<T>(endpoint: string): Promise<T> {
//     const response = await this.axiosInstance.delete<T>(endpoint);
//     return response.data;
//   }
// }

// const apiClient = new ApiClient();
// export default apiClient;