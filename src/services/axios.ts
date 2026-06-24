import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'access_token';

interface RefreshTokenResponse {
  accessToken: string;
}

const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
};

const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
};

const defaultAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRedirectingToLogin = false;

const clearAuthState = (options?: { notify?: boolean; message?: string }) => {
  removeToken();

  if (isRedirectingToLogin) return;
  isRedirectingToLogin = true;

  if (options?.notify && options.message) {
    console.error(options.message);
  }

  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};

export const handleRefreshToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post<AxiosResponse<RefreshTokenResponse>>(
      `${BASE_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    const accessToken = res.data?.data?.accessToken;
    if (accessToken) setToken(accessToken);
    return accessToken ?? null;
  } catch (error) {
    clearAuthState({ notify: true, message: 'Session expired. Please log in again.' });
    throw error;
  }
};

let pendingRefresh: Promise<string | null> | null = null;

const createResponseErrorHandler =
  (instance: AxiosInstance, retryFlagValue: boolean | null) =>
  async (error: { config: AxiosRequestConfig; response: AxiosResponse }) => {
    const config = error.config;
    const status = error.response?.status;
    const allowRetry = typeof config.headers?.get === 'function' && config.headers?.get('allowRetry');

    if (status === 401 && allowRetry) {
      if (!pendingRefresh) {
        pendingRefresh = handleRefreshToken().finally(() => {
          pendingRefresh = null;
        });
      }
      try {
        const token = await pendingRefresh;
        if (token && typeof config.headers?.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
          config.headers.set('allowRetry', retryFlagValue);
          return instance(config);
        }
      } catch {
        return Promise.reject(error);
      }
    }

    if (status === 403) {
      clearAuthState();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  };

defaultAxios.interceptors.request.use((config) => {
  const token = getToken();

  if (typeof config.headers?.set === 'function' && typeof config.headers?.get === 'function') {
    if (token) config.headers.set('Authorization', `Bearer ${token}`);

    if (!config.headers.get('allowRetry')) config.headers.set('allowRetry', true);
    else config.headers.set('allowRetry', false);
  }
  return config;
});

defaultAxios.interceptors.response.use(undefined, createResponseErrorHandler(defaultAxios, false));

const uploadAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

uploadAxios.interceptors.request.use((config) => {
  const token = getToken();

  if (typeof config.headers?.set === 'function' && typeof config.headers?.get === 'function') {
    if (token) config.headers.set('Authorization', `Bearer ${token}`);

    if (!config.headers.get('allowRetry')) config.headers.set('allowRetry', true);
    else config.headers.set('allowRetry', null);

    config.headers.set('Content-Type', 'multipart/form-data');
  }
  return config;
});

uploadAxios.interceptors.response.use(undefined, createResponseErrorHandler(uploadAxios, null));

export { defaultAxios, uploadAxios };

export default defaultAxios;
