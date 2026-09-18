// ============================================================================
// API Client — frontend/src/lib/api.ts
// ============================================================================
// Shared fetch wrapper that:
//   - Uses NEXT_PUBLIC_API_URL (already includes /api/v1)
//   - Normalizes trailing slashes (prevents /api/v1/api/v1 duplication)
//   - Sends HttpOnly cookies when { auth: true }
//   - Preserves FormData for multipart uploads (does NOT stringify)
//   - Standardizes errors via ApiError while preserving HTTP status codes
// ============================================================================

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
const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const BASE_URL = RAW_API_URL.replace(/\/+$/, '');

// ----------------------------------------------------------------------------
// Body preparation — critical for FormData / multipart uploads
// ----------------------------------------------------------------------------
const isFormData = (value: unknown): value is FormData => {
  return typeof FormData !== 'undefined' && value instanceof FormData;
};

const prepareBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined || body === null) return undefined;

  // ✅ Preserve FormData — let the browser set multipart/form-data + boundary
  if (isFormData(body)) return body;

  // Already a string / Blob / ArrayBuffer / URLSearchParams — pass through
  if (typeof body === 'string') return body;
  if (typeof Blob !== 'undefined' && body instanceof Blob) return body;
  if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) return body;
  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) return body;

  // Fallback: JSON stringify plain objects/arrays
  return JSON.stringify(body);
};

// ----------------------------------------------------------------------------
// Core request function
// ----------------------------------------------------------------------------
export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = false, headers = {}, ...customConfig } = options;

  // Normalize endpoint so it starts with '/'
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  // Build headers
  const requestHeaders: Record<string, string> = { ...headers };

  // Only set Content-Type: application/json if:
  //   - the body is a string (i.e., pre-stringified JSON), AND
  //   - no Content-Type was already provided, AND
  //   - the body is NOT FormData (which needs the browser to set the boundary)
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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[API Network Error] Request to ${url} failed:`, err);
    throw new ApiError(
      `Network connection error: Unable to connect to backend server at ${url} (${errorMsg})`,
      0,
      { url, originalError: errorMsg }
    );
  }

  // Parse response — JSON or text
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

  // Throw a typed error for non-2xx responses
  if (!response.ok) {
    const message =
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

// ----------------------------------------------------------------------------
// Convenience API object
// ----------------------------------------------------------------------------
export const api = {
  get: <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: prepareBody(body),
    }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: prepareBody(body),
    }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: prepareBody(body),
    }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};