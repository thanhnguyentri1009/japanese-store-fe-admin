import { useSyncExternalStore } from 'react'
import { getAccessToken, subscribeAccessToken } from '../services/axios'

export const useIsAuthenticated = (): boolean =>
  useSyncExternalStore(subscribeAccessToken, () => getAccessToken() !== null)
