export const formatMoney = (value: number | string, currency: 'VND' | 'USD' = 'VND'): string => {
  const numericValue = typeof value === 'string' ? Number(value) : value
  const formatted = numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (currency === 'USD') return `$${formatted}`
  return `₫${formatted}`
}
