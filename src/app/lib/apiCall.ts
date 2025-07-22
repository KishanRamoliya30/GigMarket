import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  errors?: FieldError[];
  message?: string;
  data?: any;
  error?: string;
  ok: boolean;
  status: number;
}

export async function apiRequest<T>(
  url: string,
  options: AxiosRequestConfig = {},
  isToast: boolean = false
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios({
      url: `/api/${url}`,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      withCredentials: true,
      data: options.data,
      params: options.params,
    });

    const message = (response.data as { message: string }).message || "";
    if (isToast && message) {
      toast.success(message);
    }

    return {
      data: response.data,
      ok: true,
      success: true,
      status: response.status,
      message: (response.data as { message: string }).message || "",
    };
  } catch (error) {
    const axiosError = error as AxiosError<{
      error?: string;
      message?: string;
    }>;

    const errorText =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Network error. Please try again.";

    if (isToast && errorText) {
      toast.success(errorText);
    }

    return {
      error:
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Network error. Please try again.",
      ok: false,
      success: false,
      status: axiosError.response?.status || 0,
      message: axiosError.response?.data?.message || "",
    };
  }
}
