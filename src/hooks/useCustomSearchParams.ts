import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type ParamValue = string | number | boolean | null | undefined
type ParamInput = ParamValue | ParamValue[]
type SearchParamsObject = Record<string, string | string[]>

const isValidValue = (value: ParamValue) => value !== undefined && value !== null && value !== ''

export const useCustomSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const get = useCallback((key: string) => searchParams.get(key), [searchParams])

  const getAll = useCallback((key: string) => searchParams.getAll(key), [searchParams])

  const getParamsAsObject = useCallback(
    (options?: { except: string[] }): SearchParamsObject => {
      const paramsObject: SearchParamsObject = {}

      searchParams.forEach((value, key) => {
        if (options?.except?.includes(key)) return

        const currentValue = paramsObject[key]

        if (currentValue === undefined) {
          paramsObject[key] = value
          return
        }

        if (Array.isArray(currentValue)) {
          currentValue.push(value)
          return
        }

        paramsObject[key] = [currentValue, value]
      })

      return paramsObject
    },
    [searchParams],
  )

  const set = useCallback(
    (key: string, value: ParamInput, options?: { replace?: boolean }) => {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete(key)

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (isValidValue(item)) nextParams.append(key, String(item))
        })
      } else if (isValidValue(value)) {
        nextParams.set(key, String(value))
      }

      setSearchParams(nextParams, { replace: options?.replace ?? true })
    },
    [searchParams, setSearchParams],
  )

  const add = useCallback(
    (key: string, value: ParamValue, options?: { replace?: boolean }) => {
      if (!isValidValue(value)) return
      const nextParams = new URLSearchParams(searchParams)
      nextParams.append(key, String(value))
      setSearchParams(nextParams, { replace: options?.replace ?? true })
    },
    [searchParams, setSearchParams],
  )

  const remove = useCallback(
    (key: string, options?: { replace?: boolean }) => {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete(key)
      setSearchParams(nextParams, { replace: options?.replace ?? true })
    },
    [searchParams, setSearchParams],
  )

  const clear = useCallback(
    (options?: { replace?: boolean }) => {
      setSearchParams({}, { replace: options?.replace ?? true })
    },
    [setSearchParams],
  )

  const setAll = useCallback(
    (nextParams: URLSearchParams, options?: { replace?: boolean }) => {
      setSearchParams(nextParams, { replace: options?.replace ?? true })
    },
    [setSearchParams],
  )

  return {
    searchParams,
    get,
    getAll,
    getParamsAsObject,
    set,
    setAll,
    add,
    remove,
    clear,
  }
}
