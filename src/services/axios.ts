import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { LOCAL_STORAGE_KEYS, localStorageService } from '../utils/localStorage'

const BASE_URL = import.meta.env.VITE_API_URL

interface RefreshTokenResponse {
  access_token: string
}

// Every successful backend response is wrapped as { success, statusCode, data, timestamp, requestId }.
// Unwrap it here so callers can treat `response.data` as the actual payload.
const unwrapEnvelope = (response: AxiosResponse) => {
  const body = response.data as unknown
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    response.data = (body as { data: unknown }).data
  }
  return response
}

// The access token lives in memory only — never in localStorage/sessionStorage — so a persistent
// XSS payload cannot read it back out after the tab closes. Session continuity across page loads
// is restored via the httpOnly refresh_token cookie (see bootstrapAuth below).
let accessToken: string | null = null
const tokenListeners = new Set<() => void>()

export const getAccessToken = (): string | null => accessToken

const setAccessTokenInternal = (token: string | null): void => {
  accessToken = token
  tokenListeners.forEach((listener) => listener())
}

export const setAccessToken = (token: string): void => setAccessTokenInternal(token)
export const clearAccessToken = (): void => setAccessTokenInternal(null)

// Lets React components (see hooks/useAuth.ts) reactively subscribe to a value that lives
// outside React state via useSyncExternalStore.
export const subscribeAccessToken = (listener: () => void): (() => void) => {
  tokenListeners.add(listener)
  return () => tokenListeners.delete(listener)
}

const defaultAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

let isRedirectingToLogin = false

const clearAuthState = (options?: { notify?: boolean; message?: string }) => {
  clearAccessToken()
  localStorageService.removeItem(LOCAL_STORAGE_KEYS.user)

  if (isRedirectingToLogin) return
  isRedirectingToLogin = true

  if (options?.notify && options.message) {
    console.error(options.message)
  }

  setTimeout(() => {
    window.location.href = '/login'
  }, 1000)
}

const requestRefreshToken = async (): Promise<string> => {
  const res = await axios.post<{ data: RefreshTokenResponse }>(
    `${BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  )
  const token = res.data?.data?.access_token
  if (!token) throw new Error('Refresh response did not include an access token')
  setAccessToken(token)
  return token
}

// Used by the response interceptor when a request fails with 401/403 mid-session:
// a hard failure here means the session is really over, so it clears state and redirects.
export const handleRefreshToken = async (): Promise<string | null> => {
  try {
    return await requestRefreshToken()
  } catch (error) {
    clearAuthState({ notify: true, message: 'Session expired. Please log in again.' })
    throw error
  }
}

// Called once on app start. Silently tries to restore a session from the refresh_token cookie
// so a page reload doesn't lose the access token that now lives only in memory. Failure here is
// the normal "not logged in" case, not a session-expiry event, so it stays quiet (no redirect/toast)
// and just leaves the user on the login screen via the route guard in AppContainer.
export const bootstrapAuth = async (): Promise<boolean> => {
  const hasSessionHint = !!localStorageService.getItem(LOCAL_STORAGE_KEYS.user)
  if (!hasSessionHint) return false

  try {
    await requestRefreshToken()
    return true
  } catch {
    localStorageService.removeItem(LOCAL_STORAGE_KEYS.user)
    return false
  }
}

let pendingRefresh: Promise<string | null> | null = null

type RetryableConfig = AxiosRequestConfig & { _isRetry?: boolean }

const createResponseErrorHandler =
  (instance: AxiosInstance) =>
  async (error: { config: RetryableConfig; response: AxiosResponse }) => {
    const config = error.config
    const status = error.response?.status
    const isAuthError = status === 401 || status === 403

    if (isAuthError && !config._isRetry) {
      if (!pendingRefresh) {
        pendingRefresh = handleRefreshToken().finally(() => {
          pendingRefresh = null
        })
      }
      try {
        const token = await pendingRefresh
        if (token) {
          config._isRetry = true
          if (typeof config.headers?.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`)
          }
          return instance(config)
        }
      } catch {
        return Promise.reject(error)
      }
    }

    if (isAuthError) {
      clearAuthState()
    }

    return Promise.reject(error)
  }

defaultAxios.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token && typeof config.headers?.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

defaultAxios.interceptors.response.use(unwrapEnvelope, createResponseErrorHandler(defaultAxios))

const uploadAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

uploadAxios.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (typeof config.headers?.set === 'function') {
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    config.headers.set('Content-Type', 'multipart/form-data')
  }
  return config
})

uploadAxios.interceptors.response.use(unwrapEnvelope, createResponseErrorHandler(uploadAxios))

export { defaultAxios, uploadAxios }

export default defaultAxios
