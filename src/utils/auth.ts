import type { JwtPayload } from '../types/login'

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export const getRoleName = (role: JwtPayload['role'] | undefined): string => {
  if (!role) return ''
  if (typeof role === 'string') return role
  return role.name ?? ''
}

export const isAdminRole = (role: JwtPayload['role'] | undefined): boolean =>
  getRoleName(role).toLowerCase() === 'admin'
