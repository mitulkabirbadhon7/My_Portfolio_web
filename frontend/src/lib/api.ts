export interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  auth?: boolean;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Base URL already includes /api/v1 per docs/CONFIG.md contract
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = false, headers = {}, ...customConfig } = options;

  // Normalize endpoint so it starts with '/'
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (
    customConfig.body &&
    typeof customConfig.body === 'string' &&
    !requestHeaders['Content-Type']
  ) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...customConfig,
    headers: requestHeaders,
  };

  // Authenticated requests include HttpOnly cookies via credentials: "include"
  if (auth) {
    config.credentials = 'include';
  }

  const response = await fetch(url, config);

  let data: unknown;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
