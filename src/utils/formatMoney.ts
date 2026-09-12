export const formatMoney = (value: number, currency: 'VND' | 'USD' = 'VND'): string => {
  if (currency === 'USD') return `$${value.toLocaleString('en-US')}`
  return `₫${value.toLocaleString('vi-VN')}`
}
