export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    ok: boolean;
    status: number;
  }
  
  export async function apiRequest<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch("/api/"+url, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        credentials: "include",  
        ...options,
      });
  
      const contentType = res.headers.get("content-type");
      const body = contentType?.includes("application/json") ? await res.json() : null;
  
      return {
        data: res.ok ? body : undefined,
        error: !res.ok ? body?.error || "Something went wrong" : undefined,
        ok: res.ok,
        status: res.status,
      };
    } catch (err) {
      return {
        error: "Network error. Please try again.",
        ok: false,
        status: 0,
      };
    }
  }
  