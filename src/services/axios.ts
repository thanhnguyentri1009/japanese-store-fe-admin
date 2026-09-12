import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { LOCAL_STORAGE_KEYS, localStorageService } from '../utils/localStorage'

const BASE_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'access_token'

interface RefreshTokenResponse {
  access_token: string
}

const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

const defaultAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

let isRedirectingToLogin = false

const clearAuthState = (options?: { notify?: boolean; message?: string }) => {
  removeToken()
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

export const handleRefreshToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post<RefreshTokenResponse>(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    const accessToken = res.data?.access_token
    if (accessToken) setToken(accessToken)
    return accessToken ?? null
  } catch (error) {
    clearAuthState({ notify: true, message: 'Session expired. Please log in again.' })
    throw error
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
  const token = getToken()

  if (token && typeof config.headers?.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

defaultAxios.interceptors.response.use(undefined, createResponseErrorHandler(defaultAxios))

const uploadAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

uploadAxios.interceptors.request.use((config) => {
  const token = getToken()

  if (typeof config.headers?.set === 'function') {
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    config.headers.set('Content-Type', 'multipart/form-data')
  }
  return config
})

uploadAxios.interceptors.response.use(undefined, createResponseErrorHandler(uploadAxios))

export { defaultAxios, uploadAxios }

export default defaultAxios
