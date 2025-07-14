import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

export interface FieldError { field: string; message: string };

export interface ApiResponse<T> {
  success: boolean;
  errors?: FieldError[];
  message?: string;
  data?: T;
  error?: string;
  ok: boolean;
  status: number;
}

export async function apiRequest<T = any>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios({
      url: `/api/${url}`,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      withCredentials: true,
      data: options.data,
      params: options.params,
    });

    return {
      data: response.data,
      ok: true,
      success: true,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;

    return {
      error:
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Network error. Please try again.',
      ok: false,
      success: false,
      status: axiosError.response?.status || 0,
    };
  }
}
